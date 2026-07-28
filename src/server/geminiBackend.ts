import { GoogleGenAI } from '@google/genai';

/**
 * Server-side Gemini Helper for InfraMind AI
 */

export async function analyzeMultimodalDataServer(payload: {
  projectContext: string;
  userPrompt?: string;
  images?: Array<{ mimeType: string; dataBase64: string }>;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return {
      status: 'fallback',
      message: 'GEMINI_API_KEY environment variable is not set. Using local InfraMind AI risk analysis engine.',
      assessment: null
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents: any[] = [];

    if (payload.images && payload.images.length > 0) {
      for (const img of payload.images) {
        contents.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: img.dataBase64
          }
        });
      }
    }

    const systemPrompt = `You are InfraMind AI, a specialized civil engineering multimodal risk assessment AI.
Analyze the provided excavation project site data, satellite imagery, street photos, utility maps, or permits.

Output MUST be a JSON object matching this schema EXACTLY:
{
  "overallRisk": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",
  "confidenceScore": number (0-100),
  "criticalThreatCount": number,
  "summary": "Brief 2-sentence executive summary of identified underground risks.",
  "reasoning": "Step-by-step explainable reasoning cross-referencing satellite, street photos, OCR, and permit records.",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "buriedDepthEstimate": "e.g. 1.2m ± 0.15m",
  "materialProjection": "e.g. Armored Copper Feeder / Ductile Iron Pipe",
  "detectedUtilities": [
    {
      "name": "Name of utility line",
      "type": "power" | "water" | "fiber" | "gas" | "sewer" | "unknown",
      "depthMeter": number,
      "status": "conflict" | "verified" | "unverified" | "abandoned",
      "riskNote": "Specific risk explanation"
    }
  ]
}

Context: ${payload.projectContext}
User Instructions: ${payload.userPrompt || 'Analyze site images and documents for hidden utility hazards, depth mismatches, and excavation threat conflicts.'}`;

    contents.push(systemPrompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return {
      status: 'success',
      assessment: parsed
    };
  } catch (error: any) {
    console.error('Gemini multimodal analysis error:', error);
    return {
      status: 'error',
      error: error.message || 'Failed to call Gemini API'
    };
  }
}

export async function getWeatherForecastServer(payload: { city: string; country: string; lat?: number; lng?: number }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const city = payload.city || 'Kigali';
  const country = payload.country || 'Rwanda';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Search for the current weather forecast and rain probability for ${city}, ${country}.
Analyze if rain or precipitation is expected and how rain affects ground excavation safety, soil stability (e.g. volcanic clay or laterite sloughing hazards), and trench collapse risks.

Output MUST be a single JSON object matching this schema EXACTLY:
{
  "city": "${city}",
  "country": "${country}",
  "temperatureC": 23,
  "condition": "Light Rain / Showers",
  "rainProbabilityPercent": 75,
  "isRainExpected": true,
  "precipitationMm": 4.5,
  "humidityPercent": 82,
  "windSpeedKmh": 14,
  "riskSeverity": "HIGH",
  "excavationImpact": "Precipitation in ${city} increases soil saturation and trench wall sloughing hazards. Hydraulic shoring and active dewatering pumps are mandatory."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        }
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
        return {
          status: 'success',
          weather: parsed,
          groundingSources: groundingChunks
        };
      }
    } catch (err) {
      console.error('Gemini weather search grounding failed, using Open-Meteo fallback:', err);
    }
  }

  // Fallback to Open-Meteo API
  try {
    const lat = payload.lat || -1.9441;
    const lng = payload.lng || 30.0619;
    const omRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation_probability,rain`);
    const omData = await omRes.json();

    if (omData?.current_weather) {
      const temp = omData.current_weather.temperature;
      const code = omData.current_weather.weathercode;
      const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
      const rainProb = omData.hourly?.precipitation_probability?.[0] || (isRain ? 75 : 30);

      return {
        status: 'success',
        weather: {
          city,
          country,
          temperatureC: Math.round(temp),
          condition: isRain ? 'Rain / Thunderstorms' : 'Partly Cloudy',
          rainProbabilityPercent: rainProb,
          isRainExpected: isRain || rainProb >= 50,
          precipitationMm: isRain ? 5.0 : 0.0,
          humidityPercent: isRain ? 85 : 68,
          windSpeedKmh: Math.round(omData.current_weather.windspeed || 12),
          riskSeverity: isRain || rainProb >= 50 ? 'HIGH' : 'MODERATE',
          excavationImpact: isRain || rainProb >= 50
            ? `Live weather alert for ${city}: Rain expected (${rainProb}% prob). High risk of volcanic red clay saturation and trench wall collapse. Deploy dewatering pumps and trench shoring.`
            : `Live weather for ${city}: Weather clear/stable. Moisture levels manageable for mechanical digging, monitor for afternoon downpours.`
        }
      };
    }
  } catch (omErr) {
    console.error('Open-meteo fallback failed:', omErr);
  }

  return {
    status: 'fallback',
    weather: {
      city,
      country,
      temperatureC: 22,
      condition: 'Tropical Rain Showers Forecasted',
      rainProbabilityPercent: 70,
      isRainExpected: true,
      precipitationMm: 4.0,
      humidityPercent: 82,
      windSpeedKmh: 14,
      riskSeverity: 'HIGH',
      excavationImpact: `Precipitation forecast for ${city}. Ground saturation increases soil sloughing risk along trench walls. Mandatory hydraulic shoring and dewatering pumps required.`
    }
  };
}

export async function chatWithCopilotServer(payload: {
  messages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
  projectContext?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return {
      status: 'fallback',
      reply: "Note: GEMINI_API_KEY environment variable is not set. Using built-in InfraMind excavation safety guidelines. Ask about depth buffers, GPR frequencies, or KPLC/WASAC permit requirements."
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are InfraMind AI Copilot, an expert underground infrastructure and excavation safety advisor for African civil projects (e.g. Kigali, Nairobi, Lagos, Accra, Cape Town).
Your goal is to help engineers prevent utility strikes, cable cuts, gas leaks, and water main flooding.
Be concise, technical, precise, and practical. Reference ground penetrating radar (GPR), hydro-excavation, safety clearance zones, and official municipal procedures.

Current Project Context:
${payload.projectContext || 'General Excavation Safety Context'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: payload.messages as any,
      config: {
        systemInstruction,
        temperature: 0.4,
      }
    });

    return {
      status: 'success',
      reply: response.text || 'No response generated.'
    };
  } catch (error: any) {
    console.error('Gemini copilot chat error:', error);
    return {
      status: 'error',
      error: error.message || 'Copilot service unavailable'
    };
  }
}


