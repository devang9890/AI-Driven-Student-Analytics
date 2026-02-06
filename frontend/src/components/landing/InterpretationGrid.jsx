const InterpretationGrid = () => {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Interpretation Guide</h2>
        <p className="text-gray-600 mt-2">
          Confidence explains clarity. Risk label explains the student’s academic position.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            title: "High confidence + LOW risk",
            text: "Student is doing great — minimal intervention needed.",
            tone: "bg-emerald-100 text-emerald-700",
          },
          {
            title: "High confidence + HIGH risk",
            text: "Student needs urgent academic support.",
            tone: "bg-red-100 text-red-700",
          },
          {
            title: "Low confidence + MEDIUM risk",
            text: "Borderline case — teacher review recommended.",
            tone: "bg-amber-100 text-amber-700",
          },
          {
            title: "Low confidence + LOW risk",
            text: "Stable but inconsistent — monitor lightly.",
            tone: "bg-blue-100 text-blue-700",
          },
          {
            title: "Low confidence + HIGH risk",
            text: "Performance unclear — gather more data.",
            tone: "bg-purple-100 text-purple-700",
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-2xl p-6 text-gray-700">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${item.tone}`}>
              {item.title}
            </span>
            <p className="text-sm text-gray-600 mt-4">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="glass-elevated rounded-2xl p-6 md:p-8 text-gray-800">
        <h3 className="text-xl font-semibold text-gray-900">Doctor Analogy (Simple & Visual)</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {[
            {
              title: "Healthy + 95%",
              text: "Clearly healthy — all indicators are strong.",
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              title: "Sick + 95%",
              text: "Clearly sick — all indicators are weak.",
              color: "bg-red-100 text-red-700",
            },
            {
              title: "Unknown + 50%",
              text: "Mixed tests — needs more data.",
              color: "bg-amber-100 text-amber-700",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white/80 rounded-2xl p-5 shadow">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                {item.title}
              </span>
              <p className="text-sm text-gray-600 mt-3">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          AI confidence shows how clear the diagnosis is, not whether the student is good or bad.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Platform Capabilities</h3>
          <p className="text-gray-600 mt-2">
            Everything you need to monitor, predict, and act.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Upload full Excel sheet",
            "Manual student entry",
            "AI risk prediction per student",
            "Alerts for high-risk cases",
            "Admin analytics dashboard",
            "Performance monitoring",
          ].map((capability) => (
            <div key={capability} className="glass-card rounded-2xl p-5 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M9 12l2 2 4-4 1.5 1.5L11 17l-3.5-3.5L9 12z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{capability}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InterpretationGrid;
