
import React, { useState } from 'react';
import Card from './common/Card';

interface AuthViewProps {
  onLogin: (username: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSigningUp) {
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
      if (username.trim() && password.trim()) {
        // In a real app, you'd save this to a backend.
        // For this demo, we'll just log them in.
        onLogin(username);
      } else {
        setError('Please fill all fields.');
      }
    } else {
      // Demo login: just requires a username
      if (username.trim()) {
        onLogin(username);
      } else {
        setError('Please enter a username.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card isHoverable={false} className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          {isSigningUp ? 'Create Account' : 'Sign In'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {isSigningUp && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          )}
          <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-full hover:bg-emerald-600 transition-colors duration-300">
            {isSigningUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6">
          {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => setIsSigningUp(!isSigningUp)} className="text-emerald-600 font-semibold hover:underline">
            {isSigningUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthView;
