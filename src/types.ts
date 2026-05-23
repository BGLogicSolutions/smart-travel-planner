export type BudgetLevel = 'Bajo' | 'Medio' | 'Alto';
export type TripType = 'Aventura' | 'Familiar' | 'Relajación';

export interface TravelRequest {
  destination: string;
  days: number;
  budget: BudgetLevel;
  tripType: TripType;
  geminiApiKey?: string;
}

export interface DailyPlan {
  dayNumber: number;
  morning: string;
  lunch: string;
  afternoon: string;
  night: string;
}

export interface TravelTips {
  transport: string;
  safeZones: string;
  commonScam: string;
}

export interface ItineraryResponse {
  days: DailyPlan[];
  tips: TravelTips;
}
