import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Bookmark,
  Check,
  Wand2,
  Copy,
  RefreshCw,
  Sun,
  Briefcase,
  Moon,
  Layers,
} from 'lucide-react';
import { OutfitOption, OccasionType } from '../types/stylist';

interface OutfitShowcaseProps {
  outfits: OutfitOption[];
  onOpenEditModal: (outfit: OutfitOption) => void;
  onRegenerateImage: (outfit: OutfitOption) => void;
  onSaveOutfit: (outfit: OutfitOption) => void;
  isSaved: (outfitId: string) => boolean;
  onOpenStylistChat?: () => void;
}

export const OutfitShowcase: React.FC<OutfitShowcaseProps> = ({
  outfits,
  onOpenEditModal,
  onRegenerateImage,
  onSaveOutfit,
  isSaved,
  onOpenStylistChat,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('Casual');
  const [copiedOutfitId, setCopiedOutfitId] = useState<string | null>(null);

  const activeOutfit =
    outfits.find((o) => o.occasion.toLowerCase() === selectedOccasion.toLowerCase()) ||
    outfits[0];

  const handleCopyChecklist = (outfit: OutfitOption) => {
    const text = `VIRTUAL STYLIST · ${outfit.title.toUpperCase()} (${outfit.occasion.toUpperCase()})\n` +
      `Mood: ${outfit.mood}\n\n` +
      `PIECES:\n` +
      outfit.pieces
        .map(
          (p, i) =>
            `0${i + 1}. [${p.category.toUpperCase()}] ${p.name} (${p.color}, ${p.material})\n    Tip: ${p.stylingTip}`
        )
        .join('\n\n') +
      `\n\nCOLOR THEORY:\n${outfit.colorTheory}\n\nBALANCE RULE:\n${outfit.balanceRule}`;

    navigator.clipboard.writeText(text);
    setCopiedOutfitId(outfit.id);
    setTimeout(() => setCopiedOutfitId(null), 2000);
  };

  const handleDownloadImage = (outfit: OutfitOption) => {
    if (!outfit.flatLayImageUrl) return;
    const a = document.createElement('a');
    a.href = outfit.flatLayImageUrl;
    a.download = `flatlay-${outfit.occasion.toLowerCase()}-${outfit.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getOccasionIcon = (occ: OccasionType) => {
    switch (occ) {
      case 'Casual':
        return <Sun className="w-3.5 h-3.5" />;
      case 'Business':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Night Out':
        return <Moon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E7E2D9] gap-4">
          <div>
            <p className="text-xs uppercase font-medium tracking-widest text-[#9A3412] mb-1.5">
              The Curated Ensembles
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1917]">
              Three Complete Stylist Outfits
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1">
              Visualized as clean editorial flat-lays on textured linen fabric.
            </p>
          </div>

          {/* Interactive Occasion Selector (Segmented buttons per Frontend Constitution) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EBE7DF] border border-[#DDD6C8] shrink-0">
            {(['Casual', 'Business', 'Night Out'] as OccasionType[]).map((occ) => {
              const isActive = selectedOccasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1C1917] text-[#FAF8F5] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-[#78716C]'}>
                    {getOccasionIcon(occ)}
                  </span>
                  <span>{occ}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Outfit Detailed Workspace */}
        {activeOutfit && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6-7 Cols: The Clean Editorial Flat-Lay Visual Canvas */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E7E2D9] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EFEBE3]">
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <span className="uppercase tracking-wider font-semibold text-[#9A3412]">
                    {activeOutfit.occasion}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-editorial text-base text-[#1C1917] font-semibold">
                    {activeOutfit.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenStylistChat && (
                    <button
                      onClick={onOpenStylistChat}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#DDD6C8] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                      title="Debate this outfit with Jean-Luc"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9A3412]" />
                      <span>Ask Opinion</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenEditModal(activeOutfit)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#DDD6C8] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                    title="Edit pieces and scenery with text prompt"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#9A3412]" />
                    <span>Prompt Edit</span>
                  </button>

                  <button
                    onClick={() => onRegenerateImage(activeOutfit)}
                    disabled={activeOutfit.isGeneratingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#DDD6C8] text-xs font-medium text-[#1C1917] transition-colors disabled:opacity-50 cursor-pointer"
                    title="Regenerate high-resolution flat-lay"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 text-[#78716C] ${
                        activeOutfit.isGeneratingImage ? 'animate-spin text-[#9A3412]' : ''
                      }`}
                    />
                    <span>{activeOutfit.isGeneratingImage ? 'Rendering...' : 'Regen'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadImage(activeOutfit)}
                    className="p-1.5 text-[#78716C] hover:text-[#1C1917] border border-[#DDD6C8] hover:bg-[#F2ECE3] transition-colors cursor-pointer"
                    title="Download flat-lay board"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The Flat-Lay Canvas on Textured Linen */}
              <div className="relative aspect-square w-full bg-[#F6F4EE] bg-linen-subtle border border-[#E3DDD1] overflow-hidden flex items-center justify-center shadow-xs">
                {activeOutfit.flatLayImageUrl ? (
                  <img
                    src={activeOutfit.flatLayImageUrl}
                    alt={`${activeOutfit.title} flat-lay outfit`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-[#78716C]">
                    <Layers className="w-10 h-10 mx-auto mb-2 text-[#A8A29E]" />
                    <p className="text-xs">Preparing flat-lay rendering...</p>
                  </div>
                )}

                {/* Subtle Floating Editorial Caption */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-white/90 backdrop-blur-xs border border-[#E5E0D8] flex items-center justify-between text-[11px] text-[#57534E]">
                  <span className="truncate max-w-[70%]">
                    <strong className="text-[#1C1917] font-semibold">{activeOutfit.title}</strong> — {activeOutfit.mood}
                  </span>
                  <span className="font-mono text-[10px] text-[#9A3412] uppercase tracking-wider shrink-0">
                    Textured Linen Flat-Lay
                  </span>
                </div>
              </div>

              {/* Rationale & Color Theory */}
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D9]">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#9A3412] mb-1">
                    Color Theory Harmony
                  </h4>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    {activeOutfit.colorTheory}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D9]">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#9A3412] mb-1">
                    Stylist's Rule of Balance
                  </h4>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    {activeOutfit.balanceRule}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5-6 Cols: Piece Breakdown & Wardrobe Actions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFFFFF] border border-[#E7E2D9] p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DA]">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                      Curated Piece Breakdown
                    </h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      {activeOutfit.pieces.length} harmonized wardrobe coordinates
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyChecklist(activeOutfit)}
                    className="text-xs text-[#78716C] hover:text-[#9A3412] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedOutfitId === activeOutfit.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700 font-medium">Copied Checklist</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy List</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Piece Items List */}
                <div className="space-y-3">
                  {activeOutfit.pieces.map((piece, idx) => (
                    <div
                      key={piece.id || idx}
                      className={`p-3.5 border transition-all text-left ${
                        piece.isOriginalItem
                          ? 'bg-[#FAF5F0] border-[#E8D6C6]'
                          : 'bg-[#FCFAF7] border-[#ECE7DD] hover:border-[#D6CEBE]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-[#9A3412] font-semibold">
                            0{idx + 1}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
                            {piece.category}
                          </span>
                        </div>
                        {piece.isOriginalItem && (
                          <span className="text-[10px] uppercase font-semibold text-[#9A3412] bg-white border border-[#E2CEBC] px-1.5 py-0.5">
                            Your Statement Item
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-[#1C1917]">
                        {piece.name}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-[#57534E] mt-1">
                        <span>Color: <strong className="font-medium text-[#1C1917]">{piece.color}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Material: <strong className="font-medium text-[#1C1917]">{piece.material}</strong></span>
                      </div>

                      <p className="text-[11px] text-[#78716C] italic mt-1.5 pt-1.5 border-t border-[#ECE7DD]">
                        Stylist tip: {piece.stylingTip}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSaveOutfit(activeOutfit)}
                    className={`flex-1 py-2.5 px-4 text-xs uppercase tracking-wider font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSaved(activeOutfit.id)
                        ? 'bg-[#FAF5EE] border-[#9A3412] text-[#9A3412]'
                        : 'bg-[#1C1917] border-[#1C1917] text-[#FAF8F5] hover:bg-[#2E2A27]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved(activeOutfit.id) ? 'Saved in Capsule' : 'Save To Capsule'}</span>
                  </button>

                  <button
                    onClick={() => onOpenEditModal(activeOutfit)}
                    className="py-2.5 px-4 text-xs uppercase tracking-wider font-semibold border border-[#D6CEBF] bg-white hover:bg-[#F5F2EB] text-[#44403C] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#9A3412]" />
                    <span>AI Prompt Studio</span>
                  </button>
                </div>
              </div>

              {/* Quick Stylist Methodology Callout */}
              <div className="p-4 bg-[#F2EDE4] border border-[#DDD6C8] text-xs text-[#57534E] leading-relaxed">
                <span className="font-semibold text-[#1C1917] block mb-1">
                  Why this 3-Outfit Matrix works:
                </span>
                A great statement piece should never be a "one-wear" novelty. By pairing it with casual denim/knits, boardroom tailoring, and after-dark slipwear, you maximize wardrobe cost-per-wear and versatility.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
