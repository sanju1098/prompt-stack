import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';

export const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
