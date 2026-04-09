
export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface ConsumptionData {
  monthlyAverageKwh: number;
  lastMonthKwh: number;
  highestMonthKwh: number;
  address?: string;
  accountNumber?: string;
  existingPanelCount: number;
  existingPanelWattage: number;
  isExistingCustomer: boolean;
}

export interface SolarSystemRecommendation {
  totalPanelCountTarget: number;
  additionalPanelsNeeded: number;
  totalSystemSizeKw: number;
  estimatedMonthlyGeneration: number;
  offsetPercentage: number;
  batteryRecommendationKwh: number;
}

export interface AnalysisResult {
  consumption: ConsumptionData;
  recommendation: SolarSystemRecommendation;
}
