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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      messages = [],
      garmentContext,
      activeOutfit,
      modelPreference = 'gemini-3.8-flash',
      requestImageDesign = false,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Conversation history is required.' });
      return;
    }

    let targetModel = 'gemini-3.8-flash';
    if (modelPreference === 'gemini-4-argon') {
      targetModel = 'gemini-4-argon';
    } else if (modelPreference === 'gemini-3.1-flash-lite') {
      targetModel = 'gemini-3.1-flash-lite';
    }

    const garmentInfo = garmentContext
      ? `\nActive Garment Being Styled:
- Item: ${garmentContext.itemName} (${garmentContext.category})
- Silhouette: ${garmentContext.silhouette}
- Pattern/Texture: ${garmentContext.patternType}
- Palette Undertones: ${garmentContext.primaryColors?.map((c: any) => `${c.name} (${c.hex}, ${c.undertone})`).join(', ')}
- Styling Difficulty: ${garmentContext.stylingDifficulty}
- Styling Dilemma: ${garmentContext.stylingChallenge}
- Golden Rule: ${garmentContext.stylistCoreTip}`
      : '\nNo specific garment is currently staged.';

    const outfitInfo = activeOutfit
      ? `\nCurrent Active Outfit in Showcase:
- Occasion: ${activeOutfit.occasion}
- Title: ${activeOutfit.title}
- Mood: ${activeOutfit.mood}
- Coordinated Pieces: ${activeOutfit.pieces?.map((p: any) => `${p.name} [${p.category}] in ${p.color} (${p.material})`).join(' · ')}
- Color Theory: ${activeOutfit.colorTheory}
- Balance Rule: ${activeOutfit.balanceRule}`
      : '';

    const systemInstruction = `You are "Jean-Luc", Senior Fashion Editorial Director and Haute Couture Styling Advisor.
You possess razor-sharp color sensitivity, deep knowledge of silhouette proportions, and an encyclopedic command of fashion history.
PERSONA: Honest, discerning, constructive, sophisticated, and articulate.
${garmentInfo}
${outfitInfo}
IMAGE DESIGN:
When asked to design an outfit or when proposing a fresh visual ensemble, append:
[[DESIGN_FLATLAY: {
  "title": "Short Title",
  "prompt": "Description of flat-lay outfit on natural textured linen...",
  "pieces": ["Piece 1", "Piece 2", "Piece 3"]
}]]`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (requestImageDesign) {
      const lastMsg = contents[contents.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        lastMsg.parts[0].text += '\n(Please also design and provide the flat-lay image prompt for this look using the [[DESIGN_FLATLAY: ...]] tag).';
      }
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: { systemInstruction },
    });

    const fullResponseText = response.text || '';
    let cleanReply = fullResponseText;
    let designedImageData: any = null;
    const flatLayMatch = fullResponseText.match(/\[\[DESIGN_FLATLAY:\s*([\s\S]*?)\]\]/);

    if (flatLayMatch && flatLayMatch[1]) {
      try {
        const flatLayConfig = JSON.parse(flatLayMatch[1].trim());
        cleanReply = fullResponseText.replace(/\[\[DESIGN_FLATLAY:[\s\S]*?\]\]/, '').trim();
        const imagePrompt = `${flatLayConfig.prompt}. Clean luxury editorial flat-lay fashion photograph on textured linen backdrop.`;

        let imgResponse;
        try {
          imgResponse = await ai.models.generateContent({
            model: 'gemini-nano-banana-2.1',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
              imageConfig: { aspectRatio: '1:1', imageSize: '1K' },
            },
          });
        } catch {
          imgResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts: [{ text: imagePrompt }] },
          });
        }

        let imageUrl = '';
        const candidateParts = imgResponse.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (imageUrl) {
          designedImageData = {
            url: imageUrl,
            prompt: flatLayConfig.prompt,
            title: flatLayConfig.title || 'Curated Flat-Lay',
            pieces: flatLayConfig.pieces || [],
          };
        }
      } catch (e) {
        console.warn('Failed to parse flat-lay block:', e);
      }
    }

    res.status(200).json({
      reply: cleanReply,
      designedImage: designedImageData,
      modelUsed: targetModel,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
