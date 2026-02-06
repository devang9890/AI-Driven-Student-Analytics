const FEATURES = [
  {
    title: "Student Risk Prediction",
    description: "AI predicts academic risk using attendance, marks, and behaviour data.",
  },
  {
    title: "Excel Upload Analysis",
    description: "Bulk upload student sheets and get instant predictions with insights.",
  },
  {
    title: "Manual Student Evaluation",
    description: "Enter subject marks manually and watch AI compute risk in real time.",
  },
  {
    title: "Admin Analytics Dashboard",
    description: "Interactive dashboards with performance trends and confidence insights.",
  },
  {
    title: "Early Warning Alerts",
    description: "Automated alerts highlight students who need immediate attention.",
  },
  {
    title: "Confidence-Based AI Insights",
    description: "Confidence explains certainty, not performance, for transparent decisions.",
  },
];

const FeatureCards = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">What RiskSense Does</h2>
        <p className="text-gray-600 mt-2">
          A complete AI platform that turns student data into actionable guidance for educators.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="glass-card rounded-2xl p-6 text-gray-700 hover:shadow-2xl transition"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M3 3h18v18H3V3zm4 4v2h10V7H7zm0 4v2h10v-2H7zm0 4v2h6v-2H7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
