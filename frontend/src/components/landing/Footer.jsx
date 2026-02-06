const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 pt-10 pb-12 text-gray-600">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">RiskSense – AI-Powered Education Analytics</h4>
          <p className="text-sm text-gray-600 mt-2">
            Helping institutions detect struggling students early using AI.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-gray-600">Project by: <span className="text-gray-900 font-semibold">Devang Singh</span></p>
          <p className="text-gray-500">AI + MERN Education Analytics Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
