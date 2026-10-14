import { StatementSampleItem } from '../types/stylist';

// Helper to generate elegant editorial SVG flat-lay visuals as fallback data URIs
function createEditorialFlatlaySVG(
  title: string,
  palette: string[],
  items: string[],
  occasion: string
): string {
  const [c1 = '#1E3A2F', c2 = '#F5F2EB', c3 = '#9A3412', c4 = '#D4AF37'] = palette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <!-- Linen texture simulation -->
      <filter id="linen-noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
        <feComposite in2="SourceGraphic" in="gl" operator="in" />
      </filter>
      <linearGradient id="linen-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FAF8F5" />
        <stop offset="50%" stop-color="#F3EFE7" />
        <stop offset="100%" stop-color="#EBE6DC" />
      </linearGradient>
      <filter id="soft-shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1C1917" flood-opacity="0.14" />
      </filter>
      <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#1C1917" flood-opacity="0.08" />
      </filter>
    </defs>

    <!-- Linen Backdrop -->
    <rect width="800" height="800" fill="url(#linen-grad)" />
    <rect width="800" height="800" fill="#E8E2D5" opacity="0.15" />
    <!-- Fine grid weave lines -->
    <g stroke="#DDD6C8" stroke-width="0.5" opacity="0.4">
      ${Array.from({ length: 40 })
        .map((_, i) => `<line x1="0" y1="${i * 20}" x2="800" y2="${i * 20}" /><line x1="${i * 20}" y1="0" x2="${i * 20}" y2="800" />`)
        .join('')}
    </g>

    <!-- Editorial Header Frame -->
    <g transform="translate(48, 56)">
      <text x="0" y="0" font-family="'Cormorant Garamond', 'Playfair Display', Georgia, serif" font-size="28" font-weight="600" fill="#1C1917" letter-spacing="1.5">${title.toUpperCase()}</text>
      <text x="0" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#78716C" letter-spacing="2">CURATED EDITORIAL FLAT-LAY · ${occasion.toUpperCase()}</text>
      <line x1="0" y1="36" x2="704" y2="36" stroke="#D6CEBE" stroke-width="1" />
    </g>

    <!-- Main Visual Compositions (Garments & Accessories Laid Flat) -->
    <!-- Central Hero Garment -->
    <g transform="translate(180, 240)" filter="url(#soft-shadow)">
      <path d="M 60 0 L 380 0 L 410 260 L 30 260 Z" fill="${c1}" rx="8" />
      <!-- Pleats or texture accents -->
      <path d="M 80 0 L 60 260 M 120 0 L 110 260 M 160 0 L 160 260 M 200 0 L 210 260 M 240 0 L 260 260 M 280 0 L 310 260 M 320 0 L 360 260" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="2" />
    </g>

    <!-- Top Coordinate -->
    <g transform="translate(200, 120)" filter="url(#card-shadow)">
      <path d="M 100 0 L 140 30 L 260 30 L 300 0 L 380 50 L 340 110 L 290 90 L 290 190 L 110 190 L 110 90 L 60 110 L 20 50 Z" fill="${c2}" />
      <path d="M 140 30 Q 200 60 260 30" stroke="#DDD6C8" stroke-width="1.5" fill="none" />
    </g>

    <!-- Left Accessory: Shoes or Boots -->
    <g transform="translate(64, 460)" filter="url(#card-shadow)">
      <rect x="0" y="0" width="130" height="200" rx="12" fill="#FFFFFF" fill-opacity="0.9" stroke="#E5E0D8" />
      <!-- Stylized footwear outline -->
      <path d="M 30 160 C 20 120 40 50 70 40 C 90 35 105 70 100 110 C 95 150 110 165 110 170 L 30 170 Z" fill="${c3}" />
      <text x="65" y="188" font-family="'Plus Jakarta Sans', system-ui" font-size="10" font-weight="600" fill="#78716C" text-anchor="middle">FOOTWEAR</text>
    </g>

    <!-- Right Accessory: Structured Bag & Jewelry -->
    <g transform="translate(606, 320)" filter="url(#card-shadow)">
      <rect x="0" y="0" width="130" height="150" rx="12" fill="#FFFFFF" fill-opacity="0.9" stroke="#E5E0D8" />
      <!-- Handbag shape -->
      <rect x="25" y="55" width="80" height="65" rx="6" fill="${c3}" />
      <path d="M 45 55 C 45 30 85 30 85 55" fill="none" stroke="${c4}" stroke-width="4" />
      <circle cx="65" cy="85" r="5" fill="${c4}" />
      <text x="65" y="136" font-family="'Plus Jakarta Sans', system-ui" font-size="10" font-weight="600" fill="#78716C" text-anchor="middle">LEATHER BAG</text>
    </g>

    <!-- Jewelry Accent -->
    <g transform="translate(606, 500)" filter="url(#card-shadow)">
      <rect x="0" y="0" width="130" height="130" rx="12" fill="#FFFFFF" fill-opacity="0.9" stroke="#E5E0D8" />
      <circle cx="65" cy="55" r="28" fill="none" stroke="${c4}" stroke-width="5" />
      <circle cx="65" cy="55" r="18" fill="none" stroke="${c4}" stroke-width="2" stroke-dasharray="3 3" />
      <text x="65" y="112" font-family="'Plus Jakarta Sans', system-ui" font-size="10" font-weight="600" fill="#78716C" text-anchor="middle">SCULPTURAL GOLD</text>
    </g>

    <!-- Item Key List Overlay Footer -->
    <g transform="translate(48, 715)">
      <rect x="0" y="0" width="704" height="48" rx="8" fill="#1C1917" fill-opacity="0.04" />
      <text x="16" y="28" font-family="'Plus Jakarta Sans', system-ui" font-size="11" font-weight="500" fill="#44403C">
        ${items.slice(0, 4).map((it, idx) => `0${idx + 1} · ${it}`).join('     ')}
      </text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Sample 1: Emerald Silk Pleated Skirt
const emeraldSkirtPreview = createEditorialFlatlaySVG(
  'Emerald Silk Accordion Skirt',
  ['#0E3B2F', '#EAE6DC', '#8B4513', '#D4AF37'],
  ['Emerald Silk Skirt', 'Raw Linen Cardigan', 'Cognac Leather Mules', 'Brushed Brass Hoops'],
  'Statement Piece'
);

// Sample 2: Floral Jacquard Blazer
const jacquardBlazerPreview = createEditorialFlatlaySVG(
  'Botanical Jacquard Blazer',
  ['#1D2E49', '#EAD9C8', '#A23B2A', '#CBA358'],
  ['Navy & Gold Jacquard Blazer', 'Ecru Ribbed Knit', 'Tailored Ivory Trousers', 'Slingback Pumps'],
  'Statement Piece'
);

// Sample 3: Cobalt Wide-Leg Trousers
const cobaltTrouserPreview = createEditorialFlatlaySVG(
  'Cobalt Architectural Trousers',
  ['#1A428A', '#F7F6F2', '#333333', '#C5A059'],
  ['Cobalt Wool Wide-Legs', 'Charcoal Cashmere Crew', 'Pointed Suede Boots', 'Minimal Silver Choker'],
  'Statement Piece'
);

// Sample 4: Leopard Print Silk Slip Dress
const leopardDressPreview = createEditorialFlatlaySVG(
  '90s Silk Leopard Slip Dress',
  ['#5C3E21', '#E7DFD5', '#1A1817', '#E5A93C'],
  ['Silk Leopard Midi Slip', 'Structured Black Tux Blazer', 'Strappy Kitten Heels', 'Gold Snake Chain'],
  'Statement Piece'
);

export const SAMPLE_WARDROBE_ITEMS: StatementSampleItem[] = [
  {
    id: 'emerald-pleated-skirt',
    name: 'Emerald Silk Accordion Midi Skirt',
    category: 'Bottoms · Skirt',
    subtitle: 'Lustrous jewel-tone pleated satin with high-contrast motion',
    previewImage: emeraldSkirtPreview,
    analysis: {
      itemName: 'Emerald Silk Accordion Midi Skirt',
      category: 'Bottoms / Midi Skirt',
      primaryColors: [
        { name: 'Deep Emerald', hex: '#0E3B2F', role: 'dominant', undertone: 'cool' },
        { name: 'Forest Jade', hex: '#1B5E4B', role: 'secondary', undertone: 'cool' },
        { name: 'Warm Ecru', hex: '#EAE6DC', role: 'accent', undertone: 'warm' },
        { name: 'Antique Gold', hex: '#D4AF37', role: 'undertone', undertone: 'warm' },
      ],
      silhouette: 'High-waisted A-line fluid accordion pleats with subtle sheen',
      patternType: 'Fine vertical pleated accordion texture with light refraction',
      styleTags: ['Jewel Tone', 'Fluid Texture', 'Quiet Luxury', 'Statement Drape'],
      stylingDifficulty: 'Challenging',
      stylingChallenge: 'Rich jewel saturation and voluminous lower half require structured upper silhouettes and grounded earthy neutrals to avoid looking costume-like.',
      stylistCoreTip: 'Tame high-energy jewel saturation with textural opposites: matte heavyweight cottons, raw linen, or dense cashmere in camel, oat, and espresso.',
    },
    outfits: [
      {
        id: 'skirt-casual',
        occasion: 'Casual',
        title: 'Tactile Parisian Sunday',
        mood: 'Relaxed, tactile, effortless everyday polish',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Emerald Silk Accordion Midi Skirt',
            color: 'Deep Emerald',
            material: 'Satin Silk Blend',
            stylingTip: 'Let the fluid hemline drape over ankle-grazing footwear',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Slouchy Chunky Knit Crewneck',
            color: 'Warm Oat Melange',
            material: '100% Organic Wool',
            stylingTip: 'Do a loose French front-tuck to gently define the waist',
          },
          {
            id: 'p3',
            category: 'shoes',
            name: 'Minimalist Leather Low-Top Trainers',
            color: 'Chalk White with Gum Sole',
            material: 'Supple Calfskin',
            stylingTip: 'Grounds the formal satin skirt into casual daytime wear',
          },
          {
            id: 'p4',
            category: 'bag',
            name: 'Slouchy Soft Woven Shoulder Tote',
            color: 'Cognac Saddle Brown',
            material: 'Full-Grain Vegetable Tanned Leather',
            stylingTip: 'Warm cognac provides organic complementary balance to cool green',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Brushed Golden Dome Rings',
            color: '14k Matte Gold',
            material: 'Vermeil',
            stylingTip: 'Subtle metallic warmth mirroring natural sunlight',
          },
        ],
        colorTheory: 'Analogous cool emerald anchored by warm oatmeal neutrals and rich vegetable-tanned cognac leather.',
        balanceRule: 'Volumetric Balance: Heavy textured knitwear softens and casualizes the shimmering formal pleats.',
        stylistRationale: 'The trick with a lustrous satin skirt is introducing heavy, unpolished daytime textures like chunky bouclé wool or ribbed cotton.',
        flatLayPrompt: 'Editorial luxury boutique flat-lay photograph of an emerald green satin pleated midi skirt paired with a chunky oversized oat-colored knit sweater, chalk white minimalist sneakers with gum soles, a rich cognac woven leather tote bag, and matte gold sculptural dome jewelry, beautifully arranged on a warm natural textured raw linen backdrop, soft diffused side daylight with realistic fabric draping, 8k commercial quality.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Casual · Tactile Parisian Sunday',
          ['#0E3B2F', '#E8E1D5', '#8B4513', '#D4AF37'],
          ['Emerald Pleated Skirt', 'Chunky Oat Wool Crewneck', 'Chalk Minimal Trainers', 'Cognac Woven Tote'],
          'Casual'
        ),
      },
      {
        id: 'skirt-business',
        occasion: 'Business',
        title: 'Architectural Executive Polish',
        mood: 'Sharp, tailored, commanding modern sophistication',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Emerald Silk Accordion Midi Skirt',
            color: 'Deep Emerald',
            material: 'Satin Silk Blend',
            stylingTip: 'Worn high at the natural waistline',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'outerwear',
            name: 'Single-Breasted Sharp Wool Blazer',
            color: 'Deep Midnight Navy',
            material: 'Super 120s Italian Wool',
            stylingTip: 'Straight-cut shoulders create an architectural frame over the flowing skirt',
          },
          {
            id: 'p3',
            category: 'top',
            name: 'Fitted Silk Georgette Shell Top',
            color: 'Ivory Cream',
            material: 'Silk Georgette',
            stylingTip: 'Streamlined base to prevent bulk under the tailored blazer',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Almond-Toe Pointed Leather Loafers',
            color: 'Polished Espresso',
            material: 'Patent Calf Leather',
            stylingTip: 'Structured low heel preserves professional mobility and elegance',
          },
          {
            id: 'p5',
            category: 'bag',
            name: 'Architectural Gusseted Briefcase Tote',
            color: 'Blackened Brown with Gold Hardware',
            material: 'Saffiano Leather',
            stylingTip: 'Clean rectilinear geometry contrasts the pleated skirt movement',
          },
        ],
        colorTheory: 'Monochromatic deep jewel tonality: Midnight Navy and Forest Emerald create an authoritatively rich palette without resorting to flat black.',
        balanceRule: 'Structured Shoulder vs. Fluid Sweep: Crisp tailoring up top anchors the dynamic kinetic motion of the pleated fabric.',
        stylistRationale: 'Navy and emerald green are classic European power pairings. The tailored blazer gives office legitimacy while honoring the skirt’s statement quality.',
        flatLayPrompt: 'High-end editorial flat-lay photo of an emerald green accordion pleated midi skirt styled with a tailored midnight navy wool blazer, an ivory silk shell blouse, polished dark espresso almond-toe loafers, and an architectural leather structured bag, neatly arranged on an unbleached stone linen canvas with soft directional shadows, luxury fashion catalog aesthetic.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Business · Architectural Executive',
          ['#0E3B2F', '#17253E', '#F4F1EA', '#4A2E1B'],
          ['Emerald Skirt', 'Midnight Navy Blazer', 'Ivory Silk Shell', 'Polished Espresso Loafers'],
          'Business'
        ),
      },
      {
        id: 'skirt-night-out',
        occasion: 'Night Out',
        title: 'Nocturne Velvet & Gold Statement',
        mood: 'Sensual, dramatic, radiant after-dark glamour',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Emerald Silk Accordion Midi Skirt',
            color: 'Deep Emerald',
            material: 'Satin Silk Blend',
            stylingTip: 'Movement catches cocktail lounge and ambient dinner lighting',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Sculptural Asymmetric Drape Bodysuit',
            color: 'Obsidian Black',
            material: 'Matte Viscose Jersey',
            stylingTip: 'Clean skin reveal at collarbone balances the modest midi skirt length',
          },
          {
            id: 'p3',
            category: 'shoes',
            name: 'Barely-There Ankle Strap Stilettos',
            color: 'Metallic Gold Mirror',
            material: 'Specular Metallic Leather',
            stylingTip: 'Slender metallic straps lift the silhouette into pure evening glamour',
          },
          {
            id: 'p4',
            category: 'bag',
            name: 'Hammered Brass Hard-Shell Minaudière',
            color: 'Polished Antique Brass',
            material: 'Hand-Hammered Metal',
            stylingTip: 'Acts as a piece of sculpture in hand',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Cascading Malachite & Gold Drop Earrings',
            color: 'Emerald & Gold',
            material: 'Natural Malachite & 18k Vermeil',
            stylingTip: 'Draws the emerald hue upward to frame the face',
          },
        ],
        colorTheory: 'High-contrast nocturnal luxury: Obsidian black provides negative space for the emerald satin and reflective gold metalwork to radiate.',
        balanceRule: 'Texture Juxtaposition: Matte jersey, shimmering satin pleats, and reflective metallic jewelry create tactile richness without visual noise.',
        stylistRationale: 'By keeping the top sleek and second-skin, the emerald skirt becomes the undisputed centerpiece of the evening ensemble.',
        flatLayPrompt: 'Luxury evening flat-lay photo of an emerald green satin pleated midi skirt laid alongside an asymmetric black drape bodysuit, delicate metallic gold stiletto sandals, a hammered brass clutch box, and malachite drop earrings, arranged on an off-white raw linen surface with dramatic ambient mood lighting, Vogue editorial photography.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Night Out · Nocturne Velvet & Gold',
          ['#0E3B2F', '#0F0E0E', '#D4AF37', '#2A6F56'],
          ['Emerald Pleated Skirt', 'Asymmetric Black Bodysuit', 'Gold Metallic Heeled Sandals', 'Hammered Brass Minaudière'],
          'Night Out'
        ),
      },
    ],
  },
  {
    id: 'jacquard-blazer',
    name: 'Artisanal Botanical Jacquard Blazer',
    category: 'Outerwear · Blazer',
    subtitle: 'Woven tapestry fabric in midnight navy, antique gold, and terracotta floral motifs',
    previewImage: jacquardBlazerPreview,
    analysis: {
      itemName: 'Artisanal Botanical Jacquard Blazer',
      category: 'Outerwear / Tailored Blazer',
      primaryColors: [
        { name: 'Midnight Navy', hex: '#1D2E49', role: 'dominant', undertone: 'cool' },
        { name: 'Antique Gold', hex: '#CBA358', role: 'accent', undertone: 'warm' },
        { name: 'Burnt Terracotta', hex: '#A23B2A', role: 'accent', undertone: 'warm' },
        { name: 'Warm Parchment', hex: '#EAD9C8', role: 'undertone', undertone: 'warm' },
      ],
      silhouette: 'Slightly elongated structured double-breasted cut with peak lapels',
      patternType: 'Intricate woven brocade jacquard with raised botanical filigree',
      styleTags: ['Heritage Brocade', 'Artisanal Weave', 'Maximalist Tailoring', 'Collector Piece'],
      stylingDifficulty: 'Expert Statement',
      stylingChallenge: 'Rich tapestry patterns easily overpower outfits and run the risk of looking vintage-theatrical without minimalist modern anchors.',
      stylistCoreTip: 'Extract one quiet baseline neutral from within the jacquard weave (e.g. the ecru thread or deep navy ground) and make every other item in the outfit pure monochrome.',
    },
    outfits: [
      {
        id: 'blazer-casual',
        occasion: 'Casual',
        title: 'Modern High-Low Denim Pairing',
        mood: 'Contemporary, artful, relaxed gallery-goer aesthetic',
        pieces: [
          {
            id: 'p1',
            category: 'outerwear',
            name: 'Botanical Jacquard Tailored Blazer',
            color: 'Midnight Navy & Gold',
            material: 'Woven Jacquard Cotton-Silk',
            stylingTip: 'Leave unbuttoned with sleeves pushed up to expose forearms',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Heavyweight Ribbed Cotton Tank',
            color: 'Crisp Optic White',
            material: '100% Pima Cotton',
            stylingTip: 'Creates a clean, sporty foundation that cuts through the formal tapestry',
          },
          {
            id: 'p3',
            category: 'bottom',
            name: 'High-Rise Relaxed Straight Denim',
            color: 'Vintage Medium Indigo Wash',
            material: 'Rigid Cotton Denim',
            stylingTip: 'Clean ankle break gives effortless counterweight to the structured blazer',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Leather Pointed Mary Jane Flats',
            color: 'Rich Oxblood Burgundy',
            material: 'Polished Box Calf',
            stylingTip: 'Picks up the terracotta undertone in the jacket weave',
          },
          {
            id: 'p5',
            category: 'bag',
            name: 'Unstructured Nappa Crossbody Pouch',
            color: 'Warm Sand Beige',
            material: 'Supple Nappa Leather',
            stylingTip: 'Understated neutral keeps focus on the jacket weave',
          },
        ],
        colorTheory: 'Subdued primary triad: Indigo denim echoes the jacket’s midnight ground, white provides clean breathing space, and oxblood shoes connect with the floral accents.',
        balanceRule: 'High-Low Dialectic: Worn vintage denim instantly deflates the aristocratic formality of woven jacquard.',
        stylistRationale: 'The best way to wear an ornate blazer is to treat it like a casual chore jacket tossed over everyday jeans and a crisp white tee.',
        flatLayPrompt: 'Editorial flat-lay image of an ornate navy and gold floral jacquard blazer arranged with high-waisted medium wash straight jeans, a crisp white ribbed tank top, oxblood pointed leather flats, and a sand beige soft leather crossbody bag on raw textured linen fabric, boutique fashion magazine aesthetic.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Casual · High-Low Denim Pairing',
          ['#1D2E49', '#EAEAEA', '#3C5B88', '#631B23'],
          ['Jacquard Floral Blazer', 'White Ribbed Tank', 'Straight Indigo Denim', 'Oxblood Mary Jane Flats'],
          'Casual'
        ),
      },
      {
        id: 'blazer-business',
        occasion: 'Business',
        title: 'Sartorial Monolithic Executive',
        mood: 'Polished, authoritative, cultured professionalism',
        pieces: [
          {
            id: 'p1',
            category: 'outerwear',
            name: 'Botanical Jacquard Tailored Blazer',
            color: 'Midnight Navy & Gold',
            material: 'Woven Jacquard Cotton-Silk',
            stylingTip: 'Button the center horn button for an architectural hourglass shape',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'bottom',
            name: 'Fluid Crepe Wide-Leg Trousers',
            color: 'Deep Ink Navy',
            material: 'Virgin Wool Crepe',
            stylingTip: 'Floor-skimming puddle hem lengthens the vertical leg line',
          },
          {
            id: 'p3',
            category: 'top',
            name: 'High-Neck Pleated Collar Silk Shirt',
            color: 'Soft Vanilla Crème',
            material: 'Mulberry Silk Chiffon',
            stylingTip: 'Delicate neck detail peeks subtly through the peak lapels',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Chisel-Toe Leather Block-Heel Pumps',
            color: 'Deep Espresso',
            material: 'Fine French Calfskin',
            stylingTip: 'Substantial heel balances wide trouser hems',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Brushed Gold Organic Signet Ring',
            color: 'Warm Brushed Gold',
            material: '18k Gold Plated Brass',
            stylingTip: 'Matches the gold metallic threads of the brocade weave',
          },
        ],
        colorTheory: 'Tonal Column Foundation: Ink Navy trousers create a seamless vertical line that grounds the patterned jacket as the sole focal element.',
        balanceRule: 'Strict Monochromatic Framing: By matching the pant color to the blazer base, the look remains corporate and cohesive.',
        stylistRationale: 'Patterned blazers in corporate boardrooms succeed when worn as a statement blazer over a quiet monochromatic navy column.',
        flatLayPrompt: 'Flat-lay fashion composition of a navy and gold floral brocade blazer styled with wide-leg navy crepe trousers, a creamy vanilla silk blouse, dark espresso block-heel pumps, and minimal gold jewelry, laid flat on warm linen fabric with soft architectural shadows, high-end lookbook layout.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Business · Sartorial Monolithic Executive',
          ['#1D2E49', '#152136', '#FAF6EE', '#CBA358'],
          ['Jacquard Blazer', 'Navy Crepe Trousers', 'Vanilla Silk Blouse', 'Espresso Block Heels'],
          'Business'
        ),
      },
      {
        id: 'blazer-night-out',
        occasion: 'Night Out',
        title: 'Tuxedo Slip & Gilded Drama',
        mood: 'Seductive, lavish, dinner & theater statement',
        pieces: [
          {
            id: 'p1',
            category: 'outerwear',
            name: 'Botanical Jacquard Tailored Blazer',
            color: 'Midnight Navy & Gold',
            material: 'Woven Jacquard Cotton-Silk',
            stylingTip: 'Draped nonchalantly over the shoulders (the editor cape)',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'bottom',
            name: 'Heavy Silk Charmeuse Bias Maxi Skirt',
            color: 'Liquid Bronze Gold',
            material: '100% Silk Charmeuse',
            stylingTip: 'Fluid liquid drape echoes the gold thread in the jacket',
          },
          {
            id: 'p3',
            category: 'top',
            name: 'Minimalist Micro-Cami Top',
            color: 'Jet Black Silk',
            material: 'Silk Georgette',
            stylingTip: 'Deep square neckline allows collarbone jewelry to glow',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Sculptural Heel Strappy Sandals',
            color: 'Gold Foil Metallic',
            material: 'Metallic Nappa Leather',
            stylingTip: 'Reflective heel catches low candle lighting',
          },
          {
            id: 'p5',
            category: 'bag',
            name: 'Velvet Knot Evening Pouch',
            color: 'Deep Terracotta Garnet',
            material: 'Plush Silk Velvet',
            stylingTip: 'Picks up the deep floral terracotta tones in the blazer embroidery',
          },
        ],
        colorTheory: 'Opulent Renaissance Palette: Liquid bronze, midnight navy, and rich garnet velvet invoke tactile evening grandeur.',
        balanceRule: 'Tailored Armor over Liquid Silk: Sharp shoulder pads juxtaposed with bias-cut silk skirts create seductive tension.',
        stylistRationale: 'Throwing an artisanal tapestry blazer over a shimmering slip skirt channels 90s Tom Ford and modern Met Gala after-party glamour.',
        flatLayPrompt: 'Luxury evening flat-lay photo of an intricate botanical jacquard blazer laid next to a shimmering liquid bronze silk maxi skirt, black silk cami, metallic gold strappy sandals, and a deep terracotta velvet evening pouch, styled on a warm textured cream linen background, dramatic cinematic lighting.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Night Out · Tuxedo Slip & Gilded Drama',
          ['#1D2E49', '#C5A059', '#111111', '#882D20'],
          ['Jacquard Blazer', 'Liquid Bronze Silk Skirt', 'Black Silk Cami', 'Velvet Evening Pouch'],
          'Night Out'
        ),
      },
    ],
  },
  {
    id: 'cobalt-trousers',
    name: 'Cobalt Architectural Wide-Leg Trousers',
    category: 'Bottoms · Trousers',
    subtitle: 'Vibrant Klein blue high-waisted wool trousers with crisp double pleats',
    previewImage: cobaltTrouserPreview,
    analysis: {
      itemName: 'Cobalt Architectural Wide-Leg Trousers',
      category: 'Bottoms / Tailored Trousers',
      primaryColors: [
        { name: 'Electric Cobalt', hex: '#1A428A', role: 'dominant', undertone: 'cool' },
        { name: 'Ultramarine Tint', hex: '#2659B8', role: 'secondary', undertone: 'cool' },
        { name: 'Warm Putty', hex: '#EAE6DC', role: 'accent', undertone: 'warm' },
        { name: 'Slate Charcoal', hex: '#2D3139', role: 'undertone', undertone: 'neutral' },
      ],
      silhouette: 'High-waisted, dramatic wide-leg drape with deep front knife pleats',
      patternType: 'Solid saturated saturation with smooth tropical wool finish',
      styleTags: ['Color Drench', 'Architectural Silhouette', 'Power Dressing', 'Vibrant Tailoring'],
      stylingDifficulty: 'Moderate',
      stylingChallenge: 'High-chroma blue dominates the bottom half. Clashing with standard blues creates muddy dissonance, while pure black looks overly stark.',
      stylistCoreTip: 'Pair with rich warm neutrals like camel, chocolate brown, and buttery cream rather than harsh jet black to make the blue look expensive and intentional.',
    },
    outfits: [
      {
        id: 'trousers-casual',
        occasion: 'Casual',
        title: 'Downtown Casual Colorblock',
        mood: 'Youthful, effortless, creative urban sportswear',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Cobalt Architectural Wide-Leg Trousers',
            color: 'Electric Cobalt',
            material: 'Tropical Virgin Wool',
            stylingTip: 'Puddle hem gently resting over sneaker tongues',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Boxy Heavyweight Organic T-Shirt',
            color: 'Washed Oat Beige',
            material: 'Heavyweight French Terry Cotton',
            stylingTip: 'Tucked cleanly into the high trouser waistband',
          },
          {
            id: 'p3',
            category: 'outerwear',
            name: 'Cropped Zipper Harrington Jacket',
            color: 'Rich Toffee Brown',
            material: 'Brushed Suede or Cotton Twill',
            stylingTip: 'Cropped waist shows off the trouser pleats and elongates legs',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Retro Gum-Sole Terrace Sneakers',
            color: 'Off-White & Forest Green Suede',
            material: 'Leather & Suede',
            stylingTip: 'Streetwear staple that brings sporty ease to tailored trousers',
          },
          {
            id: 'p5',
            category: 'accessory',
            name: 'Vintage Silk Pocket Kerchief or Scarf',
            color: 'Multicolor Warm Geometry',
            material: 'Silk Twill',
            stylingTip: 'Tied around the neck or bag strap for an artistic touch',
          },
        ],
        colorTheory: 'Warm-Cool Complementary: Toffee brown and oat beige warm up the icy electric energy of cobalt blue.',
        balanceRule: 'Cropped Jacket + High Waist: Enhances proportions by keeping the torso compact while trousers lengthen the lower frame.',
        stylistRationale: 'Tailored trousers worn with sneakers and a cropped jacket strike that coveted "model-off-duty" coolness.',
        flatLayPrompt: 'Clean flat-lay photo of cobalt blue wide-leg trousers laid with an oat-colored boxy t-shirt, a cropped toffee suede jacket, off-white retro sneakers with gum soles, and a folded silk scarf, styled on natural stone linen fabric, contemporary street style editorial.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Casual · Downtown Colorblock',
          ['#1A428A', '#8F5429', '#E6E1D8', '#2D4C3A'],
          ['Cobalt Wool Trousers', 'Oat Boxy Tee', 'Toffee Suede Jacket', 'Gum Sole Sneakers'],
          'Casual'
        ),
      },
      {
        id: 'trousers-business',
        occasion: 'Business',
        title: 'The Contemporary Power Palette',
        mood: 'Confident, creative director polish, sharp elegance',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Cobalt Architectural Wide-Leg Trousers',
            color: 'Electric Cobalt',
            material: 'Tropical Virgin Wool',
            stylingTip: 'Sharp center crease pressed to perfection',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Fine-Gauge Merino Wool Turtleneck',
            color: 'Bitter Chocolate Brown',
            material: 'Extra-Fine 100% Merino',
            stylingTip: 'Sleek second-skin knit provides sophisticated color warmth',
          },
          {
            id: 'p3',
            category: 'outerwear',
            name: 'Double-Faced Wool Trench Coat',
            color: 'Classic Trench Camel',
            material: 'Cashmere-Wool Blend',
            stylingTip: 'Worn open to frame the bold cobalt and brown pairing',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Pointed Sculptural Kitten Heel Boots',
            color: 'Polished Cognac Leather',
            material: 'Glazed Calf Leather',
            stylingTip: 'Sharp pointed toe extends the wide trouser hemline',
          },
          {
            id: 'p5',
            category: 'bag',
            name: 'Structured Trapeze Top-Handle Bag',
            color: 'Rich Espresso Leather',
            material: 'Box Calfskin with Minimal Hardware',
            stylingTip: 'Grounds the vivid cobalt with luxurious chocolate warmth',
          },
        ],
        colorTheory: 'The Designer Secret: Cobalt Blue + Rich Chocolate Brown is one of fashion’s most expensive-looking, non-traditional corporate combinations.',
        balanceRule: 'Streamlined Torso + Expansive Trousers: A sleek fitted turtleneck prevents volume clash with wide trousers.',
        stylistRationale: 'Steering clear of standard black blazers makes the cobalt trousers feel like intentional high-fashion design rather than a uniform mistake.',
        flatLayPrompt: 'Editorial flat-lay photo of cobalt blue wide-leg trousers arranged with a chocolate brown fine-knit turtleneck, a classic camel double-faced trench coat, polished cognac pointed ankle boots, and an espresso structured handbag on a textured ecru linen background, Harper’s Bazaar styling.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Business · Contemporary Power Palette',
          ['#1A428A', '#382218', '#C39A68', '#784323'],
          ['Cobalt Wide Trousers', 'Chocolate Merino Turtleneck', 'Camel Wool Trench', 'Cognac Pointed Boots'],
          'Business'
        ),
      },
      {
        id: 'trousers-night-out',
        occasion: 'Night Out',
        title: 'Midnight Monochrome & Silver Sheen',
        mood: 'Sleek, cocktail-ready, modern architectural glam',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Cobalt Architectural Wide-Leg Trousers',
            color: 'Electric Cobalt',
            material: 'Tropical Virgin Wool',
            stylingTip: 'Flows with rhythm across evening party floors',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Metallic Sheer Chainmail Camisole',
            color: 'Liquid Silver',
            material: 'Fine Aluminum Mesh',
            stylingTip: 'Tucked cleanly into the high-waisted waistband',
          },
          {
            id: 'p3',
            category: 'outerwear',
            name: 'Oversized Silk Lapel Tuxedo Blazer',
            color: 'Smoky Charcoal Ink',
            material: 'Wool Barathea with Silk Lapel',
            stylingTip: 'Draped loosely over the shoulders',
          },
          {
            id: 'p4',
            category: 'shoes',
            name: 'Mirror-Finish Silver Ankle-Strap Sandals',
            color: 'Specular Chrome Silver',
            material: 'Polished Mirror Specchio',
            stylingTip: 'Reflects ambient club and cocktail lighting',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Sculptural Sterling Silver Cuff',
            color: 'Brushed Chrome',
            material: '925 Sterling Silver',
            stylingTip: 'Single substantial jewelry anchor on the wrist',
          },
        ],
        colorTheory: 'Cool Future Palette: Liquid silver and smoky charcoal complement the electric blue wavelength without competing for attention.',
        balanceRule: 'Subtle Sheer Flash under Masculine Tailoring: The metallic cami provides an unexpected flash of skin beneath structured tailoring.',
        stylistRationale: 'Tailored trousers for an evening event are effortlessly chic when offset with liquid metallic jewelry and sharp tuxedo accents.',
        flatLayPrompt: 'High fashion flat-lay photograph of cobalt blue trousers laid alongside a liquid silver chainmail top, an oversized tuxedo blazer, metallic silver high-heel sandals, and a sculptural silver cuff bracelet on an artisanal textured linen backdrop, sleek futuristic cocktail styling.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Night Out · Midnight Monochrome & Silver',
          ['#1A428A', '#D8DCE3', '#1A1C20', '#A8B0BC'],
          ['Cobalt Wide-Leg Trousers', 'Silver Chainmail Cami', 'Tuxedo Blazer', 'Mirror Chrome Sandals'],
          'Night Out'
        ),
      },
    ],
  },
  {
    id: 'leopard-slip',
    name: 'Vintage Silk Leopard Print Slip Dress',
    category: 'One-Piece · Dress',
    subtitle: 'Classic 90s bias-cut silk dress with subtle micro-scale rosette print',
    previewImage: leopardDressPreview,
    analysis: {
      itemName: 'Vintage Silk Leopard Print Slip Dress',
      category: 'Dresses / Slip Dress',
      primaryColors: [
        { name: 'Warm Tawny Brown', hex: '#5C3E21', role: 'dominant', undertone: 'warm' },
        { name: 'Warm Cream Silk', hex: '#E7DFD5', role: 'secondary', undertone: 'warm' },
        { name: 'Espresso Black', hex: '#1A1817', role: 'accent', undertone: 'warm' },
        { name: 'Golden Honey', hex: '#E5A93C', role: 'undertone', undertone: 'warm' },
      ],
      silhouette: '90s minimalist bias-cut midi with delicate spaghetti straps',
      patternType: 'Organic micro leopard rosette print on warm ecru silk ground',
      styleTags: ['90s Minimalist', 'Animal Print Neutral', 'Bias Cut', 'Sensual Fluidity'],
      stylingDifficulty: 'Challenging',
      stylingChallenge: 'Leopard print walks a razor-thin line between timeless chic and tacky. Requires clean, austere tailoring and quiet textures to keep it elevated.',
      stylistCoreTip: 'Treat leopard print as a neutral! Pair it with clean menswear basics: crisp white poplin shirts, chunky black lug-sole loafers, or minimalist wool coats.',
    },
    outfits: [
      {
        id: 'leopard-casual',
        occasion: 'Casual',
        title: 'The Off-Duty 90s Icon',
        mood: 'Subversive, effortless, grunge-meets-minimalism',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Silk Leopard Print Midi Slip Dress',
            color: 'Tawny Ecru Leopard',
            material: '100% Silk Twill',
            stylingTip: 'Layered underneath a top or layered over a tee',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'top',
            name: 'Oversized Washed Cotton Crewneck Sweatshirt',
            color: 'Heather Stone Grey',
            material: 'Loopback French Terry',
            stylingTip: 'Worn over the dress so the slip flows like a silk skirt beneath',
          },
          {
            id: 'p3',
            category: 'shoes',
            name: 'Lug-Sole Leather Penny Loafers',
            color: 'Polished Black',
            material: 'Box Calf Leather with Rubber Lug',
            stylingTip: 'Thick sole grounds the delicate silk fabric',
          },
          {
            id: 'p4',
            category: 'bag',
            name: 'Structured Canvas & Leather Shopper',
            color: 'Ecru Canvas with Black Leather Trim',
            material: 'Heavy Duck Canvas',
            stylingTip: 'Utilitarian day bag balances the dress luxury',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Chunky Link Gold Chain Bracelet',
            color: 'Warm Gold',
            material: 'Heavy 18k Vermeil',
            stylingTip: '90s signature wrist accent',
          },
        ],
        colorTheory: 'Subdued Urban Tones: Heather grey and matte black restrain the animal print into everyday understated cool.',
        balanceRule: 'Weight Duality: Pairing a delicate bias slip with a heavy crewneck sweater and chunky lug loafers creates the ultimate stylish contrast.',
        stylistRationale: 'By throwing a sweatshirt over a slip dress, you turn a sultry evening piece into a wearable daytime skirt.',
        flatLayPrompt: 'Editorial flat-lay photo of a silk leopard print slip dress styled with an oversized heather grey crewneck sweatshirt, chunky black lug-sole loafers, an ecru canvas tote bag, and a gold link chain bracelet on a warm linen background, effortless street fashion layout.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Casual · The Off-Duty 90s Icon',
          ['#5C3E21', '#989898', '#1A1817', '#E5A93C'],
          ['Silk Leopard Slip', 'Heather Grey Sweatshirt', 'Black Lug-Sole Loafers', 'Canvas Shopper Tote'],
          'Casual'
        ),
      },
      {
        id: 'leopard-business',
        occasion: 'Business',
        title: 'Creative Professional Suiting Layer',
        mood: 'Sharp, artistic, elevated boardroom confidence',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Silk Leopard Print Midi Slip Dress',
            color: 'Tawny Ecru Leopard',
            material: '100% Silk Twill',
            stylingTip: 'Acts as an artistic print foundation beneath suiting',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'outerwear',
            name: 'Double-Breasted Wool Oversized Blazer',
            color: 'Crisp Jet Black',
            material: 'Tropical Suiting Wool',
            stylingTip: 'Structured shoulders counterbalance the fluid silk drape',
          },
          {
            id: 'p3',
            category: 'shoes',
            name: 'Knee-High Pointed Leather Riding Boots',
            color: 'Espresso Black',
            material: 'Smooth Glove Leather',
            stylingTip: 'Shaft goes up under the slip dress hem for a continuous column',
          },
          {
            id: 'p4',
            category: 'layer',
            name: 'Fitted Sheer Wool Long-Sleeve Layer',
            color: 'Deep Black',
            material: 'Fine Gauge Merino',
            stylingTip: 'Worn under the slip dress straps for modest office coverage',
          },
          {
            id: 'p5',
            category: 'bag',
            name: 'Minimalist Flap Lock Brief Bag',
            color: 'Polished Black Box Leather',
            material: 'Full-Grain Leather with Brass Lock',
            stylingTip: 'Sleek architectural lines',
          },
        ],
        colorTheory: 'Framed Focus: Pure monochrome black frames the animal print, isolating it as a tasteful art print rather than busy clothing.',
        balanceRule: 'Modesty Layering: A thin black turtleneck underneath transforms a cocktail spaghetti strap dress into office-appropriate attire.',
        stylistRationale: 'Layering a turtleneck under a slip dress topped with an oversized tailored blazer is an international fashion editor classic.',
        flatLayPrompt: 'Flat-lay fashion composition of a silk leopard slip dress paired with a structured black tailored blazer, a fitted black fine-knit underlayer, tall pointed black leather boots, and a structured black leather handbag on clean cream linen canvas, high-end editorial wardrobe.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Business · Creative Suiting Layer',
          ['#5C3E21', '#111111', '#E7DFD5', '#D4AF37'],
          ['Leopard Slip Dress', 'Black Tailored Blazer', 'Black Merino Layer', 'Knee-High Black Boots'],
          'Business'
        ),
      },
      {
        id: 'leopard-night-out',
        occasion: 'Night Out',
        title: 'Minimalist Parisian Cocktail',
        mood: 'Sensual, magnetic, timeless Golden Age chic',
        pieces: [
          {
            id: 'p1',
            category: 'bottom',
            name: 'Silk Leopard Print Midi Slip Dress',
            color: 'Tawny Ecru Leopard',
            material: '100% Silk Twill',
            stylingTip: 'Worn alone with delicate spaghetti straps showing',
            isOriginalItem: true,
          },
          {
            id: 'p2',
            category: 'outerwear',
            name: 'Shearling or Textured Wool Overcoat',
            color: 'Deep Camel Brown',
            material: 'Alpaca-Wool Blend',
            stylingTip: 'Draped over shoulders upon arrival and departure',
          },
          {
            id: 'p3',
            category: 'shoes',
            name: 'Minimal Strappy Kitten Heels',
            color: 'Black Patent Leather',
            material: 'Glossy Patent Calf',
            stylingTip: 'Slender straps highlight the foot and ankle line',
          },
          {
            id: 'p4',
            category: 'bag',
            name: 'Silk Satin Drawstring Pouch',
            color: 'Liquid Champagne Gold',
            material: 'Heavy Silk Satin',
            stylingTip: 'Echoes the champagne gold highlights in the leopard print',
          },
          {
            id: 'p5',
            category: 'jewelry',
            name: 'Sculptural Molten Gold Drop Earrings',
            color: '18k Polished Gold',
            material: 'Vermeil',
            stylingTip: 'Organic molten metal mirrors the animal print curves',
          },
        ],
        colorTheory: 'Harmonious Gold & Umber: Camel outerwear and molten gold jewelry amplify the natural warm highlights of the leopard rosettes.',
        balanceRule: 'Simplicity Rules: Because the print is bold, keep jewelry sculptural and shoes whisper-thin.',
        stylistRationale: 'When wearing a statement leopard slip at night, let the dress speak. Add nothing more than delicate heels and glowing gold jewelry.',
        flatLayPrompt: 'Luxury evening flat-lay photo of a silk leopard print slip dress styled with a plush camel wool coat, black patent kitten-heel sandals, a champagne satin pouch, and molten gold drop earrings, laid flat on raw natural linen with soft evening shadows, French Vogue aesthetic.',
        flatLayImageUrl: createEditorialFlatlaySVG(
          'Night Out · Minimalist Parisian Cocktail',
          ['#5C3E21', '#9E6534', '#0E0D0D', '#ECC676'],
          ['Silk Leopard Slip', 'Camel Alpaca Coat', 'Black Patent Strappy Heels', 'Champagne Satin Pouch'],
          'Night Out'
        ),
      },
    ],
  },
];
