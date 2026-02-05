const Topbar = () => {
  return (
    <div className="w-full bg-white shadow p-4 flex justify-between sticky top-0">
      <h1 className="text-xl font-semibold">AI Student Risk Admin</h1>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
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
