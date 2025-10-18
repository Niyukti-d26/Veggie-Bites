
import React from 'react';

interface LandingViewProps {
  onExplore: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onExplore }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center -mt-24">
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-in-down { animation: fadeInDown 1s ease-out forwards; }
        .fade-in-up { animation: fadeInUp 1s ease-out 0.5s forwards; opacity: 0; }
      `}</style>
      <div className="bg-white/30 backdrop-blur-lg p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/20">
        <h1 className="text-5xl sm:text-7xl font-bold text-emerald-600 tracking-wider mb-2 fade-in-down">
          Veggie Bites
        </h1>
        <p className="text-gray-600 sm:text-lg mb-8 fade-in-down" style={{animationDelay: '0.2s'}}>
          Your AI-Powered Vegetarian Cookbook
        </p>
        <button
          onClick={onExplore}
          className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-lg fade-in-up"
        >
          Explore Cuisines
        </button>
      </div>
    </div>
  );
};

export default LandingView;
