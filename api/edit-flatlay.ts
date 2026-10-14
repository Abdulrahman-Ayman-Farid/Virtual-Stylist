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
    const { currentImage, editPrompt } = req.body;
    if (!currentImage || !editPrompt) {
      res.status(400).json({ error: 'currentImage and editPrompt are required.' });
      return;
    }

    const { mimeType, data: base64Data } = parseBase64Image(currentImage);
    const promptText = `Modify this fashion flat-lay photograph: ${editPrompt}. Maintain the clean editorial flat-lay styling on the textured natural linen backdrop.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: promptText },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: '1K',
          },
        },
      });
    } catch (err: unknown) {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: promptText },
          ],
        },
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
      res.status(502).json({ error: 'Image editing did not return an updated visual.' });
      return;
    }

    res.status(200).json({ imageUrl, note: `Applied edit: "${editPrompt}"` });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
