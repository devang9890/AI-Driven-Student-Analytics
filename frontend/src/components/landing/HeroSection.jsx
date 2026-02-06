import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm font-semibold tracking-wide shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          AI-Powered Education Analytics
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          RiskSense – AI-Powered Education Analytics
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          Predict. Detect. Support students before they fall behind.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          An AI-driven platform that analyzes attendance, marks, and behaviour to identify
          students at academic risk and provide actionable insights.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            Login to Dashboard
          </Link>
          <div className="flex items-center gap-3 text-gray-600 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Confidence-aware AI
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Real-time insights
            </span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">AI Analytics Snapshot</p>
            <h3 className="text-xl font-semibold text-gray-900">Student Risk Overview</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            Live
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Attendance", value: "82%" },
            { label: "Avg Marks", value: "76.4" },
            { label: "Behaviour", value: "68" },
          ].map((item) => (
            <div key={item.label} className="bg-white/80 rounded-2xl p-4 text-center shadow">
              <p className="text-xs text-gray-500 mb-2">{item.label}</p>
              <p className="text-lg font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
          <p className="text-sm">AI Confidence</p>
          <div className="flex items-center justify-between mt-3">
            <h4 className="text-3xl font-bold">92%</h4>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Low Risk</span>
          </div>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-white rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
