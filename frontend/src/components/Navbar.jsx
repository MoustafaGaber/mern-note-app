import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(urlSearch);

  // الـ URL → الـ input
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // الـ input → الـ URL (بعد توقف الكتابة 500ms)
  useEffect(() => {
    if (!user) return;
    const term = search.trim();
    if (term === urlSearch) return;

    const delay = setTimeout(() => {
      navigate(term ? `/?search=${encodeURIComponent(term)}` : "/", {
        replace: true,
      });
    }, 500);
    return () => clearTimeout(delay);
  }, [search, urlSearch, user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 p-4 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">Notes App</Link>
        {user && (
          <>
            <div className="flex-1 mx-6 max-w-md">
              <input
                type="text"
                aria-label="Search notes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;