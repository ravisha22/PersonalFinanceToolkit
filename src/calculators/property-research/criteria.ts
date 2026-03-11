/**
 * Property research criteria — 3-layer framework.
 * Layer 1: Suburb (8 scored × 5 = 40 pts)
 * Layer 2: Intra-Suburb (2 dealbreakers + 6 scored × 5 = 30 pts)
 * Layer 3: Property (10 scored × 5 = 50 pts)
 * Total scored: 120 pts | Dealbreakers: fail = auto AVOID
 */

export type CriterionType = 'score' | 'dealbreaker';
export type Layer = 'suburb' | 'intrasuburb' | 'property';

export interface Criterion {
  id: string;
  label: string;
  description: string;
  type: CriterionType;
  maxPoints: number;
  layer: Layer;
  dataSource?: string;
}

export const CRITERIA: Criterion[] = [
  // ─── Layer 1: Suburb (40 pts) ─────────────────────────────────────────────
  {
    id: 'pop_growth',
    label: 'Population growth trend',
    description: 'Is the suburb growing? Check ABS Census data, council growth projections.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'ABS Census, council.gov.au',
  },
  {
    id: 'median_price_trend',
    label: 'Median price trend (5yr)',
    description: 'Has median price grown consistently over 5 years? Compare to metro average.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'CoreLogic, Domain, realestate.com.au',
  },
  {
    id: 'rental_yield',
    label: 'Rental yield',
    description: 'Gross rental yield vs suburb median. >4% is reasonable for most metros.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'SQM Research, Domain',
  },
  {
    id: 'days_on_market',
    label: 'Days on market',
    description: 'Low days on market = high demand. Compare to metro average.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'REA Insights, SQM Research',
  },
  {
    id: 'vacancy_rate',
    label: 'Vacancy rate',
    description: 'Low vacancy (<2%) = strong rental demand. High vacancy = risk.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'SQM Research (sqmresearch.com.au)',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure pipeline',
    description: 'Planned transport, schools, hospitals, shopping. Check council DA register.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'Infrastructure Australia, council.gov.au',
  },
  {
    id: 'school_quality',
    label: 'School catchment quality',
    description: 'Primary and secondary school ratings. Strong schools = sustained demand.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'MySchool (myschool.edu.au)',
  },
  {
    id: 'crime_rate',
    label: 'Crime rate',
    description: 'Property and violent crime relative to state average.',
    type: 'score', maxPoints: 5, layer: 'suburb',
    dataSource: 'Police.vic.gov.au, NSW Bureau of Crime Statistics',
  },

  // ─── Layer 2: Intra-Suburb (2 dealbreakers + 6 scored = 30 pts) ──────────
  {
    id: 'flood_zone',
    label: 'Flood zone check',
    description: 'DEAL BREAKER: Is the property in a flood overlay? Check council flood maps.',
    type: 'dealbreaker', maxPoints: 0, layer: 'intrasuburb',
    dataSource: 'Council flood maps, VicPlan, NSW Flood Tool',
  },
  {
    id: 'bushfire_zone',
    label: 'Bushfire Attack Level (BAL)',
    description: 'DEAL BREAKER: Is the property in a BAL-12.5 or higher bushfire zone?',
    type: 'dealbreaker', maxPoints: 0, layer: 'intrasuburb',
    dataSource: 'VicEmergency, NSW RFS, DPIE Planning Portal',
  },
  {
    id: 'transport_access',
    label: 'Proximity to train/tram',
    description: 'Walking distance to train or tram stop. <500m is ideal.',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
    dataSource: 'Google Maps, PTV, TfNSW',
  },
  {
    id: 'street_type',
    label: 'Street type & traffic',
    description: 'Quiet residential street vs arterial road. Traffic noise/safety impact.',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
  },
  {
    id: 'zoning',
    label: 'Zoning & development risk',
    description: 'Is there risk of high-density development nearby blocking light/views/demand?',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
    dataSource: 'VicPlan (planning.vic.gov.au), NSW Planning Portal',
  },
  {
    id: 'walkability',
    label: 'Walkability score',
    description: 'Proximity to cafes, shops, parks. High walkability = rental premium.',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
    dataSource: 'Walk Score, Microburbs',
  },
  {
    id: 'neighbouring_properties',
    label: 'Neighbouring properties condition',
    description: 'Well-maintained neighbours protect your property value.',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
  },
  {
    id: 'easements',
    label: 'Power lines / easements',
    description: 'Overhead power lines or easements limit building and reduce appeal.',
    type: 'score', maxPoints: 5, layer: 'intrasuburb',
    dataSource: 'Land title search, Dial Before You Dig',
  },

  // ─── Layer 3: Property (10 scored × 5 = 50 pts) ─────────────────────────
  {
    id: 'land_size',
    label: 'Land size & land-to-asset ratio',
    description: 'Higher land content = better long-term capital growth driver.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'building_condition',
    label: 'Building age & condition',
    description: 'Newer or well-maintained. Factor in upcoming capex (roof, plumbing, wiring).',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'floor_plan',
    label: 'Floor plan functionality',
    description: 'Practical layout with good separation of living/sleeping areas.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'natural_light',
    label: 'Natural light & orientation',
    description: 'North-facing living areas = premium rental and sale demand.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'parking',
    label: 'Parking',
    description: 'Garage, lock-up, or secure off-street parking. Essential in most suburbs.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'depreciation',
    label: 'Depreciation potential',
    description: 'Newer properties offer higher plant & equipment and building depreciation claims.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'renovation_scope',
    label: 'Renovation / value-add scope',
    description: 'Can you add value through cosmetic or structural renovation?',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'rental_appeal',
    label: 'Rental appeal',
    description: 'Would quality tenants want this property? Bedrooms, lifestyle, commute.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
  {
    id: 'body_corporate',
    label: 'Body corporate / strata fees',
    description: 'High strata fees erode yield. Check levies and sinking fund balance.',
    type: 'score', maxPoints: 5, layer: 'property',
    dataSource: 'Strata report, section 32 / contract of sale',
  },
  {
    id: 'title_type',
    label: 'Title type (torrens preferred)',
    description: 'Torrens title > company title > strata. Torrens has no strata restrictions.',
    type: 'score', maxPoints: 5, layer: 'property',
  },
];

export const LAYERS: { id: Layer; label: string; maxScore: number }[] = [
  { id: 'suburb',      label: 'Layer 1 — Suburb',       maxScore: 40 },
  { id: 'intrasuburb', label: 'Layer 2 — Intra-Suburb',  maxScore: 30 },
  { id: 'property',    label: 'Layer 3 — Property',      maxScore: 50 },
];
