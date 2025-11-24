import React, { useState } from 'react';
import ApiKeySelector from './components/ApiKeySelector';
import LogoGenerator from './components/LogoGenerator';
import VideoAnimator from './components/VideoAnimator';
import { LogoGenerationResult } from './types';
import { Layers, Github } from 'lucide-react';

const App: React.FC = () => {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<LogoGenerationResult | null>(null);

  if (!apiKeySet) {
    return <ApiKeySelector onKeySelected={() => setApiKeySet(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-primary-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-primary-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              LogoMotion AI
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden sm:block">
            Gemini 3 Pro + Veo 3.1
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-8rem)]">
          {/* Left Column: Image Generation */}
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full lg:h-auto overflow-hidden">
            <LogoGenerator 
              onLogoGenerated={(result) => setGeneratedLogo(result)} 
            />
          </section>

          {/* Right Column: Video Animation */}
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full lg:h-auto overflow-hidden">
            <VideoAnimator 
              logo={generatedLogo} 
              onReset={() => setGeneratedLogo(null)}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;