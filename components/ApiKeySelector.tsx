import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [checking, setChecking] = useState(true);

  const checkKey = async () => {
    try {
      // Use type assertion to avoid conflicts with global AIStudio type definition
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (hasKey) {
          onKeySelected();
        }
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    // Use type assertion to avoid conflicts with global AIStudio type definition
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
      await aistudio.openSelectKey();
      // Assume success and proceed, as per instructions to avoid race conditions
      onKeySelected();
    } else {
      alert("AI Studio environment not detected.");
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Verifying API access...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-gray-850 p-8 rounded-2xl border border-gray-750 shadow-2xl max-w-md w-full">
        <div className="bg-primary-500/20 p-4 rounded-full w-fit mx-auto mb-6">
          <Key className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
        <p className="text-gray-400 mb-6">
          To generate professional logos and videos using Gemini 3 Pro and Veo, please select a paid API key from a Google Cloud Project with billing enabled.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2"
        >
          Select API Key
        </button>

        <p className="mt-4 text-xs text-gray-500">
          Need help? <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">View billing documentation</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeySelector;