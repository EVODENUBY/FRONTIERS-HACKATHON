import React, { useState } from 'react';
import { CloudRain, Sun, AlertTriangle, Droplets, RefreshCw, Sparkles, ExternalLink, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export interface WeatherData {
  city: string;
  country: string;
  temperatureC: number;
  condition: string;
  rainProbabilityPercent: number;
  isRainExpected: boolean;
  precipitationMm?: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  excavationImpact: string;
}

interface WeatherRiskBannerProps {
  weather: WeatherData | null;
  isLoading: boolean;
  onRefreshWeather: () => void;
  groundingSources?: Array<{ title?: string; uri?: string }>;
}

export const WeatherRiskBanner: React.FC<WeatherRiskBannerProps> = ({
  weather,
  isLoading,
  onRefreshWeather,
  groundingSources = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!weather && !isLoading) return null;

  const isRain = weather?.isRainExpected || (weather?.rainProbabilityPercent ?? 0) >= 40;

  return (
    <div
      className={`w-full transition-all duration-300 border-b backdrop-blur-md bg-black text-white ${
        isRain ? 'border-white/30' : 'border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1.5">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Pure Icon with no background */}
            <div className="shrink-0">
              {isRain ? (
                <CloudRain className="w-5 h-5 text-white animate-bounce" />
              ) : (
                <Sun className="w-5 h-5 text-zinc-300" />
              )}
            </div>

            {/* City & Weather Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs tracking-wide uppercase text-white flex items-center gap-1.5 font-mono">
                  <span>{weather?.city || 'Local Site'}, {weather?.country || 'Region'} Site Ground Weather</span>
                </span>

                {/* Grounding Badge */}
                <span className="inline-flex items-center gap-1 bg-zinc-900 text-white border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
                  <span>Google Search Grounded</span>
                </span>

                {/* Rain Risk Tag (Monochrome High Contrast) */}
                {isRain ? (
                  <span className="bg-white text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse font-mono">
                    <AlertTriangle className="w-3 h-3 text-black" />
                    <span>RAINFALL EXCAVATION HAZARD ({weather?.rainProbabilityPercent}% PROBABILITY)</span>
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-200 border border-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">
                    FAVORABLE MOISTURE ({weather?.rainProbabilityPercent}% RAIN CHANCE)
                  </span>
                )}
              </div>

              {/* Sub-line Metrics */}
              <div className="text-[11px] font-mono text-zinc-300 flex items-center gap-3 mt-0.5 flex-wrap">
                <span>Temp: <strong className="text-white">{weather?.temperatureC}°C</strong></span>
                <span>Condition: <strong className="text-white">{weather?.condition}</strong></span>
                {weather?.precipitationMm !== undefined && (
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-white" />
                    Precip: <strong className="text-white">{weather.precipitationMm} mm</strong>
                  </span>
                )}
                {weather?.humidityPercent !== undefined && (
                  <span>Humidity: <strong>{weather.humidityPercent}%</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={onRefreshWeather}
              disabled={isLoading}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 font-mono"
              title="Re-run Google Search Grounding for current weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Weather</span>
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title={isCollapsed ? "Expand weather detail" : "Collapse weather detail"}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Detailed Excavation Impact Note */}
        {!isCollapsed && weather?.excavationImpact && (
          <div className="mt-0.5 pt-1.5 border-t border-white/10 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2 text-zinc-200">
              <ShieldAlert className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] text-zinc-200 font-sans">
                <strong>Soil Stability & Excavation Advisory:</strong> {weather.excavationImpact}
              </p>
            </div>

            {/* Citations */}
            {groundingSources.length > 0 && (
              <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-zinc-400 font-mono">
                <span>Source:</span>
                {groundingSources.slice(0, 2).map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white underline flex items-center gap-0.5"
                  >
                    <span>{src.title || 'Grounding Feed'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
