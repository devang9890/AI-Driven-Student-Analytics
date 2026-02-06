const ExampleCards = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Real Examples</h2>
        <p className="text-gray-600 mt-2">
          Simple cases that show how confidence explains clarity, not performance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 text-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">⭐ Star Student</h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              LOW Risk
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Attendance</p>
              <p className="text-lg font-semibold text-gray-900">92</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Marks</p>
              <p className="text-lg font-semibold text-gray-900">85</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Behaviour</p>
              <p className="text-lg font-semibold text-gray-900">75</p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Confidence</p>
              <p className="text-lg font-semibold">96%</p>
            </div>
            <p className="text-sm text-emerald-50 mt-2">Clearly performing well.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 text-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">⚠️ Borderline Student</h3>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              MEDIUM Risk
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Attendance</p>
              <p className="text-lg font-semibold text-gray-900">69</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Marks</p>
              <p className="text-lg font-semibold text-gray-900">64</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center shadow">
              <p className="text-xs text-gray-500">Behaviour</p>
              <p className="text-lg font-semibold text-gray-900">51</p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Confidence</p>
              <p className="text-lg font-semibold">58%</p>
            </div>
            <p className="text-sm text-amber-50 mt-2">Mixed signals → human review needed.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleCards;
