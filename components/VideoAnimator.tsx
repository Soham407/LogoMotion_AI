import React, { useState } from 'react';
import { animateLogo } from '../services/geminiService';
import { LogoGenerationResult, VideoAspectRatio } from '../types';
import { Video, Film, Loader2, Sparkles, Download } from 'lucide-react';

interface VideoAnimatorProps {
  logo: LogoGenerationResult | null;
  onReset: () => void;
}

const VideoAnimator: React.FC<VideoAnimatorProps> = ({ logo, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnimate = async () => {
    if (!logo) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await animateLogo(logo.base64, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("API Key issue detected. Please refresh.");
      } else {
        setError(err.message || "Failed to animate logo");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!logo) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-950/50 rounded-2xl border-2 border-dashed border-gray-800">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-700">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-500">Waiting for Logo</h3>
        <p className="text-sm text-gray-600 mt-2">Generate a logo in step 1 to unlock animation tools.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-500/20 rounded-lg">
          <Video className="w-6 h-6 text-pink-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">2. Animate with Veo</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {/* Preview Section */}
        <div className="relative group rounded-xl overflow-hidden bg-black border border-gray-800 aspect-square max-h-[300px] w-full mx-auto flex items-center justify-center">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <img 
                src={`data:${logo.mimeType};base64,${logo.base64}`} 
                alt="Logo Preview" 
                className="w-full h-full object-contain"
              />
              {loading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
                  <p className="text-white font-medium">Rendering Video...</p>
                  <p className="text-xs text-gray-400 mt-1">This may take a minute</p>
                </div>
              )}
            </>
          )}
        </div>

        {!videoUrl ? (
          <div className="space-y-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Animation Style (Optional)</label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Rotate slowly, glitch effect, neon pulse..."
                className="w-full bg-gray-950 border border-gray-750 rounded-xl p-3 text-white placeholder-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-3">
                {(['16:9', '9:16'] as VideoAspectRatio[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    disabled={loading}
                    className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                      aspectRatio === r
                        ? 'bg-pink-600/20 border-pink-500 text-pink-400'
                        : 'bg-gray-950 border-gray-750 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {r} {r === '16:9' ? '(Landscape)' : '(Portrait)'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAnimate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Generate Animation
              </button>

              <a
                href={`data:${logo.mimeType};base64,${logo.base64}`}
                download="generated-logo.png"
                className={`w-full py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Download className="w-4 h-4" />
                Download Logo Image
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <a
              href={videoUrl}
              download="logo-animation.mp4"
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Video
            </a>

            <a
              href={`data:${logo.mimeType};base64,${logo.base64}`}
              download="generated-logo.png"
              className="w-full py-3 bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2"
            >
               <Download className="w-4 h-4" />
               Download Original Logo
            </a>

            <button
              onClick={() => {
                setVideoUrl(null);
                setError(null);
              }}
              className="w-full py-3 bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all"
            >
              Make Another Version
            </button>
             <button
              onClick={onReset}
              className="w-full py-2 text-sm text-gray-500 hover:text-white underline"
            >
              Start Over with New Logo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnimator;