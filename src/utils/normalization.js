export const SCALES = {
    transporte: [
      { limit: 200, score: 100, level: "Accesibilidad muy alta", label: "≤ 200 m" },
      { limit: 300, score: 85, level: "Accesibilidad alta", label: "> 200–300 m" },
      { limit: 400, score: 70, level: "Accesibilidad buena", label: "> 300–400 m" },
      { limit: 500, score: 55, level: "Accesibilidad media", label: "> 400–500 m" },
      { limit: 600, score: 40, level: "Accesibilidad baja", label: "> 500–600 m" },
      { limit: 800, score: 25, level: "Accesibilidad muy baja", label: "> 600–800 m" },
      { limit: Infinity, score: 10, level: "Accesibilidad extremadamente baja", label: "> 800 m" }
    ],
    educacion: [
      { limit: 600, score: 100, level: "Accesibilidad muy alta", label: "≤ 600 m" },
      { limit: 800, score: 85, level: "Accesibilidad alta", label: "> 600–800 m" },
      { limit: 1000, score: 70, level: "Accesibilidad buena", label: "> 800–1000 m" },
      { limit: 1200, score: 55, level: "Accesibilidad media", label: "> 1000–1200 m" },
      { limit: 1500, score: 40, level: "Accesibilidad baja", label: "> 1200–1500 m" },
      { limit: 2000, score: 25, level: "Accesibilidad muy baja", label: "> 1500–2000 m" },
      { limit: Infinity, score: 10, level: "Accesibilidad extremadamente baja", label: "> 2000 m" }
    ],
    salud: [
      { limit: 600, score: 100, level: "Accesibilidad muy alta", label: "≤ 600 m" },
      { limit: 1000, score: 85, level: "Accesibilidad alta", label: "> 600–1000 m" },
      { limit: 1500, score: 70, level: "Accesibilidad buena", label: "> 1000–1500 m" },
      { limit: 2000, score: 55, level: "Accesibilidad media", label: "> 1500–2000 m" },
      { limit: 2500, score: 40, level: "Accesibilidad baja", label: "> 2000–2500 m" },
      { limit: 3000, score: 25, level: "Accesibilidad muy baja", label: "> 2500–3000 m" },
      { limit: Infinity, score: 10, level: "Accesibilidad extremadamente baja", label: "> 3000 m" }
    ],
    comercio: [
      { limit: 600, score: 100, level: "Accesibilidad muy alta", label: "≤ 600 m" },
      { limit: 1000, score: 85, level: "Accesibilidad alta", label: "> 600–1000 m" },
      { limit: 1500, score: 70, level: "Accesibilidad buena", label: "> 1000–1500 m" },
      { limit: 2000, score: 55, level: "Accesibilidad media", label: "> 1500–2000 m" },
      { limit: 2500, score: 40, level: "Accesibilidad baja", label: "> 2000–2500 m" },
      { limit: 3000, score: 25, level: "Accesibilidad muy baja", label: "> 2500–3000 m" },
      { limit: Infinity, score: 10, level: "Accesibilidad extremadamente baja", label: "> 3000 m" }
    ],
    areasVerdes: [
      { limit: 200, score: 100, level: "Accesibilidad muy alta", label: "≤ 200 m" },
      { limit: 400, score: 85, level: "Accesibilidad alta", label: "> 200–400 m" },
      { limit: 600, score: 70, level: "Accesibilidad buena", label: "> 400–600 m" },
      { limit: 800, score: 55, level: "Accesibilidad media", label: "> 600–800 m" },
      { limit: 1000, score: 40, level: "Accesibilidad baja", label: "> 800–1000 m" },
      { limit: 1500, score: 25, level: "Accesibilidad muy baja", label: "> 1000–1500 m" },
      { limit: Infinity, score: 10, level: "Accesibilidad extremadamente baja", label: "> 1500 m" }
    ]
  };
  
  export function calculateAccessibilityScore(factorId, distance) {
    const distNum = parseFloat(distance);
    if (isNaN(distNum) || distNum < 0) {
      throw new Error("La distancia debe ser un valor numérico positivo.");
    }
    
    const factorScale = SCALES[factorId];
    if (!factorScale) throw new Error(`Factor no encontrado: ${factorId}`);
  
    const rangeMatch = factorScale.find(r => distNum <= r.limit);
    
    return {
      distance: distNum,
      score: rangeMatch.score,
      level: rangeMatch.level,
      range: rangeMatch.label
    };
  }