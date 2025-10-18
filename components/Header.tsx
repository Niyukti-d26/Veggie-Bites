
import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  username?: string;
  onLogout: () => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogout, onAuthClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-wider">
          Veggie Bites
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isLoggedIn && username ? (
            <>
              <span className="text-sm sm:text-base text-gray-700 hidden sm:block">Welcome, {username}!</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full text-sm sm:text-base transition-colors duration-300 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-full text-sm sm:text-base transition-colors duration-300 hover:bg-emerald-600"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
