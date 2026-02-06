const AILogicSection = () => {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">How Our AI Makes Decisions</h2>
        <p className="text-gray-600 mt-2">
          RiskSense turns attendance, marks, and behaviour into clear academic insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            step: "1️⃣ Data Input",
            detail: "Attendance + Marks + Behaviour",
          },
          {
            step: "2️⃣ Pattern Analysis",
            detail: "AI detects learning patterns and trends",
          },
          {
            step: "3️⃣ Risk Prediction",
            detail: "LOW / MEDIUM / HIGH academic risk",
          },
          {
            step: "4️⃣ Confidence Score",
            detail: "How sure the AI is (0–100%)",
          },
        ].map((card) => (
          <div
            key={card.step}
            className="glass-card rounded-2xl p-6 text-gray-700 hover:shadow-2xl transition"
          >
            <h3 className="text-lg font-semibold text-gray-900">{card.step}</h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass-elevated rounded-2xl p-6 md:p-8 text-gray-800">
        <h3 className="text-xl font-semibold text-gray-900">The Most Misunderstood Concept</h3>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold text-gray-900">Confidence ≠ Student Performance.</span> Confidence
          only measures how clear the AI’s decision is.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/80 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500">High confidence</p>
            <h4 className="text-lg font-semibold text-gray-900 mt-1">Clear student pattern</h4>
            <p className="text-sm text-gray-600 mt-2">
              The AI is confident because the data strongly matches past examples.
            </p>
          </div>
          <div className="bg-white/80 rounded-2xl p-5 shadow">
            <p className="text-sm text-gray-500">Low confidence</p>
            <h4 className="text-lg font-semibold text-gray-900 mt-1">Mixed signals</h4>
            <p className="text-sm text-gray-600 mt-2">
              The student is borderline, so the AI needs teacher judgment.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl p-5 text-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-700">Performance scale</p>
              <p className="text-sm text-gray-600 mt-1">POOR → AVERAGE → GOOD</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">High Confidence</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">Low Confidence</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">High Confidence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AILogicSection;
