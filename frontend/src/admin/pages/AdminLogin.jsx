import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      // store minimal admin info
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Login failed. Check credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 relative overflow-hidden">
      {/* Academic background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 transform rotate-12">
          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5,5V19H19V5M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7,7V9H17V7M7,11V13H17V11M7,15V17H17V15Z" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform -rotate-12">
          <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,3L1,9L12,15L21,9V10C21,10.55 21.45,11 22,11C22.55,11 23,10.55 23,10V9L12,3M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
          </svg>
        </div>
      </div>

      {/* Floating academic elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Main login container */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200">
          {/* University Header */}
          <div className="text-center mb-8">
            {/* University Logo */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,3L1,9L12,15L21,9V10C21,10.55 21.45,11 22,11C22.55,11 23,10.55 23,10V9L12,3M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            {/* Company Name */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RiskSense</h1>
            <p className="text-blue-700 font-semibold text-sm tracking-wider uppercase mb-1">Education Analytics</p>
            <p className="text-gray-600 text-sm">AI-Powered Student Risk Assessment Portal</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Admin Login Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Administrator Access</h2>
            <p className="text-gray-500 text-sm text-center">Faculty & Administrative Portal</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none focus:bg-white transition-all duration-200"
                  placeholder="admin@risksense.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none focus:bg-white transition-all duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Access Portal
                </div>
              )}
            </button>
          </form>

          {/* University Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm font-medium">
                Predictive Analytics • Early Intervention • Student Success
              </p>
              <p className="text-gray-500 text-xs">
                Secured by Advanced AI Technology
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom university info */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm font-medium">
            RiskSense - Transforming Education Through AI
          </p>
          <p className="text-white/60 text-xs mt-1">
            Next-Generation Student Risk Assessment & Analytics Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
