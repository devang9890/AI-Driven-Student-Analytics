const Topbar = () => {
  return (
    <div className="w-full glass-panel border-b border-white/40 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">RiskSense Admin Console</h1>
        <p className="text-xs text-gray-500">Education Analytics • Secure Portal</p>
      </div>

      <button
        className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
        onClick={() => {
          localStorage.removeItem("admin");
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
