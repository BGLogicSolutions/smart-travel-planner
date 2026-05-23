export interface TravelRequest {
  destination: string;
  days: number;
  budget: 'bajo' | 'medio' | 'alto';
  tripType: 'Aventura' | 'Familiar' | 'Relajación';
  geminiApiKey?: string;
}

export interface DayPlan {
  dayNumber: number;
  morning: string;
  lunch: string;
  afternoon: string;
  night: string;
}

export interface Tips {
  transport: string;
  safeZones: string;
  commonScam: string;
}

export interface ItineraryResponse {
  days: DayPlan[];
  tips: Tips;
}
