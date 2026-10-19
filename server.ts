import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract mimeType and base64 from data URLs or raw strings
function parseBase64Image(dataString: string): { mimeType: string; data: string } {
  if (dataString.startsWith('data:')) {
    const matches = dataString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  return { mimeType: 'image/jpeg', data: dataString };
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 1. Analyze garment & generate 3 distinct complete outfits (Casual, Business, Night Out)
app.post('/api/stylist/analyze-and-outfit', async (req: Request, res: Response): Promise<void> => {
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
A user has uploaded a photo of a specific, difficult-to-match or statement wardrobe item.
Your job is to:
1. Conduct an in-depth visual analysis of the item (color swatches with exact hex codes and undertones, category, silhouette, pattern type, style tags, styling difficulty rating, and why it is challenging to style).
2. Curate 3 complete, distinct, highly wearable outfits featuring this item:
   - Casual (relaxed, effortless chic for weekend, daytime, coffee, travel)
   - Business / Smart-Casual (polished, architectural, corporate, executive, or client-ready)
   - Night Out (elevated, dramatic, cocktail, gala, dinner date, or evening event)
3. For each outfit, list 4 to 6 complementary pieces (top, bottom/skirt/trouser, outerwear, shoes, bag, jewelry, or layers) including the original item.
4. Provide the color theory rationale and the "Stylist's Rule of Balance" explaining why this outfit works.
5. Provide a rich, highly descriptive prompt to generate a clean, luxury editorial "flat-lay" photograph on a textured linen background showing all these pieces laid out together.

Follow this aesthetic strictly: Editorial luxury boutique, textured natural linen backdrop, diffused natural daylight, sophisticated balance of textures.
Tone: Expert, encouraging, precise, and stylish.`;

    const userPrompt = `Please analyze this uploaded clothing item and craft 3 complete outfits (Casual, Business, Night Out).
Context: ${fitNote} ${lensNote} ${seasonNote} ${userNotes}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: userPrompt,
        },
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
                itemName: { type: Type.STRING, description: 'Descriptive title of the uploaded piece' },
                category: { type: Type.STRING, description: 'E.g., Bottoms / Pleated Skirt, Outerwear / Blazer' },
                primaryColors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Color name, e.g., Emerald Green, Antique Ochre' },
                      hex: { type: Type.STRING, description: 'Accurate 6-character hex code starting with #' },
                      role: { type: Type.STRING, description: 'dominant, accent, undertone, or secondary' },
                      undertone: { type: Type.STRING, description: 'warm, cool, or neutral' },
                    },
                    required: ['name', 'hex', 'role', 'undertone'],
                  },
                },
                silhouette: { type: Type.STRING, description: 'Cut, drape, and structural shape description' },
                patternType: { type: Type.STRING, description: 'Print or surface texture description' },
                styleTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-5 descriptive style aesthetics (e.g. Quiet Luxury, Heritage Brocade)',
                },
                stylingDifficulty: {
                  type: Type.STRING,
                  description: 'Easy, Moderate, Challenging, or Expert Statement',
                },
                stylingChallenge: {
                  type: Type.STRING,
                  description: 'Concise explanation of why this item is tricky to match',
                },
                stylistCoreTip: {
                  type: Type.STRING,
                  description: 'Golden stylist rule for taming and elevating this piece',
                },
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
                  occasion: { type: Type.STRING, description: 'Casual, Business, or Night Out' },
                  title: { type: Type.STRING, description: 'Evocative outfit title' },
                  mood: { type: Type.STRING, description: 'Mood and vibe summary' },
                  pieces: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING, description: 'top, bottom, outerwear, shoes, bag, jewelry, accessory, layer' },
                        name: { type: Type.STRING, description: 'Specific garment or accessory item name' },
                        color: { type: Type.STRING, description: 'Precise shade/color' },
                        material: { type: Type.STRING, description: 'Fabric or metal material' },
                        stylingTip: { type: Type.STRING, description: 'How to wear, cuff, tuck, or pair this piece' },
                        isOriginalItem: { type: Type.BOOLEAN, description: 'True if this is the uploaded statement piece' },
                      },
                      required: ['id', 'category', 'name', 'color', 'material', 'stylingTip'],
                    },
                  },
                  colorTheory: {
                    type: Type.STRING,
                    description: 'Color theory rationale explaining harmony between all pieces',
                  },
                  balanceRule: {
                    type: Type.STRING,
                    description: 'Stylist rule on proportion, volume, and texture contrast',
                  },
                  stylistRationale: {
                    type: Type.STRING,
                    description: 'Why this complete ensemble looks intentional and cohesive',
                  },
                  flatLayPrompt: {
                    type: Type.STRING,
                    description: 'Detailed prompt to generate a flat-lay photography scene of this outfit on textured linen',
                  },
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
    res.json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error analyzing garment:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze garment and generate outfits.',
    });
  }
});

// 2. Generate clean flat-lay visualization using gemini-nano-banana-2.1 or gemini-3.1-flash-lite-image
app.post('/api/stylist/generate-flatlay', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, originalImage, aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required for flat-lay image generation.' });
      return;
    }

    const fullPrompt = `${prompt}. Visual presentation: A clean luxury editorial flat-lay fashion photograph with garments and accessories arranged neatly on a warm textured natural linen backdrop. Soft natural diffused morning light, delicate realistic drop shadows, no human bodies, no mannequins, pristine commercial fashion catalog look.`;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (originalImage) {
      const { mimeType, data: base64Data } = parseBase64Image(originalImage);
      parts.push({
        inlineData: { mimeType, data: base64Data },
      });
    }

    parts.push({ text: fullPrompt });

    // Try gemini-nano-banana-2.1 first; if unavailable or requires key upgrade, try gemini-3.1-flash-lite-image
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
    } catch (modelErr: unknown) {
      console.warn('gemini-nano-banana-2.1 attempt fallback to gemini-3.1-flash-lite-image:', (modelErr as Error).message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as '1:1' | '4:3' | '3:4') || '1:1',
          },
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
      res.status(502).json({ error: 'Image generation completed without visual output.' });
      return;
    }

    res.json({ imageUrl });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error generating flat-lay image:', error);
    res.status(500).json({ error: error.message || 'Failed to generate flat-lay image.' });
  }
});

