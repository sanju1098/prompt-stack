'use server';

import mongoose from 'mongoose';
import type { CreatePromptAPIInput } from '@/global/types';
import dbConnect from '@/lib/database';
import { extractVariables, hydrateTemplate } from '@/lib/parser';
import Prompt from '@/models/Prompt';
import { geminiClient, groqClient } from './apiKeys';

/** Creates and saves a new prompt in MongoDB. */
export async function createPromptAction(input: CreatePromptAPIInput) {
  try {
    await dbConnect();
    const detectedVariables = extractVariables(input.template); // Auto-detect variables from the template string

    const newPrompt = await Prompt.create({
      ...input,
      variables: detectedVariables,
      tags: input.tags || [],
      category: input.category || 'General',
    });
    return { success: true, prompt: JSON.parse(JSON.stringify(newPrompt)) };
  } catch (error: any) {
    console.error('Error creating prompt:', error);
    return { success: false, error: 'Failed to create prompt. Please try again.' };
  }
}

/** Fetches all prompts from MongoDB with optional search and filtering. */
export async function getPromptsAction(searchQuery?: string, category?: string) {
  try {
    await dbConnect();
    const query: any = {};

    if (searchQuery && searchQuery.trim() !== '') {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { template: searchRegex }];
    }

    if (category && category !== 'All') {
      query.category = category;
    }
    const prompts = await Prompt.find(query).sort({ createdAt: -1 }).lean();
    return { success: true, prompts: JSON.parse(JSON.stringify(prompts)) };
  } catch (error: any) {
    console.error('Error fetching prompts:', error);
    return { success: false, error: 'Failed to fetch prompts', prompts: [] };
  }
}

/** Executes a saved prompt by ID with user-provided variable values. */
export async function runPromptAction(promptId: string, variableValues: Record<string, string>) {
  const startTime = Date.now();
  try {
    await dbConnect();
    const promptDoc = await Prompt.findById(promptId);
    if (!promptDoc) {
      return { success: false, error: 'Prompt not found' };
    }

    // Hydrate template with user-provided values
    const finalPrompt = hydrateTemplate(promptDoc.template, variableValues);
    const { provider, modelName, temperature, maxTokens } = promptDoc.modelConfig;

    let generatedText = '';

    if (provider === 'gemini') {
      const response = await geminiClient.models.generateContent({
        model: 'gemini-flash-latest', // Hardcoded / locked to Gemini 2.5 Flash
        contents: finalPrompt,
        config: {
          temperature: temperature ?? 0.7,
          maxOutputTokens: maxTokens ?? 1024,
          systemInstruction: promptDoc.systemInstruction || undefined,
        },
      });
      generatedText = response.text || 'No response returned from Gemini.';
    } else if (provider === 'groq') {
      const messages: any[] = [];
      if (promptDoc.systemInstruction) {
        messages.push({ role: 'system', content: promptDoc.systemInstruction });
      }
      messages.push({ role: 'user', content: finalPrompt });
      const completion = await groqClient.chat.completions.create({
        messages,
        model: modelName || 'llama-3.3-70b-versatile',
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens ?? 1024,
      });

      generatedText = completion.choices[0]?.message?.content || 'No response returned from Groq.';
    }
    const executionTimeMs = Date.now() - startTime;

    // Increment execution count in MongoDB asynchronously
    await Prompt.findByIdAndUpdate(promptId, { $inc: { executionCount: 1 } });
    return {
      success: true,
      output: generatedText,
      hydratedPrompt: finalPrompt,
      executionTimeMs,
    };
  } catch (error: any) {
    console.error('Error executing prompt:', error);
    return {
      success: false,
      error: error?.message || 'Execution failed. Please check your API keys.',
    };
  }
}

export async function getPromptById(id: string) {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'Invalid Prompt ID format. Please check the URL.',
        isInvalidId: true,
      };
    }

    await dbConnect();
    const prompt = await Prompt.findById(id).lean();

    if (!prompt) {
      return {
        success: false,
        error: 'Prompt not found in database.',
        isInvalidId: false,
      };
    }

    const serializedPrompt = JSON.parse(JSON.stringify(prompt));
    return {
      success: true,
      data: serializedPrompt,
    };
  } catch (error) {
    console.error('Error fetching prompt by ID:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the prompt.',
      isInvalidId: false,
    };
  }
}
