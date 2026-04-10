
import { GoogleGenAI, Type } from "@google/genai";
import { ConsumptionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBillFile = async (base64Data: string, mimeType: string): Promise<ConsumptionData> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Eres un experto en lectura de facturas eléctricas de LUMA Energy (Puerto Rico).

    PASO 1 — VERIFICACIÓN DE LEGIBILIDAD:
    Antes de extraer cualquier dato, determina si el archivo es una factura de LUMA Energy legible.
    - Si la imagen está borrosa, muy oscura, cortada o no es una factura eléctrica de LUMA, establece "readableImage": false.
    - Si puedes identificar claramente datos de consumo en kWh, establece "readableImage": true.

    PASO 2 — EXTRACCIÓN DE CONSUMO (solo si readableImage es true):
    Las facturas de LUMA pueden variar en formato. NO asumas un número de página fijo.
    Busca en TODO el documento las siguientes secciones:

    A) HISTORIAL DE CONSUMO (prioridad alta):
       - Localiza el gráfico de barras o tabla con kWh por mes de los últimos 12 meses.
       - Si los valores están escritos explícitamente en una tabla o etiquetas: úsalos directamente.
       - Si solo hay gráfico de barras sin números: estima comparando la altura de cada barra contra la escala del eje Y.
       - Calcula el PROMEDIO de todos los meses visibles.
       - Identifica el mes de MAYOR consumo (pico histórico).

    B) CONSUMO DEL PERÍODO ACTUAL:
       - Busca el kWh facturado en el período actual. Puede aparecer como "kWh used", "Usage", "Consumo del periodo", "KWH" o similar.
       - Valida que sea coherente con el historial (no debería ser 10x mayor o menor sin razón).

    C) DATOS DE CUENTA:
       - Dirección del servicio eléctrico.
       - Número de cuenta de LUMA.

    PASO 3 — VALIDACIÓN CRUZADA:
    Verifica consistencia entre el consumo actual y el total facturado en dólares.
    En Puerto Rico, el costo por kWh ronda $0.23–$0.32. Si el consumo declarado no es razonable para el monto facturado, ajusta tu estimación.

    CONTEXTO IMPORTANTE: Estos datos se usan para dimensionar un sistema solar fotovoltaico en Puerto Rico con paneles de 410W y 4.5 horas pico de sol al día. La precisión del promedio y del pico histórico es crítica para una cotización correcta.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          readableImage: { type: Type.BOOLEAN, description: "true si el archivo es una factura de LUMA legible con datos de consumo visibles, false si está borrosa, cortada o no es una factura de LUMA" },
          monthlyAverageKwh: { type: Type.NUMBER, description: "Promedio mensual de kWh calculado del historial de 12 meses" },
          lastMonthKwh: { type: Type.NUMBER, description: "Consumo del período actual en kWh" },
          highestMonthKwh: { type: Type.NUMBER, description: "Valor más alto registrado en el historial de consumo" },
          address: { type: Type.STRING, description: "Dirección física del servicio eléctrico" },
          accountNumber: { type: Type.STRING, description: "Número de cuenta de LUMA Energy" }
        },
        required: ["readableImage", "monthlyAverageKwh", "lastMonthKwh", "highestMonthKwh"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');

  if (!result.readableImage) {
    throw new Error('UNREADABLE_IMAGE');
  }

  if (!result.monthlyAverageKwh || result.monthlyAverageKwh === 0) {
    throw new Error('NO_DATA_FOUND');
  }

  return result as ConsumptionData;
};
