export interface Dream {
  numero: string;
  palabra: string;
  descripcion: string;
}

export type View = 'search' | 'result' | 'simulator';

export type AnalysisLevel = 'Bajo' | 'Medio' | 'Alto' | null;

/**
 * Defines the multipliers for a specific number of digits.
 * The keys represent the scope of the bet (e.g., "1" for first place, "5" for top 5).
 * e.g., { "1": 70, "5": 14, "10": 7 } for 2 digits
 */
export interface DigitMultipliers {
  [alcance: string]: number;
}

/**
 * Defines the coefficients for bets of 1, 2, 3, and 4 digits.
 */
export interface PaymentCoefficients {
  '1_cifra': DigitMultipliers;
  '2_cifras': DigitMultipliers;
  '3_cifras': DigitMultipliers;
  '4_cifras': DigitMultipliers;
}

/**
 * The top-level structure of the pagos.json file.
 */
export interface PaymentData {
  moneda: string;
  nota: string;
  coeficientes: PaymentCoefficients;
}
