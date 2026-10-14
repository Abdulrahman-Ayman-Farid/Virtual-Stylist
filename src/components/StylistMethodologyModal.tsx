import React from 'react';
import { X, BookOpen, Scale, Sparkles, Droplets } from 'lucide-react';

interface StylistMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StylistMethodologyModal: React.FC<StylistMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FAF8F5] border border-[#E2DDD3] w-full max-w-3xl p-6 sm:p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 mb-6 border-b border-[#E7E2D9]">
          <div className="flex items-center gap-1.5 text-xs text-[#9A3412] font-semibold uppercase tracking-widest mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Atelier Codex</span>
          </div>
          <h3 className="font-editorial text-3xl font-semibold text-[#1C1917]">
            The Three Invariants of Styling
          </h3>
          <p className="text-xs text-[#57534E] mt-1">
            How editorial stylists transform any "impossible to wear" garment into high-fashion coherence.
          </p>
        </div>

        <div className="space-y-6">
          {/* Rule 1 */}
          <div className="p-5 bg-white border border-[#E7E2D9] flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#9A3412] flex items-center justify-center shrink-0 border border-[#E9D6C3]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917] mb-1">
                01. The Principle of Volumetric Counterweight
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                If your statement piece carries dramatic volume (such as wide-leg wool trousers, tiered ruffles, or an accordion pleated skirt), the coordinate directly opposite MUST be streamlined or structured. A wide bottom requires a fitted knit, slim bodysuit, or architectural shoulders. Never stack billowing volume on top of billowing volume.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-5 bg-white border border-[#E7E2D9] flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#9A3412] flex items-center justify-center shrink-0 border border-[#E9D6C3]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917] mb-1">
                02. The High-Low Dialectic
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Statement items fail most often because they are styled with equally high-formality pieces, turning them into costumes. To make a lustrous emerald satin skirt or ornate floral jacquard blazer look effortless, pair it with unpolished everyday textures: washed cotton tees, vintage rigid denim, or low-top white sneakers.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-5 bg-white border border-[#E7E2D9] flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#9A3412] flex items-center justify-center shrink-0 border border-[#E9D6C3]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917] mb-1">
                03. The Neutral Grounding Anchor
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                When working with high-chroma colors (cobalt, saffron, emerald) or complex patterns (jacquard, leopard, plaid), identify the background neutral or temperature undertone. Anchor the rest of the outfit in warm organic neutrals (camel, oatmeal, espresso, cream) rather than stark jet black, creating rich editorial depth.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#EAE5DA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#2E2A27] transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
