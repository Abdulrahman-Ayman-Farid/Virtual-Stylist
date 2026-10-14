import React from 'react';
import { Bookmark, Sparkles, BookOpen } from 'lucide-react';

interface TopBarProps {
  onNewPieceClick: () => void;
  onOpenCapsule: () => void;
  onOpenMethodology: () => void;
  onOpenDeployGuide: () => void;
  onOpenChat: () => void;
  savedCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNewPieceClick,
  onOpenCapsule,
  onOpenMethodology,
  onOpenDeployGuide,
  onOpenChat,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewPieceClick}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917] group-hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0">
              Virtual Stylist
            </span>
          </button>
        </div>

        {/* Zone 2: 4 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#78716C]">
          <button
            onClick={onNewPieceClick}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Wardrobe Atelier
          </button>
          <button
            onClick={onOpenMethodology}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#9A3412]" />
            Styling Invariants
          </button>
          <button
            onClick={onOpenCapsule}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4 text-[#9A3412]" />
            Saved Capsule
            {savedCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-[#9A3412]">
                ({savedCount})
              </span>
            )}
          </button>
          <button
            onClick={onOpenChat}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-[#1C1917] font-semibold"
          >
            <Sparkles className="w-4 h-4 text-[#9A3412]" />
            Consult Stylist
          </button>
          <button
            onClick={onOpenDeployGuide}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs uppercase tracking-wider text-[#78716C]"
          >
            Deploy Guide
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenChat}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] text-xs font-medium tracking-wider uppercase transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#9A3412] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Consult Stylist</span>
          </button>
        </div>
      </div>
    </header>
  );
};
