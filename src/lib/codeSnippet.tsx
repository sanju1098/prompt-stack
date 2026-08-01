import { Prompt } from '@/global';

export const nodeSnippet = (model: string, prompt: Prompt): string => {
  const isGemini = model?.toLowerCase() === 'gemini';
  const { template, modelConfig, systemInstruction } = prompt;
  const escapedTemplate = template.replace(/`/g, '\\`');

  if (isGemini) {
    const sysInst = systemInstruction
      ? `\n      systemInstruction: \`${systemInstruction.replace(/`/g, '\\`')}\`,`
      : '';

    return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runPrompt(variables: Record<string, string>) {
  let promptText = \`${escapedTemplate}\`;
  Object.entries(variables).forEach(([key, val]) => {
    promptText = promptText.replace(new RegExp(\`{{\\\\s*\${key}\\\\s*}}\`, 'g'), val);
  });

  const response = await ai.models.generateContent({
    model: '${modelConfig.modelName}',
    contents: promptText,
    config: {
      temperature: ${modelConfig.temperature},${sysInst}
    },
  });

  return response.text;
}`;
  }

  const sysMsg = systemInstruction
    ? `{ role: 'system', content: \`${systemInstruction.replace(/`/g, '\\`')}\` },\n      `
    : '';

  return `import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runPrompt(variables: Record<string, string>) {
  let promptText = \`${escapedTemplate}\`;
  Object.entries(variables).forEach(([key, val]) => {
    promptText = promptText.replace(new RegExp(\`{{\\\\s*\${key}\\\\s*}}\`, 'g'), val);
  });

  const completion = await groq.chat.completions.create({
    messages: [
      ${sysMsg}{ role: 'user', content: promptText }
    ],
    model: '${modelConfig.modelName}',
    temperature: ${modelConfig.temperature},
  });

  return completion.choices[0]?.message?.content;
}`;
};

export const pythonSnippet = (model: string, prompt: Prompt): string => {
  const isGemini = model?.toLowerCase() === 'gemini';
  const { template, modelConfig, systemInstruction } = prompt;

  if (isGemini) {
    const sysInst = systemInstruction
      ? `\n            "system_instruction": """${systemInstruction}""",`
      : '';

    return `import os
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def run_prompt(variables: dict):
    template = """${template}"""
    for key, val in variables.items():
        template = template.replace(f"{{{{{key}}}}}", str(val))
        
    response = client.models.generate_content(
        model="${modelConfig.modelName}",
        contents=template,
        config={
            "temperature": ${modelConfig.temperature},${sysInst}
        }
    )
    return response.text`;
  }

  const sysMsg = systemInstruction
    ? `messages.append({"role": "system", "content": """${systemInstruction}"""})\n    `
    : '';

  return `import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def run_prompt(variables: dict):
    template = """${template}"""
    for key, val in variables.items():
        template = template.replace(f"{{{{{key}}}}}", str(val))
        
    messages = []
    ${sysMsg}messages.append({"role": "user", "content": template})

    completion = client.chat.completions.create(
        model="${modelConfig.modelName}",
        messages=messages,
        temperature=${modelConfig.temperature}
    )
    return completion.choices[0].message.content`;
};
