import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  description?: string;
  template: string;
  category: string;
  tags: string[];
  variables: string[];
  author: string;
  uses: number;
  isFeatured: boolean;
  systemInstruction?: string;
  modelConfig: {
    provider: string;
    modelName: string;
    temperature: number;
    maxTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    template: { type: String, required: true },
    category: { type: String, required: true, default: 'General' },
    tags: { type: [String], default: [] },
    variables: { type: [String], default: [] },
    author: { type: String, default: 'PromptVault' },
    uses: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    systemInstruction: { type: String, default: '' },
    modelConfig: {
      provider: { type: String, default: 'gemini' },
      modelName: { type: String, default: 'gemini-2.5-flash' },
      temperature: { type: Number, default: 0.7 },
      maxTokens: { type: Number, default: 1024 },
    },
  },
  {
    timestamps: true,
  }
);

// Reuse existing model or compile a new one (prevents Next.js hot-reload compilation errors)
const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;
