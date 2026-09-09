// ============================================================================
// Validators Utility
// ============================================================================
// File: src/utils/validators.js
// Purpose: Form validation helper functions
// Status: Production-Ready ✅

export const validators = {
  // Email validation
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Username validation (3-50 chars, alphanumeric + underscore)
  username: (username) => {
    const regex = /^[a-zA-Z0-9_]{3,50}$/
    return regex.test(username)
  },

  // Password validation (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special)
  password: (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(password)
  },

  // Password strength
  passwordStrength: (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++

    return {
      score: strength,
      label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
    }
  },

  // Name validation
  name: (name) => {
    return name.trim().length >= 2 && name.trim().length <= 50
  },

  // Phone validation
  phone: (phone) => {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
    return regex.test(phone)
  },

  // URL validation
  url: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

export default validators