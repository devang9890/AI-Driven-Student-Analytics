import { Link } from "react-router-dom";
import HeroSection from "../components/landing/HeroSection";
import FeatureCards from "../components/landing/FeatureCards";
import AILogicSection from "../components/landing/AILogicSection";
import ExampleCards from "../components/landing/ExampleCards";
import InterpretationGrid from "../components/landing/InterpretationGrid";
import Footer from "../components/landing/Footer";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-blue-200 to-indigo-300" />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_60%_80%,rgba(14,165,233,0.12),transparent_40%)]" />

        <div className="relative z-10">
          <header className="glass-panel border-b border-white/40 px-6 py-4 flex justify-between items-center sticky top-0">
            <div>
              <h1 className="text-lg font-bold text-gray-900">RiskSense</h1>
              <p className="text-xs text-gray-500">AI-Powered Education Analytics</p>
            </div>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition"
            >
              Login
            </Link>
          </header>

          <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
            <HeroSection />
            <FeatureCards />
            <AILogicSection />
            <ExampleCards />
            <InterpretationGrid />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
