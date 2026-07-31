import mongoose, { Document, Model, Schema } from 'mongoose';
import type { ModelConfig } from '@/global/types';

export interface IPrompt extends Document {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  template: string;
  variables: string[];
  systemInstruction?: string;
  modelConfig: ModelConfig;
  executionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a prompt title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    template: {
      type: String,
      required: [true, 'Please provide a prompt template'],
    },
    variables: [
      {
        type: String,
      },
    ],
    systemInstruction: {
      type: String,
    },
    modelConfig: {
      provider: {
        type: String,
        enum: ['gemini', 'groq'],
        default: 'gemini',
      },
      modelName: {
        type: String,
        default: 'gemini-2.5-flash',
      },
      temperature: {
        type: Number,
        default: 0.7,
        min: 0,
        max: 2,
      },
      maxTokens: {
        type: Number,
        default: 1024,
      },
    },
    executionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Add a text index to enable instant text search across titles, descriptions, and templates
PromptSchema.index({ title: 'text', description: 'text', template: 'text' });

// Ensure model re-use during Next.js hot reloading
const Prompt: Model<IPrompt> =
  mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);

export default Prompt;
