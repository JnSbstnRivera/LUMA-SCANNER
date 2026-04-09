
import { GoogleGenAI, Type } from "@google/genai";
import { ConsumptionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBillFile = async (base64Data: string, mimeType: string): Promise<ConsumptionData> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analiza exhaustivamente esta factura de LUMA Energy (Puerto Rico) para extraer datos precisos de consumo.
    
    INSTRUCCIONES ESPECÍFICAS PARA ALTA PRECISIÓN:
    1. PÁGINA 4 (Historial): Localiza el gráfico de barras de los últimos 12 meses. Generalmente hay una tabla al lado o debajo del gráfico con los valores numéricos exactos de kWh por mes. Úsalos para calcular el promedio y el pico.
    2. PÁGINA 3 (Desglose): Localiza el gráfico circular y el texto descriptivo del consumo del periodo actual. Verifica si el kWh de este mes coincide con el último dato del historial de la página 4.
    3. EXTRACCIÓN REQUERIDA:
       - Consumo promedio mensual (kWh): Calcula el promedio real de los 12 meses mostrados en la barra.
       - Consumo del último mes (kWh): El valor del mes más reciente en el historial.
       - Consumo más alto (Pico kWh): El valor máximo de la serie histórica de 12 meses.
       - Dirección del servicio y Número de cuenta.

    Si los valores numéricos no están escritos explícitamente en una tabla, mide la altura de las barras del gráfico en la página 4 contra la escala del eje Y para una estimación precisa.
    Realiza una validación cruzada entre el total de cargos y el consumo indicado para asegurar que el dato de kWh es consistente.
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
          monthlyAverageKwh: { type: Type.NUMBER, description: "Promedio mensual de kWh calculado de la página 4" },
          lastMonthKwh: { type: Type.NUMBER, description: "Consumo del periodo actual verificado en página 3 y 4" },
          highestMonthKwh: { type: Type.NUMBER, description: "Valor más alto de la gráfica de barras de la página 4" },
          address: { type: Type.STRING, description: "Dirección física del servicio" },
          accountNumber: { type: Type.STRING, description: "Número de cuenta de LUMA" }
        },
        required: ["monthlyAverageKwh", "lastMonthKwh", "highestMonthKwh"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as ConsumptionData;
};
