import React, { useState, useRef } from 'react';
import { Upload, Camera, SlidersHorizontal, ArrowRight, RefreshCw } from 'lucide-react';
import { StatementSampleItem, StylingPreferences } from '../types/stylist';
import { SAMPLE_WARDROBE_ITEMS } from '../data/samples';

interface GarmentUploaderProps {
  onSelectSample: (sample: StatementSampleItem) => void;
  onUploadCustomImage: (imageDataUrl: string, preferences: StylingPreferences) => void;
  isLoading: boolean;
  preferences: StylingPreferences;
  onPreferencesChange: (newPrefs: StylingPreferences) => void;
}

export const GarmentUploader: React.FC<GarmentUploaderProps> = ({
  onSelectSample,
  onUploadCustomImage,
  isLoading,
  preferences,
  onPreferencesChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyzeCustom = () => {
    if (!selectedImage) return;
    onUploadCustomImage(selectedImage, preferences);
  };

  return (
    <section className="py-10 md:py-14 border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase font-medium tracking-widest text-[#9A3412] mb-2">
            The Wardrobe Atelier
          </p>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1917] leading-[1.15]">
            "I don't know what to wear with this."
          </h1>
          <p className="mt-3 text-base text-[#57534E] leading-relaxed">
            Upload that difficult-to-match patterned skirt, bold blazer, or colorful statement piece.
            Our AI stylist decomposes its color undertones, structural drape, and proportions to compose 3 complete editorial flat-lay ensembles: <strong className="text-[#1C1917] font-medium">Casual</strong>, <strong className="text-[#1C1917] font-medium">Business</strong>, and <strong className="text-[#1C1917] font-medium">Night Out</strong>.
          </p>
        </div>

        {/* Upload Zone & Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Upload Box */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E7E2D9] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-[#1C1917]">
                Upload Statement Garment
              </h2>
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-xs text-[#78716C] hover:text-[#9A3412] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showPreferences ? 'Hide Styling Profile' : 'Customize Profile'}</span>
              </button>
            </div>

            {/* Custom Styling Profile Drawer */}
            {showPreferences && (
              <div className="mb-6 p-4 bg-[#F8F6F1] border border-[#EAE5DA] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Fit Preference */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#44403C] mb-1.5">
                      Fit Preference
                    </label>
                    <select
                      value={preferences.fit}
                      onChange={(e) =>
                        onPreferencesChange({ ...preferences, fit: e.target.value as any })
                      }
                      className="w-full text-xs bg-white border border-[#DDD6C8] px-2.5 py-2 text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
                    >
                      <option value="tailored">Tailored & Structured</option>
                      <option value="relaxed">Relaxed & Fluid</option>
                      <option value="oversized">Oversized & Modern</option>
                    </select>
                  </div>

                  {/* Styling Lens */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#44403C] mb-1.5">
                      Styling Lens
                    </label>
                    <select
                      value={preferences.lens}
                      onChange={(e) =>
                        onPreferencesChange({ ...preferences, lens: e.target.value as any })
                      }
                      className="w-full text-xs bg-white border border-[#DDD6C8] px-2.5 py-2 text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
                    >
                      <option value="womenswear">Womenswear Cuts</option>
                      <option value="menswear">Menswear Tailoring</option>
                      <option value="versatile">Universal / Neutral</option>
                    </select>
                  </div>

                  {/* Season Preference */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#44403C] mb-1.5">
                      Season Context
                    </label>
                    <select
                      value={preferences.season}
                      onChange={(e) =>
                        onPreferencesChange({ ...preferences, season: e.target.value as any })
                      }
                      className="w-full text-xs bg-white border border-[#DDD6C8] px-2.5 py-2 text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
                    >
                      <option value="all-season">All-Season Trans-Seasonal</option>
                      <option value="spring/summer">Spring & Summer Lightness</option>
                      <option value="fall/winter">Fall & Winter Layering</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#44403C] mb-1.5">
                    Specific Occasion or Wardrobe Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={preferences.notes || ''}
                    placeholder="e.g. Attending a gallery opening in London, preference for flat shoes"
                    onChange={(e) =>
                      onPreferencesChange({ ...preferences, notes: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-[#DDD6C8] px-3 py-2 text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#9A3412]"
                  />
                </div>
              </div>
            )}

            {/* Drag & Drop Surface */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-[#9A3412] bg-[#FAF5F0]'
                  : selectedImage
                  ? 'border-[#D6CEBF] bg-[#FBF9F6]'
                  : 'border-[#E2DDD3] hover:border-[#A8A29E] bg-[#FAFAF8]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedImage ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="relative w-36 h-36 bg-[#EBE7DF] border border-[#DDD6C8] overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={selectedImage}
                      alt="Uploaded statement item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-xs uppercase tracking-wider text-[#9A3412] font-semibold">
                      Photo Staged for Styling
                    </p>
                    <p className="text-sm font-medium text-[#1C1917] truncate max-w-xs">
                      {imageFileName || 'Custom Uploaded Piece'}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#78716C] hover:text-[#1C1917] underline cursor-pointer"
                      >
                        Choose different photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="text-xs text-red-700 hover:text-red-900 underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-[#F4EFEA] text-[#9A3412] mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-[#1C1917]">
                    Drag and drop your clothing photo here
                  </p>
                  <p className="text-xs text-[#78716C] mt-1">
                    Or select from your device or camera
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 text-xs font-medium bg-[#1C1917] text-[#FAF8F5] hover:bg-[#2E2A27] transition-colors cursor-pointer"
                    >
                      Browse Files
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 text-xs font-medium bg-[#FFFFFF] border border-[#D6CEBF] text-[#44403C] hover:bg-[#F5F2EB] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#78716C]" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button for custom image */}
            {selectedImage && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleAnalyzeCustom}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing Colors & Curating Outfits...</span>
                    </>
                  ) : (
                    <>
                      <span>Style 3 Complete Flat-Lays</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quick-Test Statement Presets Column */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E7E2D9] p-6">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                Instant 1-Click Statement Items
              </span>
              <p className="text-xs text-[#78716C] mt-0.5">
                Test with famously challenging statement garments:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {SAMPLE_WARDROBE_ITEMS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="group flex items-center gap-3 p-2.5 bg-[#FFFFFF] border border-[#E7E2D9] hover:border-[#9A3412] hover:bg-[#FCFAF7] transition-all cursor-pointer text-left"
                >
                  <div className="w-16 h-16 bg-[#F2EDE4] border border-[#E0D9CD] overflow-hidden shrink-0">
                    <img
                      src={sample.previewImage}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#9A3412] truncate">
                      {sample.category}
                    </p>
                    <p className="text-xs font-semibold text-[#1C1917] truncate group-hover:text-[#9A3412] transition-colors">
                      {sample.name}
                    </p>
                    <p className="text-[11px] text-[#78716C] line-clamp-1 mt-0.5">
                      {sample.subtitle}
                    </p>
                  </div>
                  <div className="pr-1 text-[#A8A29E] group-hover:text-[#9A3412] group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#ECE7DD] text-[11px] text-[#78716C] flex items-center justify-between">
              <span>Each preset includes 3 flat-lays</span>
              <span className="font-mono text-[10px] text-[#9A3412]">4 Curated Items</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
