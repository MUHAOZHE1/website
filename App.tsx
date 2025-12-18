
import React, { useState } from 'react';
import { Step, StressAnalysis, ActionPlan } from './types';
import { analyzeStress, generatePlan } from './services/geminiService';
import { 
  Heart, 
  Brain, 
  Wind, 
  Compass, 
  ChevronRight, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

import Intro from './components/Intro';
import FaceStep from './components/FaceStep';
import DeconstructStep from './components/DeconstructStep';
import ReleaseStep from './components/ReleaseStep';
import CopeStep from './components/CopeStep';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO);
  const [analysis, setAnalysis] = useState<StressAnalysis | null>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const stepsList = [
    { id: Step.FACE, icon: <Heart size={16} />, label: "Confront" },
    { id: Step.DECONSTRUCT, icon: <Brain size={16} />, label: "Analyze" },
    { id: Step.RELEASE, icon: <Wind size={16} />, label: "Release" },
    { id: Step.COPE, icon: <Compass size={16} />, label: "Resolve" },
  ];

  const handleFaceSubmit = async (text: string) => {
    setLoading(true);
    try {
      const res = await analyzeStress(text);
      setAnalysis(res);
      setCurrentStep(Step.DECONSTRUCT);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!analysis) return;
    setLoading(true);
    try {
      const res = await generatePlan(analysis);
      setPlan(res);
      setCurrentStep(Step.COPE);
    } catch (err) {
      console.error("Plan generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#060910]">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 顶部导航 */}
      {currentStep !== Step.INTRO && (
        <nav className="fixed top-0 w-full z-50 px-8 py-5 glass flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl text-white">MindEase <span className="text-purple-400">USM</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            {stepsList.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep === s.id ? 'text-white' : 'text-slate-600'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${currentStep === s.id ? 'bg-purple-500 border-purple-400 text-white' : 'border-slate-800'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
                </div>
                {idx < stepsList.length - 1 && <ChevronRight size={14} className="text-slate-800" />}
              </React.Fragment>
            ))}
          </div>

          <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
        </nav>
      )}

      {/* 主舞台 */}
      <main className={`flex-1 w-full max-w-7xl px-6 z-10 flex flex-col ${currentStep === Step.INTRO ? '' : 'pt-32'}`}>
        {currentStep === Step.INTRO && <Intro onStart={() => setCurrentStep(Step.FACE)} />}
        {currentStep === Step.FACE && <FaceStep onSubmit={handleFaceSubmit} loading={loading} />}
        {currentStep === Step.DECONSTRUCT && analysis && <DeconstructStep analysis={analysis} onNext={() => setCurrentStep(Step.RELEASE)} />}
        {currentStep === Step.RELEASE && <ReleaseStep onNext={handleGeneratePlan} loading={loading} />}
        {currentStep === Step.COPE && plan && <CopeStep plan={plan} onRestart={() => window.location.reload()} />}
      </main>

      <footer className="w-full py-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] border-t border-white/5 mt-20">
        © 2024 Universiti Sains Malaysia • Minden Wellness Initiative
      </footer>
    </div>
  );
};

export default App;
