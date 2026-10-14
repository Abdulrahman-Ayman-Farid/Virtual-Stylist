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
import { GoogleGenAI, Type } from '@google/genai';

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
    const { image, preferences } = req.body;
    if (!image) {
      res.status(400).json({ error: 'An image of the statement item is required.' });
      return;
    }

    const { mimeType, data: base64Data } = parseBase64Image(image);
    const fitNote = preferences?.fit ? `Fit preference: ${preferences.fit}.` : '';
    const lensNote = preferences?.lens ? `Styling lens: ${preferences.lens}.` : '';
    const seasonNote = preferences?.season ? `Seasonality: ${preferences.season}.` : '';
    const userNotes = preferences?.notes ? `User notes: ${preferences.notes}.` : '';

    const systemInstruction = `You are a world-class luxury editorial fashion stylist and color theorist for high-end publications (Vogue, Harper's Bazaar, GQ).
Analyze the uploaded statement wardrobe item, extract color swatches with exact hex codes and undertones, and curate 3 complete distinct outfits (Casual, Business, Night Out) with itemized coordinates and detailed flat-lay prompt.`;

    const userPrompt = `Analyze this piece and generate 3 complete outfits (Casual, Business, Night Out). ${fitNote} ${lensNote} ${seasonNote} ${userNotes}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { inlineData: { mimeType, data: base64Data } },
        { text: userPrompt },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                category: { type: Type.STRING },
                primaryColors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING },
                      role: { type: Type.STRING },
                      undertone: { type: Type.STRING },
                    },
                    required: ['name', 'hex', 'role', 'undertone'],
                  },
                },
                silhouette: { type: Type.STRING },
                patternType: { type: Type.STRING },
                styleTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                stylingDifficulty: { type: Type.STRING },
                stylingChallenge: { type: Type.STRING },
                stylistCoreTip: { type: Type.STRING },
              },
              required: [
                'itemName',
                'category',
                'primaryColors',
                'silhouette',
                'patternType',
                'styleTags',
                'stylingDifficulty',
                'stylingChallenge',
                'stylistCoreTip',
              ],
            },
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  occasion: { type: Type.STRING },
                  title: { type: Type.STRING },
                  mood: { type: Type.STRING },
                  pieces: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING },
                        name: { type: Type.STRING },
                        color: { type: Type.STRING },
                        material: { type: Type.STRING },
                        stylingTip: { type: Type.STRING },
                        isOriginalItem: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'category', 'name', 'color', 'material', 'stylingTip'],
                    },
                  },
                  colorTheory: { type: Type.STRING },
                  balanceRule: { type: Type.STRING },
                  stylistRationale: { type: Type.STRING },
                  flatLayPrompt: { type: Type.STRING },
                },
                required: [
                  'id',
                  'occasion',
                  'title',
                  'mood',
                  'pieces',
                  'colorTheory',
                  'balanceRule',
                  'stylistRationale',
                  'flatLayPrompt',
                ],
              },
            },
          },
          required: ['analysis', 'outfits'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.status(200).json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Vercel API error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
