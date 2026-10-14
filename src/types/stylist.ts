export type OccasionType = 'Casual' | 'Business' | 'Night Out';

export type FitPreference = 'relaxed' | 'tailored' | 'oversized';
export type StyleLens = 'womenswear' | 'menswear' | 'versatile';
export type SeasonPreference = 'spring/summer' | 'fall/winter' | 'all-season';

export interface StylingPreferences {
  fit: FitPreference;
  lens: StyleLens;
  season: SeasonPreference;
  notes?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'dominant' | 'accent' | 'undertone' | 'secondary';
  undertone: 'warm' | 'cool' | 'neutral';
}

export interface GarmentAnalysis {
  itemName: string;
  category: string;
  primaryColors: ColorSwatch[];
  silhouette: string;
  patternType: string;
  styleTags: string[];
  stylingDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert Statement';
  stylingChallenge: string;
  stylistCoreTip: string;
}

export interface OutfitPiece {
  id: string;
  category: 'top' | 'bottom' | 'outerwear' | 'shoes' | 'bag' | 'jewelry' | 'accessory' | 'layer';
  name: string;
  color: string;
  material: string;
  stylingTip: string;
  isOriginalItem?: boolean;
}

export interface OutfitOption {
  id: string;
  occasion: OccasionType;
  title: string;
  mood: string;
  pieces: OutfitPiece[];
  colorTheory: string;
  balanceRule: string;
  stylistRationale: string;
  flatLayImageUrl?: string;
  flatLayPrompt: string;
  isGeneratingImage?: boolean;
}

export interface DesignedFlatLay {
  url: string;
  prompt: string;
  title: string;
  pieces?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  designedImage?: DesignedFlatLay;
  isDesigningImage?: boolean;
  modelUsed?: string;
}

export interface StatementSampleItem {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  previewImage: string;
  analysis: GarmentAnalysis;
  outfits: OutfitOption[];
}
