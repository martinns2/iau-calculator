import { calculateAccessibilityScore } from './normalization';

export const FACTOR_NAMES = {
  transporte: "Transporte público",
  educacion: "Educación",
  salud: "Salud",
  comercio: "Comercio/abasto",
  areasVerdes: "Áreas verdes"
};

export function getIAUInterpretation(score) {
    if (score >= 80) return { level: "Accesibilidad Muy Alta", color: "text-emerald-700", bg: "bg-emerald-100" };
    if (score >= 60) return { level: "Accesibilidad Alta", color: "text-blue-700", bg: "bg-blue-100" };
    if (score >= 40) return { level: "Accesibilidad Media", color: "text-amber-700", bg: "bg-amber-100" };
    if (score >= 20) return { level: "Accesibilidad Baja", color: "text-orange-700", bg: "bg-orange-100" };
    return { level: "Accesibilidad Deficiente", color: "text-red-700", bg: "bg-red-100" };
}

export function calculateIAU(projectDistances, weights = { transporte: 20, educacion: 20, salud: 20, comercio: 20, areasVerdes: 20 }) {
    const totalWeight = Object.values(weights).reduce((a, b) => a + parseFloat(b), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
        throw new Error(`Los pesos deben sumar exactamente 100%. Actual: ${totalWeight.toFixed(2)}%`);
    }

    let finalIAU = 0;
    const factorResults = {};
    let highestFactor = { score: -1, id: null };
    let lowestFactor = { score: 101, id: null };

    for (const [factor, distance] of Object.entries(projectDistances)) {
        const scoreData = calculateAccessibilityScore(factor, distance);
        const factorWeightDecimal = parseFloat(weights[factor]) / 100;
        const aportePonderado = scoreData.score * factorWeightDecimal;

        factorResults[factor] = {
            ...scoreData,
            name: FACTOR_NAMES[factor],
            weightPercent: weights[factor],
            ponderado: parseFloat(aportePonderado.toFixed(2))
        };
        finalIAU += aportePonderado;

        if (scoreData.score > highestFactor.score) highestFactor = { score: scoreData.score, id: factor, name: FACTOR_NAMES[factor] };
        if (scoreData.score < lowestFactor.score) lowestFactor = { score: scoreData.score, id: factor, name: FACTOR_NAMES[factor] };
    }

    return {
        factorDetails: factorResults,
        iauScore: Math.round(finalIAU),
        iauInterpretation: getIAUInterpretation(Math.round(finalIAU)),
        highestFactor,
        lowestFactor
    };
}