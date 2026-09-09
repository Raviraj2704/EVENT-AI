import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SignupPage = () => {
  const { register, googleLogin, linkedinLogin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (value.length < 8) setPasswordStrength('weak');
      else if (value.length < 12) setPasswordStrength('medium');
      else setPasswordStrength('strong');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms');
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const mockToken = 'mock_google_token_' + Date.now();
      await googleLogin(mockToken);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Google signup failed');
    }
  };

  const handleLinkedInSignup = async () => {
    try {
      const mockToken = 'mock_linkedin_token_' + Date.now();
      await linkedinLogin(mockToken);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('LinkedIn signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🎯 EventAI</h1>
          <p className="text-gray-600 dark:text-gray-400">Join the event</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">🔵</span> Sign up with Google
            </button>
            <button onClick={handleLinkedInSignup} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">🔗</span> Sign up with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Password</label>
                {passwordStrength && (
                  <span className={`text-xs font-semibold ${passwordStrength === 'weak' ? 'text-red-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {passwordStrength === 'weak' ? '⚠️ Weak' : passwordStrength === 'medium' ? '⚡ Medium' : '✅ Strong'}
                  </span>
                )}
              </div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 8 characters, include uppercase and numbers</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="flex items-start">
              <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer mt-1" />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">I agree to the Terms of Service and Privacy Policy</label>
            </div>

            <button type="submit" disabled={loading || !agreeTerms} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors">
              {loading ? '⏳ Creating account...' : '✨ Create account'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
            Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;