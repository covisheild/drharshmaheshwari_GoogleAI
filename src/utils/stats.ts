/**
 * Accurate Statistical & Normal Distribution Utilities for Chapter 8 Visualizer
 */

// Standard normal probability density function: phi(z)
export function standardNormalPdf(z: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
}

// Normal PDF with mean mu and standard deviation sigma
export function normalPdf(x: number, mean: number, sd: number): number {
  if (sd <= 0) return 0;
  const z = (x - mean) / sd;
  return standardNormalPdf(z) / sd;
}

// Standard normal cumulative distribution function: Phi(z)
// Accurate error function approximation (Abramowitz & Stegun formula 7.1.26, max error < 1.5e-7)
export function standardNormalCdf(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;

  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);

  // Constants
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * erf);
}

// Normal CDF with arbitrary mean and standard deviation
export function normalCdf(x: number, mean: number, sd: number): number {
  if (sd <= 0) return x >= mean ? 1 : 0;
  return standardNormalCdf((x - mean) / sd);
}

// Inverse standard normal cumulative distribution function (probit)
// Rational approximation (Peter John Acklam's algorithm, error < 1.15e-9)
export function standardNormalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Coefficients in rational approximations
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

  const q = p - 0.5;

  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return q * (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }

  const r = p < 0.5 ? p : 1 - p;
  const s = Math.sqrt(-Math.log(r));
  let val = (((((c[0] * s + c[1]) * s + c[2]) * s + c[3]) * s + c[4]) * s + c[5]) /
    ((((d[0] * s + d[1]) * s + d[2]) * s + d[3]) * s + 1);

  return p < 0.5 ? -val : val;
}

export interface PowerCalculationResult {
  alpha: number;
  zCrit: number;
  cutoffLow: number;
  cutoffHigh: number;
  se: number;
  trueDelta: number;
  beta: number;
  power: number;
  typeOneEachTail: number;
  cohensD: number;
}

export function computePower(
  trueDelta: number,
  se: number,
  alpha = 0.05,
  sigma = 2.0
): PowerCalculationResult {
  const zCrit = standardNormalQuantile(1 - alpha / 2);
  const cutoffHigh = zCrit * se;
  const cutoffLow = -cutoffHigh;

  // Under Alternative H1: N(trueDelta, se^2)
  // Type II error is probability of falling between cutoffs
  const zLow = (cutoffLow - trueDelta) / se;
  const zHigh = (cutoffHigh - trueDelta) / se;

  const beta = standardNormalCdf(zHigh) - standardNormalCdf(zLow);
  const power = 1 - beta;

  const cohensD = sigma > 0 ? trueDelta / sigma : 0;

  return {
    alpha,
    zCrit,
    cutoffLow,
    cutoffHigh,
    se,
    trueDelta,
    beta,
    power,
    typeOneEachTail: alpha / 2,
    cohensD,
  };
}

export function computeRequiredSampleSize(
  delta: number,
  sigma: number,
  alpha = 0.05,
  targetPower = 0.80
): { normalFormulaN: number; exactSoftwareN: number } {
  if (delta <= 0 || sigma <= 0) return { normalFormulaN: 0, exactSoftwareN: 0 };
  const zAlpha = standardNormalQuantile(1 - alpha / 2);
  const zBeta = standardNormalQuantile(targetPower);

  // Standard two-sample equal groups formula:
  // n = 2 * (z_{1-alpha/2} + z_{1-beta})^2 * (sigma / delta)^2
  const rawN = 2 * Math.pow(zAlpha + zBeta, 2) * Math.pow(sigma / delta, 2);
  const normalFormulaN = Math.round(rawN);
  // Software exact using non-central t or +1 correction commonly used in power packages
  const exactSoftwareN = normalFormulaN + 1;

  return { normalFormulaN, exactSoftwareN };
}

export function computeObservedPostHocPower(pValue: number, alpha = 0.05): number {
  if (pValue <= 0) return 1;
  if (pValue >= 1) return 0;

  const zCrit = standardNormalQuantile(1 - alpha / 2);
  const zObs = standardNormalQuantile(1 - pValue / 2);

  // Power against the observed effect size
  // Power = 1 - Phi(zCrit - zObs) + Phi(-zCrit - zObs)
  const power = 1 - standardNormalCdf(zCrit - zObs) + standardNormalCdf(-zCrit - zObs);
  return Math.min(1, Math.max(0, power));
}
