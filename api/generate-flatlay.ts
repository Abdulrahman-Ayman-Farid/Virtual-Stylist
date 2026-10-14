interface VercelRequest {
  method?: string;
  body: any;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string | string[]>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  end: () => void;
}
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function parseBase64Image(dataString: string): { mimeType: string; data: string } {
  if (dataString.startsWith('data:')) {
    const matches = dataString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: dataString };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, originalImage, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const fullPrompt = `${prompt}. Visual presentation: A clean luxury editorial flat-lay fashion photograph with garments and accessories arranged neatly on a warm textured natural linen backdrop. Soft natural diffused morning light, delicate realistic drop shadows, no human bodies, no mannequins.`;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    if (originalImage) {
      const { mimeType, data: base64Data } = parseBase64Image(originalImage);
      parts.push({ inlineData: { mimeType, data: base64Data } });
    }
    parts.push({ text: fullPrompt });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as '1:1' | '4:3' | '3:4') || '1:1',
            imageSize: '1K',
          },
        },
      });
    } catch (err: unknown) {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
      });
    }

    let imageUrl = '';
    const candidateParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of candidateParts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      res.status(502).json({ error: 'No image generated' });
      return;
    }

    res.status(200).json({ imageUrl });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
