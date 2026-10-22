import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { GarmentUploader } from './components/GarmentUploader';
import { GarmentAnalysisCard } from './components/GarmentAnalysisCard';
import { OutfitShowcase } from './components/OutfitShowcase';
import { ImagePromptStudioModal } from './components/ImagePromptStudioModal';
import { CapsuleDrawer } from './components/CapsuleDrawer';
import { StylistMethodologyModal } from './components/StylistMethodologyModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { StylistChatDrawer } from './components/StylistChatDrawer';
import { SAMPLE_WARDROBE_ITEMS } from './data/samples';
import {
  StatementSampleItem,
  StylingPreferences,
  GarmentAnalysis,
  OutfitOption,
  DesignedFlatLay,
} from './types/stylist';
import { Sparkles, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import Homepage from './pages/Homepage';

const STORAGE_KEY = 'virtual_stylist_saved_capsule';

export default function App() {
  // View state: homepage vs stylist studio
  const [view, setView] = useState<'home' | 'studio'>('home');

  // Styling preferences
  const [preferences, setPreferences] = useState<StylingPreferences>({
    fit: 'tailored',
    lens: 'womenswear',
    season: 'all-season',
  });

  // Current active garment & outfits (Default to first curated sample for instant visual richness)
  const defaultSample = SAMPLE_WARDROBE_ITEMS[0];
  const [currentGarmentImage, setCurrentGarmentImage] = useState<string>(
    defaultSample.previewImage
  );
  const [garmentAnalysis, setGarmentAnalysis] = useState<GarmentAnalysis>(
    defaultSample.analysis
  );
  const [outfits, setOutfits] = useState<OutfitOption[]>(defaultSample.outfits);

  // Loading & notification states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modals & Drawers
  const [editingOutfit, setEditingOutfit] = useState<OutfitOption | null>(null);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Saved capsule storage
  const [savedOutfits, setSavedOutfits] = useState<OutfitOption[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedOutfits));
    } catch (e) {
      console.error('Failed to sync capsule storage:', e);
    }
  }, [savedOutfits]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 1. Select a statement preset
  const handleSelectSample = (sample: StatementSampleItem) => {
    setCurrentGarmentImage(sample.previewImage);
    setGarmentAnalysis(sample.analysis);
    setOutfits(sample.outfits);
    showToast(`Loaded ${sample.name} with 3 curated flat-lays.`);
  };

  // 2. Upload custom photo & call server Gemini 3.8 Flash endpoint
  const handleUploadCustomImage = async (
    imageDataUrl: string,
    currentPrefs: StylingPreferences
  ) => {
    setIsLoading(true);
    setCurrentGarmentImage(imageDataUrl);

    try {
      const response = await fetch('/api/stylist/analyze-and-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageDataUrl,
          preferences: currentPrefs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze statement garment.');
      }

      if (data.analysis && data.outfits) {
        setGarmentAnalysis(data.analysis);
        // Set outfits and populate flatLayImageUrl with prompt-based SVG fallback if image is not yet rendered
        const enrichedOutfits: OutfitOption[] = data.outfits.map(
          (outfit: OutfitOption) => ({
            ...outfit,
            flatLayImageUrl:
              outfit.flatLayImageUrl ||
              imageDataUrl, // fallback to uploaded item or custom preview
          })
        );
        setOutfits(enrichedOutfits);
        showToast('Successfully analyzed item and curated 3 complete outfits!');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error analyzing garment:', error);
      showToast(
        error.message || 'Failed to complete fashion analysis. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Regenerate single outfit flat-lay using Gemini image generation
  const handleRegenerateImage = async (outfit: OutfitOption) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === outfit.id ? { ...o, isGeneratingImage: true } : o))
    );

    try {
      const response = await fetch('/api/stylist/generate-flatlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: outfit.flatLayPrompt,
          originalImage: currentGarmentImage,
          aspectRatio: '1:1',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flat-lay visual.');
      }

      if (data.imageUrl) {
        setOutfits((prev) =>
          prev.map((o) =>
            o.id === outfit.id
              ? { ...o, flatLayImageUrl: data.imageUrl, isGeneratingImage: false }
              : o
          )
        );
        showToast(`Rendered new flat-lay visual for ${outfit.title}!`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Regeneration error:', error);
      setOutfits((prev) =>
        prev.map((o) => (o.id === outfit.id ? { ...o, isGeneratingImage: false } : o))
      );
      showToast(
        error.message || 'Image rendering requires paid model credentials.',
        'error'
      );
    }
  };

  // 4. Apply edited image from prompt studio modal
  const handleApplyUpdatedImage = (outfitId: string, newImageUrl: string) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === outfitId ? { ...o, flatLayImageUrl: newImageUrl } : o))
    );
    showToast('Updated flat-lay visual saved to outfit board.');
  };

  // 4b. Apply newly designed outfit from chat consultation
  const handleApplyDesignedOutfit = (designed: DesignedFlatLay) => {
    setOutfits((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        title: designed.title,
        flatLayImageUrl: designed.url,
        flatLayPrompt: designed.prompt,
        ...(designed.pieces && designed.pieces.length > 0
          ? {
              pieces: designed.pieces.map((pName, i) => ({
                id: `custom-p-${i}-${Date.now()}`,
                category: (i === 0 ? 'top' : i === 1 ? 'outerwear' : i === 2 ? 'shoes' : 'accessory') as any,
                name: pName,
                color: 'Harmonized Hue',
                material: 'Curated Textile',
                stylingTip: 'Tailored by Jean-Luc in consultation',
              })),
            }
          : {}),
      };
      return updated;
    });
    showToast(`Applied "${designed.title}" to active outfit board!`);
  };

  // 5. Capsule management
  const handleSaveOutfit = (outfit: OutfitOption) => {
    if (savedOutfits.some((o) => o.id === outfit.id)) {
      setSavedOutfits((prev) => prev.filter((o) => o.id !== outfit.id));
      showToast('Removed from your wardrobe capsule.');
    } else {
      setSavedOutfits((prev) => [outfit, ...prev]);
      showToast(`Saved "${outfit.title}" to your wardrobe capsule!`);
    }
  };

  const handleRemoveOutfit = (outfitId: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== outfitId));
    showToast('Removed outfit from capsule.');
  };

  const handleSelectOutfitFromCapsule = (outfit: OutfitOption) => {
    // If the outfit is in the current outfit set, switch occasion
    const exists = outfits.find((o) => o.id === outfit.id);
    if (!exists) {
      setOutfits((prev) => [outfit, ...prev.filter((o) => o.occasion !== outfit.occasion)]);
    }
    showToast(`Focused on ${outfit.title}`);
  };

  const isOutfitSaved = (outfitId: string) => {
    return savedOutfits.some((o) => o.id === outfitId);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1C1917] flex flex-col antialiased">
      {view === 'home' ? (
        <main className="flex-1">
          <Homepage />
        </main>
      ) : (
        <>
      {/* Top Bar with 3-zone contract */}
      <TopBar
        onNewPieceClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCapsule={() => setIsCapsuleOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        savedCount={savedOutfits.length}
      />

      <main className="flex-1">
        {/* Garment Uploader & Statement Preset Hub */}
        <GarmentUploader
          onSelectSample={handleSelectSample}
          onUploadCustomImage={handleUploadCustomImage}
          isLoading={isLoading}
          preferences={preferences}
          onPreferencesChange={setPreferences}
        />

        {/* Garment Visual Decomposition & Color Palette Analysis */}
        {garmentAnalysis && (
          <GarmentAnalysisCard
            analysis={garmentAnalysis}
            itemImage={currentGarmentImage}
          />
        )}

        {/* 3-Outfit Editorial Flat-Lay Showcase */}
        {outfits && outfits.length > 0 && (
          <OutfitShowcase
            outfits={outfits}
            onOpenEditModal={(outfit) => setEditingOutfit(outfit)}
            onRegenerateImage={handleRegenerateImage}
            onSaveOutfit={handleSaveOutfit}
            isSaved={isOutfitSaved}
            onOpenStylistChat={() => setIsChatOpen(true)}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E7E2D9] bg-[#F4F1EA] py-10 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-semibold text-[#1C1917]">
              Virtual Stylist
            </span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Wardrobe Coordination & Flat-Lay Atelier</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-[#9A3412] hover:text-[#7C2D12] font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#9A3412]" />
              <span>Consult Jean-Luc</span>
            </button>
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Styling Methodology
            </button>
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Vercel Deployment
            </button>
            <span className="text-[#A8A29E]">
              Powered by Gemini 3.8 Flash & Nano Banana 2.1
            </span>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* View toggle */}
      <button
        onClick={() => setView(view === 'home' ? 'studio' : 'home')}
        className="fixed bottom-6 left-6 z-40 bg-[#1C1917] hover:bg-[#2E2A27] text-white px-4 py-3 shadow-2xl border border-[#3E3A36] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all"
      >
        {view === 'home' ? 'Open Stylist Studio' : 'Back to Homepage'}
      </button>

      {/* Floating Stylist Consultation Trigger */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1C1917] hover:bg-[#2E2A27] text-white px-4 py-3 shadow-2xl border border-[#3E3A36] flex items-center gap-2.5 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all hover:scale-102 group"
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:scale-125 transition-transform" />
        <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
        <span>Consult Stylist</span>
      </button>

      {/* AI Stylist Chatbot Drawer */}
      <StylistChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        garmentContext={garmentAnalysis}
        activeOutfit={outfits[0]}
        onApplyDesignedOutfit={handleApplyDesignedOutfit}
      />

      {/* Interactive Image Prompt Studio Modal */}
      <ImagePromptStudioModal
        isOpen={!!editingOutfit}
        outfit={editingOutfit}
        onClose={() => setEditingOutfit(null)}
        onApplyUpdatedImage={handleApplyUpdatedImage}
      />

      {/* Wardrobe Capsule Drawer */}
      <CapsuleDrawer
        isOpen={isCapsuleOpen}
        onClose={() => setIsCapsuleOpen(false)}
        savedOutfits={savedOutfits}
        onRemoveOutfit={handleRemoveOutfit}
        onSelectOutfit={handleSelectOutfitFromCapsule}
      />

      {/* Styling Methodology Modal */}
      <StylistMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Vercel Deployment Modal */}
      <VercelDeployModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-22 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1C1917] text-white text-xs shadow-xl border border-[#3E3A36] animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
