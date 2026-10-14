import React, { useState } from 'react';
import { Palette, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { GarmentAnalysis } from '../types/stylist';

interface GarmentAnalysisCardProps {
  analysis: GarmentAnalysis;
  itemImage?: string;
}

export const GarmentAnalysisCard: React.FC<GarmentAnalysisCardProps> = ({
  analysis,
  itemImage,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section className="py-8 bg-[#F5F2EB] border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E2DDD3] p-6 sm:p-8 shadow-sm">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE5DA] gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
                <span>Garment Decomposition</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#9A3412] font-medium">{analysis.category}</span>
                <span aria-hidden="true">·</span>
                <span>{analysis.stylingDifficulty}</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                {analysis.itemName}
              </h2>
            </div>

            {/* Difficulty Badge (Anti-slop: clean text with indicator, not pill sandwich) */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#78716C]">Difficulty Rating:</span>
              <span className="font-semibold text-[#9A3412] bg-[#FAF5EE] border border-[#ECD9C6] px-2.5 py-1">
                {analysis.stylingDifficulty}
              </span>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left: Thumbnail & Color Palette */}
            <div className="lg:col-span-5 space-y-6">
              {itemImage && (
                <div className="w-full aspect-video sm:aspect-[4/3] bg-[#EFECE4] border border-[#E5E0D8] overflow-hidden">
                  <img
                    src={itemImage}
                    alt={analysis.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Color Swatch Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#9A3412]" />
                    Extracted Palette & Undertones
                  </span>
                  <span className="text-[11px] text-[#78716C]">Click hex to copy</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {analysis.primaryColors.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(color.hex)}
                      className="group p-2 bg-[#FAF8F5] border border-[#E7E2D9] hover:border-[#9A3412] transition-colors cursor-pointer text-left"
                    >
                      <div
                        className="w-full h-8 border border-black/10 mb-2 relative flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {copiedHex === color.hex && (
                          <span className="bg-black/75 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Copied
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-[#1C1917] truncate">{color.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#78716C] mt-0.5">
                        <span className="font-mono tabular-nums">{color.hex}</span>
                        <span className="capitalize text-[#9A3412]">{color.undertone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Architectural Silhouette, Challenge & Stylist Rule */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D9]">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] mb-1">
                    Silhouette & Drape
                  </p>
                  <p className="text-xs text-[#1C1917] leading-relaxed font-medium">
                    {analysis.silhouette}
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D9]">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] mb-1">
                    Surface & Pattern Type
                  </p>
                  <p className="text-xs text-[#1C1917] leading-relaxed font-medium">
                    {analysis.patternType}
                  </p>
                </div>
              </div>

              {/* Style Aesthetic Tags (Unboxed text with separators per Zero-Pill rule) */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] mb-1.5">
                  Style Archetypes
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-[#44403C]">
                  {analysis.styleTags.map((tag, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-medium text-[#1C1917]">{tag}</span>
                      {idx < analysis.styleTags.length - 1 && (
                        <span className="text-[#A8A29E]" aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Why it's challenging */}
              <div className="p-4 bg-[#FFFBF7] border border-[#F3E2D0]">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[#9A3412] mb-1">
                      The Styling Dilemma
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {analysis.stylingChallenge}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stylist's Core Rule */}
              <div className="p-5 bg-[#1C1917] text-[#FAF8F5]">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] mb-1.5">
                      Stylist's Golden Rule
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E7E2D9] leading-relaxed font-normal">
                      "{analysis.stylistCoreTip}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
