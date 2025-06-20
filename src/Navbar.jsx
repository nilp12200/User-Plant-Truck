import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [dispatcherOpen, setDispatcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleRestrictedAccess = () => {
    alert("You are not the owner");
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "/"; // or navigate('/') if using useNavigate
  };

  const RestrictedLink = ({ to, children }) => {
    return userRole === "owner" ? (
      <Link to={to}>{children}</Link>
    ) : (
      <button onClick={handleRestrictedAccess} className="w-full text-left">
        {children}
      </button>
    );
  };

  const roleAccess = {
    owner: ['plantmaster', 'usermaster', 'truck', 'gate', 'loader', 'reports'],
    admin: ['plantmaster', 'usermaster', 'gate', 'reports'],
    dispatch: ['truck'],
    gatekeeper: ['gate'],
    report: ['reports'],
    loader: ['loader'],
    // Add more roles as needed
  };

  const canAccess = (route) => {
    if (!userRole) return false;
    // Split roles by comma and trim spaces
    const roles = userRole.split(',').map(r => r.trim());
    // Check if any role grants access
    return roles.some(role => roleAccess[role]?.includes(route));
  };

  const NavLink = ({ to, routeKey, children, ...props }) => {
    const handleClick = (e) => {
      if (!canAccess(routeKey)) {
        e.preventDefault();
        alert('You do not have rights to access this page.');
      }
    };
    return (
      <Link to={to} onClick={handleClick} {...props} style={{ cursor: canAccess(routeKey) ? 'pointer' : 'not-allowed', opacity: canAccess(routeKey) ? 1 : 0.6 }}>
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Lemon Software Gate Pass
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none text-2xl transition-all duration-300 hover:scale-110"
            >
              ☰
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center font-medium text-white">
            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setAdminOpen((prev) => {
                    if (!prev) setDispatcherOpen(false);
                    return !prev;
                  });
                }}
                className="hover:text-yellow-400 flex items-center"
              >
                Admin Master <span className="ml-1 text-sm">▼</span>
              </button>
              {adminOpen && (
                <div className="absolute mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl z-50 py-2 border border-gray-700">
                  <NavLink to="/plantmaster" routeKey="plantmaster">
                    <span className="block px-6 py-3 text-white hover:bg-yellow-400 hover:text-gray-900">
                      🏭 Plant Master
                    </span>
                  </NavLink>

                  <NavLink to="/usermaster" routeKey="usermaster">
                    <span className="block px-6 py-3 text-white hover:bg-yellow-400 hover:text-gray-900">
                      👤 User Master
                    </span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Dispatcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDispatcherOpen((prev) => {
                    if (!prev) setAdminOpen(false);
                    return !prev;
                  });
                }}
                className="hover:text-yellow-400 flex items-center"
              >
                Dispatcher <span className="ml-1 text-sm">▼</span>
              </button>
              {dispatcherOpen && (
                <div className="absolute mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl z-50 py-2 border border-gray-700">
                  <NavLink to="/truck" routeKey="truck">
                    <span className="block px-6 py-3 text-white hover:bg-yellow-400 hover:text-gray-900">
                      🚛 Truck Transaction
                    </span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Public or Semi-Public Routes */}
            <NavLink to="/gate" routeKey="gate">
              <span className="hover:text-yellow-400 transition-all flex items-center">
                🚪 Gate Keeper
              </span>
            </NavLink>

            <NavLink to="/loader" routeKey="loader">
              <span className="hover:text-yellow-400 flex items-center">
                📦 Loader
              </span>
            </NavLink>

            <NavLink to="/reports" routeKey="reports">
              <span className="hover:text-yellow-400 transition-all flex items-center">
                📊 Reports
              </span>
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition text-white text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 bg-gray-800 p-6 rounded-xl shadow-2xl text-white font-medium z-50 border border-gray-700">
            {/* Admin mobile */}
            <div>
              <button
                onClick={() => {
                  setAdminOpen((prev) => {
                    if (!prev) setDispatcherOpen(false);
                    return !prev;
                  });
                }}
                className="w-full text-left hover:text-yellow-400"
              >
                👨‍💼 Admin ▼
              </button>
              {adminOpen && (
                <div className="pl-6 space-y-2 mt-2">
                  <NavLink to="/plantmaster" routeKey="plantmaster">
                    <span className="block hover:text-yellow-400">🏭 Plant Master</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Dispatcher mobile */}
            <div>
              <button
                onClick={() => {
                  setDispatcherOpen((prev) => {
                    if (!prev) setAdminOpen(false);
                    return !prev;
                  });
                }}
                className="w-full text-left hover:text-yellow-400"
              >
                🚛 Dispatcher ▼
              </button>
              {dispatcherOpen && (
                <div className="pl-6 space-y-2 mt-2">
                  <NavLink to="/truck" routeKey="truck">
                    <span className="block hover:text-yellow-400">📝 Truck Transaction</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/gate" routeKey="gate" className="block hover:text-yellow-400">
              🚪 Gate Keeper
            </NavLink>

            <NavLink to="/loader" routeKey="loader" className="block hover:text-yellow-400">
              📦 Loader
            </NavLink>

            <NavLink to="/reports" routeKey="reports" className="block hover:text-yellow-400">
              📊 Reports
            </NavLink>

            <button
              onClick={handleLogout}
              className="mt-4 block w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
