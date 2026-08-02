'use server';

import databaseConnect from '@/lib/database';
import { extractVariables } from '@/lib/parser';
import Prompt from '@/models/Prompt';
import Template from '@/models/Templates';

/**
 * Fetches public templates from MongoDB with optional search query and category filter.
 */
export async function getTemplatesAction(searchQuery?: string, category?: string) {
  try {
    await databaseConnect();

    const query: Record<string, any> = {};

    if (searchQuery && searchQuery.trim() !== '') {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { template: searchRegex }];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort featured templates first, then by popularity (uses)
    const templates = await Template.find(query)
      // .sort({ isFeatured: -1, uses: -1, createdAt: -1 })
      .lean();

    return {
      success: true,
      templates: JSON.parse(JSON.stringify(templates)),
    };
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return {
      success: false,
      error: 'Failed to retrieve templates.',
      templates: [],
    };
  }
}

/**
 * Forks a public Template into the user's Prompt library.
 * 1. Increments the `uses` count on the Template.
 * 2. Creates a new Prompt entry in the user's collection.
 */
export async function forkTemplateAction(templateId: string) {
  try {
    await databaseConnect();

    const templateDoc = await Template.findById(templateId);
    if (!templateDoc) {
      return { success: false, error: 'Template not found.' };
    }

    // 1. Increment template usage count
    await Template.findByIdAndUpdate(templateId, { $inc: { uses: 1 } });

    // 2. Derive/extract variables
    const variables =
      templateDoc.variables && templateDoc.variables.length > 0
        ? templateDoc.variables
        : extractVariables(templateDoc.template);

    // 3. Create & save new Prompt (Avoids Model.create overload issues)
    const newPrompt = new Prompt({
      title: `${templateDoc.title} (Fork)`,
      description: templateDoc.description,
      template: templateDoc.template,
      category: templateDoc.category,
      tags: templateDoc.tags || [],
      variables,
      systemInstruction: templateDoc.systemInstruction || '',
      modelConfig: templateDoc.modelConfig || {
        provider: 'gemini',
        modelName: 'gemini-2.5-flash',
        temperature: 0.7,
        maxTokens: 1024,
      },
      executionCount: 0,
    });

    await newPrompt.save();

    return {
      success: true,
      promptId: newPrompt._id.toString(), // TypeScript now knows _id exists!
      prompt: JSON.parse(JSON.stringify(newPrompt)),
    };
  } catch (error: any) {
    console.error('Error forking template:', error);
    return {
      success: false,
      error: error?.message || 'Failed to fork template into library.',
    };
  }
}

/**
 * Optional Helper: Seeds static templates into MongoDB if the Template collection is empty.
 */
export async function seedTemplatesAction(initialTemplates: any[]) {
  try {
    await databaseConnect();

    const count = await Template.countDocuments();
    if (count > 0) {
      return { success: true, message: 'Templates already seeded.', count };
    }

    const created = await Template.insertMany(
      initialTemplates.map((t) => ({
        ...t,
        variables: t.variables || extractVariables(t.template),
      }))
    );

    return {
      success: true,
      message: `Successfully seeded ${created.length} templates.`,
    };
  } catch (error: any) {
    console.error('Error seeding templates:', error);
    return { success: false, error: 'Seeding failed.' };
  }
}

export async function createTemplateAction(data: {
  title: string;
  description?: string;
  template: string;
  category: string;
  systemInstruction?: string;
  author?: string;
  isFeatured?: boolean;
  variables?: string[];
  modelConfig?: {
    provider: string;
    modelName: string;
    temperature: number;
    maxTokens: number;
  };
}) {
  try {
    await databaseConnect();

    const newTemplate = new Template({
      ...data,
      variables: data.variables || extractVariables(data.template),
      uses: 0,
    });

    await newTemplate.save();

    return {
      success: true,
      template: JSON.parse(JSON.stringify(newTemplate)),
    };
  } catch (error: any) {
    console.error('Error creating template:', error);
    return {
      success: false,
      error: error?.message || 'Failed to create template document.',
    };
  }
}

/**
 * Fetches a single template by ID from MongoDB.
 */
export async function getTemplateById(id: string) {
  try {
    const mongoose = (await import('mongoose')).default;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid Template ID format. Please check the URL.',
        isInvalidId: true,
      };
    }

    await databaseConnect();
    const template = await Template.findById(id).lean();

    if (!template) {
      return {
        success: false,
        error: 'Template not found in database.',
        isInvalidId: false,
      };
    }

    const serializedTemplate = JSON.parse(JSON.stringify(template));
    return {
      success: true,
      data: serializedTemplate,
    };
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the template.',
      isInvalidId: false,
    };
  }
}