// 3. Edit / refine flat-lay image via natural language text prompt
app.post('/api/stylist/edit-flatlay', async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentImage, editPrompt } = req.body;

    if (!currentImage || !editPrompt) {
      res.status(400).json({ error: 'currentImage and editPrompt are required.' });
      return;
    }

    const { mimeType, data: base64Data } = parseBase64Image(currentImage);

    const promptText = `Modify this fashion flat-lay photograph: ${editPrompt}. Maintain the clean editorial flat-lay styling on the textured natural linen backdrop, preserving the overall composition while applying the requested changes seamlessly.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: '1K',
          },
        },
      });
    } catch (modelErr: unknown) {
      console.warn('gemini-nano-banana-2.1 fallback to gemini-3.1-flash-lite-image for edit:', (modelErr as Error).message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
            {
              text: promptText,
            },
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

    res.json({ imageUrl, note: `Applied edit: "${editPrompt}"` });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error editing flat-lay image:', error);
    res.status(500).json({ error: error.message || 'Failed to edit flat-lay image.' });
  }
});

// 4. Multi-turn AI Stylist Chatbot with honest critique & inline image design
app.post('/api/stylist/chat', async (req: Request, res: Response): Promise<void> => {
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

    // Determine target model
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
You possess razor-sharp color sensitivity, deep knowledge of silhouette proportions, and an encyclopedic command of fashion history (from 90s minimalism to avant-garde streetwear and bespoke tailoring).

YOUR EDITORIAL PERSONA:
1. Honest, Discerning & Constructive: You do NOT offer empty flattery. If an outfit or garment pairing is visually overwhelming, unflattering to proportions, or muddies color undertones, you candidly explain why (e.g. "That will drown your frame", "Those fabrics compete for dominance instead of conversing").
2. High-Fashion Solutions: You immediately offer elevated, wearable corrections with specific fabrics, silhouettes, and jewelry anchors.
3. Tone: Refined, confident, articulate, and encouraging—like an editor-in-chief in a private wardrobe consultation.
${garmentInfo}
${outfitInfo}

IMAGE DESIGN CAPABILITY:
When the user asks you to:
- Design a new outfit, visual, or flat-lay (e.g., "Design an outfit with...", "Show me a flat-lay of...", "Create a look for a winter wedding")
- Or if you propose a distinctly fresh visual ensemble variation that would benefit from flat-lay visualization,
you MUST append a structured tag at the very end of your response in this exact format:
[[DESIGN_FLATLAY: {
  "title": "Short Evocative Outfit Title",
  "prompt": "Detailed description of garments and accessories arranged neatly flat on a warm textured natural linen backdrop, luxury editorial flat-lay photo, soft daylight shadows",
  "pieces": ["Piece 1 Name", "Piece 2 Name", "Piece 3 Name", "Piece 4 Name"]
}]]

Keep your conversational commentary concise, engaging, stylish, and direct (2-4 paragraphs).`;

    // Map conversation history to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // If explicit image design is requested in this turn, hint the model to generate the block
    if (requestImageDesign) {
      const lastMsg = contents[contents.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        lastMsg.parts[0].text += '\n(Please also design and provide the flat-lay image prompt for this look using the [[DESIGN_FLATLAY: ...]] tag).';
      }
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    const fullResponseText = response.text || '';

    // Check if flat-lay image design tag was generated
    let cleanReply = fullResponseText;
    let designedImageData: any = null;
    const flatLayMatch = fullResponseText.match(/\[\[DESIGN_FLATLAY:\s*([\s\S]*?)\]\]/);

    if (flatLayMatch && flatLayMatch[1]) {
      try {
        const flatLayConfig = JSON.parse(flatLayMatch[1].trim());
        cleanReply = fullResponseText.replace(/\[\[DESIGN_FLATLAY:[\s\S]*?\]\]/, '').trim();

        // Synthesize the flat-lay image using gemini-nano-banana-2.1
        const imagePrompt = `${flatLayConfig.prompt}. Clean luxury editorial flat-lay fashion photograph with garments laid neatly on natural textured raw linen backdrop, soft diffused side daylight, realistic drop shadows, no human bodies, no mannequins, pristine commercial fashion catalog look.`;

        let imgResponse;
        try {
          imgResponse = await ai.models.generateContent({
            model: 'gemini-nano-banana-2.1',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
              imageConfig: {
                aspectRatio: '1:1',
                imageSize: '1K',
              },
            },
          });
        } catch (imgErr: unknown) {
          console.warn('Chat image design fallback to gemini-3.1-flash-lite-image:', (imgErr as Error).message);
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
            title: flatLayConfig.title || 'Curated Atelier Flat-Lay',
            pieces: flatLayConfig.pieces || [],
          };
        }
      } catch (parseErr) {
        console.warn('Failed to parse or render DESIGN_FLATLAY block:', parseErr);
      }
    }

    res.json({
      reply: cleanReply,
      designedImage: designedImageData,
      modelUsed: targetModel,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Stylist chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete stylist chat turn.' });
  }
});


// Vite dev server mounting or static production build serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Virtual Stylist server active on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
