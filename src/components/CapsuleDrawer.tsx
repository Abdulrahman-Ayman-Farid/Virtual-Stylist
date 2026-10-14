import React from 'react';
import { X, Trash2, Download, ExternalLink, Bookmark } from 'lucide-react';
import { OutfitOption } from '../types/stylist';

interface CapsuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: OutfitOption[];
  onRemoveOutfit: (outfitId: string) => void;
  onSelectOutfit: (outfit: OutfitOption) => void;
}

export const CapsuleDrawer: React.FC<CapsuleDrawerProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  onRemoveOutfit,
  onSelectOutfit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF8F5] border-l border-[#E2DDD3] h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E7E2D9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#9A3412] font-semibold uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Wardrobe Capsule</span>
            </div>
            <h3 className="font-editorial text-2xl font-semibold text-[#1C1917] mt-0.5">
              Saved Outfits ({savedOutfits.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedOutfits.length === 0 ? (
            <div className="text-center py-16 text-[#78716C]">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-[#A8A29E]" />
              <p className="text-sm font-medium text-[#1C1917]">Your capsule is empty</p>
              <p className="text-xs text-[#78716C] mt-1 max-w-xs mx-auto">
                Save outfits from the stylist showcase to build your reference collection.
              </p>
            </div>
          ) : (
            savedOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white border border-[#E7E2D9] p-4 text-left group hover:border-[#9A3412] transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9A3412] bg-[#FAF5EE] px-1.5 py-0.5">
                    {outfit.occasion}
                  </span>
                  <button
                    onClick={() => onRemoveOutfit(outfit.id)}
                    className="text-[#A8A29E] hover:text-red-700 p-1 transition-colors cursor-pointer"
                    title="Remove from capsule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  {outfit.flatLayImageUrl && (
                    <div className="w-20 h-20 bg-[#F5F2EB] border border-[#DDD6C8] overflow-hidden shrink-0">
                      <img
                        src={outfit.flatLayImageUrl}
                        alt={outfit.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-[#1C1917] truncate">
                      {outfit.title}
                    </h4>
                    <p className="text-[11px] text-[#78716C] line-clamp-2 mt-0.5">
                      {outfit.mood}
                    </p>
                    <p className="text-[10px] text-[#A8A29E] mt-1">
                      {outfit.pieces.length} coordinated pieces
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      onSelectOutfit(outfit);
                      onClose();
                    }}
                    className="text-[#9A3412] hover:text-[#7C2D12] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View in Showcase</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {outfit.flatLayImageUrl && (
                    <a
                      href={outfit.flatLayImageUrl}
                      download={`capsule-${outfit.id}.png`}
                      className="text-[#78716C] hover:text-[#1C1917] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#E7E2D9] bg-[#FAF8F5]">
          <p className="text-[11px] text-[#78716C] text-center">
            Saved items persist locally in your browser session.
          </p>
        </div>
      </div>
    </div>
  );
};
