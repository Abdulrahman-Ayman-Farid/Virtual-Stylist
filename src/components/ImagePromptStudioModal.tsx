import React, { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Check, ArrowRight, CornerDownLeft } from 'lucide-react';
import { OutfitOption } from '../types/stylist';

interface ImagePromptStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitOption | null;
  onApplyUpdatedImage: (outfitId: string, newImageUrl: string) => void;
}

const QUICK_PROMPTS = [
  'Swap the shoes for crisp white minimalist leather sneakers with gum soles',
  'Add a vintage double-faced camel wool trench coat draped alongside',
  'Add sculptural chunky brushed gold dome earrings and a signet ring',
  'Change the background to dark weathered rustic oak floorboards',
  'Make it autumn-weather ready with a tailored cashmere scarf and leather gloves',
  'Replace the structured handbag with a relaxed woven leather crossbody pouch',
];

export const ImagePromptStudioModal: React.FC<ImagePromptStudioModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onApplyUpdatedImage,
}) => {
  if (!isOpen || !outfit) return null;

  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(outfit.flatLayImageUrl || '');
  const [editHistory, setEditHistory] = useState<string[]>([]);

  const handleEditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/stylist/edit-flatlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentImage: currentPreviewUrl,
          editPrompt: promptInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit flat-lay image.');
      }

      if (data.imageUrl) {
        setCurrentPreviewUrl(data.imageUrl);
        setEditHistory((prev) => [promptInput, ...prev]);
        setPromptInput('');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Edit error:', error);
      setErrorMessage(
        error.message ||
          'Failed to refine flat-lay image. You can try a different prompt or check your key.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApplyUpdatedImage(outfit.id, currentPreviewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FAF8F5] border border-[#E2DDD3] w-full max-w-4xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 mb-6 border-b border-[#E7E2D9]">
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <span className="uppercase tracking-widest font-semibold text-[#9A3412]">
              Interactive Flat-Lay Studio
            </span>
            <span aria-hidden="true">·</span>
            <span>gemini-nano-banana-2.1</span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Prompt-Driven Outfit Customizer
          </h3>
          <p className="text-xs text-[#57534E] mt-1">
            Want to swap the shoes, add a trench coat, or tweak the accessories? Enter a styling prompt below to edit the flat-lay board.
          </p>
        </div>

        {/* Studio Workspace Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Visual Preview */}
          <div className="md:col-span-6 bg-[#FFFFFF] border border-[#E2DDD3] p-4 text-center">
            <div className="relative aspect-square w-full bg-[#F5F2EB] bg-linen-subtle border border-[#E3DDD1] overflow-hidden flex items-center justify-center">
              {currentPreviewUrl ? (
                <img
                  src={currentPreviewUrl}
                  alt="Flat-lay preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-xs text-[#78716C]">No image available</p>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-[#9A3412] animate-spin mb-3" />
                  <p className="text-xs font-semibold text-[#1C1917]">
                    Generating High-Resolution Flat-Lay Edit...
                  </p>
                  <p className="text-[11px] text-[#78716C] mt-1">
                    Applying your prompt using gemini-nano-banana-2.1
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#78716C] mt-2">
              Showing current state for <strong>{outfit.title}</strong>
            </p>
          </div>

          {/* Prompt Controls & Preset Suggestions */}
          <div className="md:col-span-6 space-y-4">
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                Your Styling Prompt:
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Swap the heels for white leather sneakers, add a camel overcoat on the left, and include gold hoop earrings..."
                  className="w-full text-xs p-3 bg-white border border-[#DDD6C8] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#9A3412] focus:ring-1 focus:ring-[#9A3412] resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-[#78716C]">
                  Powered by Gemini Nano Banana 2.1
                </span>
                <button
                  type="submit"
                  disabled={isProcessing || !promptInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9A3412] hover:bg-[#7C2D12] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Generating...' : 'Apply Prompt'}</span>
                </button>
              </div>
            </form>

            {/* Error Notice */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Quick Inspiration Chips */}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Quick Stylist Modifications:</span>
              </p>
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map((quick, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptInput(quick)}
                    className="w-full text-left text-[11px] text-[#44403C] p-2 bg-white border border-[#E7E2D9] hover:border-[#9A3412] hover:bg-[#FAF8F5] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">{quick}</span>
                    <CornerDownLeft className="w-3 h-3 text-[#A8A29E] group-hover:text-[#9A3412] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Applied Edit History */}
            {editHistory.length > 0 && (
              <div className="pt-2 border-t border-[#ECE7DD]">
                <p className="text-[10px] uppercase tracking-wider text-[#78716C] mb-1">
                  Applied in this session:
                </p>
                <ul className="text-[11px] text-[#57534E] space-y-0.5 list-disc pl-4">
                  {editHistory.map((h, i) => (
                    <li key={i} className="truncate">{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#EAE5DA] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1C1917] hover:bg-[#2E2A27] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save to Outfit Board</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
