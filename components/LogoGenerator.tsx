import React, { useState } from 'react';
import { generateLogo } from '../services/geminiService';
import { ImageSize, LogoGenerationResult } from '../types';
import { Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface LogoGeneratorProps {
  onLogoGenerated: (result: LogoGenerationResult) => void;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ onLogoGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateLogo(prompt, size);
      onLogoGenerated(result);
    } catch (err: any) {
      // If error suggests key not found, we might want to let the user know to re-select, but for now just show error.
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("API Key issue detected. Please reload to select a key again.");
      } else {
        setError(err.message || "Failed to generate logo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <ImageIcon className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">1. Design Logo</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Logo Description</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic robot head with glowing blue eyes, minimalist vector style, dark background..."
            className="w-full h-32 bg-gray-950 border border-gray-750 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Image Size</label>
          <div className="grid grid-cols-3 gap-3">
            {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  size === s
                    ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                    : 'bg-gray-950 border-gray-750 text-gray-400 hover:border-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1"></div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Generate Logo
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LogoGenerator;