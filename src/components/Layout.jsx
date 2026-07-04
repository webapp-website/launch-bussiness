import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Info, CreditCard, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Hide bottom nav on home page for full-screen hero experience
  const isHomePage = location.pathname === '/';

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/subscription', icon: CreditCard, label: 'Plans' },
    ...(user
      ? [
          { to: '/create', icon: PlusCircle, label: 'Create' },
          { to: '/dashboard', icon: User, label: 'Dashboard' },
        ]
      : []),
  ];

  return (
    <div className={`min-h-screen bg-white ${isHomePage ? '' : 'pb-20'}`}>
      <Outlet />

      {/* Bottom Navigation - Hidden on home page */}
      {!isHomePage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 shadow-lg">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-google-blue/10 text-google-blue'
                      : 'text-google-gray hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </NavLink>
            ))}
            {!user && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-google-green/10 text-google-green'
                      : 'text-google-gray hover:bg-gray-100'
                  }`
                }
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">Login</span>
              </NavLink>
            )}
            {user && (
              <button
                onClick={signOut}
                className="flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 text-google-red hover:bg-red-50"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">Logout</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
