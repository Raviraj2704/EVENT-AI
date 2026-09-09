import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    // Here you would typically check if the email exists in your backend
    console.log('Checking email:', email);
    // For now, route to the login page with the email pre-filled, or handle inline
    navigate('/auth/login', { state: { email } }); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      
      {/* Dark semi-transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-up Bottom Sheet */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md mx-auto rounded-t-3xl shadow-2xl p-6 md:p-8 animate-slide-up">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Enter your detail
          </h2>
          <p className="text-sm text-gray-500">
            You need to login to access this feature.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 text-lg text-center text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-colors text-lg mt-4"
          >
            Next
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 font-semibold underline decoration-2 underline-offset-4 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Continue as Guest
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 space-y-3">
          <p>
            Already a delegate? Use your registered email ID to continue.
          </p>
          <p>
            Want to join as a delegate? <a href="#" className="text-blue-600 hover:underline font-medium">Click here</a> and our team will help you get started.
          </p>
        </div>

      </div>
    </div>
  );
};