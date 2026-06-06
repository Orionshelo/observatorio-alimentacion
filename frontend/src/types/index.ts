export type FoodCategory =
  | 'cereales'
  | 'frutas'
  | 'verduras'
  | 'lacteos'
  | 'proteinas'
  | 'grasas'
  | 'azucares'
  | 'leguminosas'
  | 'tuberculos'
  | 'pescados';

export type PopulationGroup =
  | 'gestantes'
  | 'lactantes'
  | 'ninos_0_6'
  | 'ninos_6_24'
  | 'ninos_2_5'
  | 'general';

export interface GuideRecommendation {
  population: PopulationGroup;
  priority:   'alta' | 'media';
  reason:     string;
}

export interface FoodItem {
  id:                string;
  name:              string;
  localName?:        string;
  category:          FoodCategory;
  emoji:             string;
  nutritionScore:    number;
  nutrients:         NutrientProfile;
  season?:           string[];
  preparation?:      string[];
  notes?:            string;
  guideRecommended?: GuideRecommendation[];
}

export interface NutrientProfile {
  protein:     number;  // g/100g
  carbs:       number;
  fat:         number;
  fiber:       number;
  iron:        number;  // mg/100g
  calcium:     number;  // mg/100g
  vitaminC:    number;  // mg/100g
  folate:      number;  // mcg/100g
}

export interface RegionalMenu {
  id:          string;
  name:        string;
  description: string;
  foods:       string[];   // FoodItem ids
  population:  PopulationGroup;
  isTraditional: boolean;
  submittedBy?: string;
  submittedAt?: string;
  verified:    boolean;
}

export interface SubRegion {
  id:          string;
  name:        string;
  department:  string;
  macroRegion: MacroRegion;
  coordinates: [number, number];  // [lat, lng]
  isPrioritized: boolean;
  foods:       FoodItem[];
  menus:       RegionalMenu[];
  color:       string;
  population:  number;
  nutritionAlert?: 'critica' | 'moderada' | 'buena';
}

export type MacroRegion =
  | 'caribe'
  | 'andina'
  | 'pacifico'
  | 'amazonia'
  | 'orinoquia'
  | 'insular';

export interface ColombiaRegion {
  id:          string;
  name:        string;
  macroRegion: MacroRegion;
  departments: string[];
  subRegions:  SubRegion[];
  color:       string;
  geoCenter:   [number, number];
}

export interface CommunitySubmission {
  id?:         string;
  menuName:    string;
  description: string;
  foods:       string[];
  region:      string;
  subRegion?:  string;
  population:  PopulationGroup;
  contact?:    string;
  channel?:    'web' | 'whatsapp' | 'telegram';
  submittedAt: string;
}

export interface NutritionStats {
  region:           string;
  avgNutritionScore: number;
  foodDiversity:    number;
  proteinAccess:    number;
  ironDeficiency:   number;
  totalFoodsMaped:  number;
}

export interface PortionExample {
  category:     string;
  description:  string;
  localExample: string;
}

export interface FoodGuide {
  id:              string;
  title:           string;
  population:      PopulationGroup;
  ageRange?:       string;
  dailyPortions:   Record<FoodCategory, number>;
  keyMessages:     string[];
  mealsPerDay:     string;
  hydrationLiters: number;
  supplements:     string[];
  avoidFoods:      string[];
  portionExamples: PortionExample[];
  sourceUrl?:      string;
}
