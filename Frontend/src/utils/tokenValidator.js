export const validateToken = (token) => {
  if (!token || typeof token !== 'string') {
    return { isValid: false, error: 'Token is required' };
  }

  const trimmedToken = token.trim();
  
  if (trimmedToken.length < 3) {
    return { isValid: false, error: 'Token must be at least 3 characters long' };
  }

  if (trimmedToken.length > 20) {
    return { isValid: false, error: 'Token cannot exceed 20 characters' };
  }

  // Check for alphanumeric characters only
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(trimmedToken)) {
    return { isValid: false, error: 'Token can only contain letters and numbers' };
  }

  return { isValid: true, token: trimmedToken };
};

export const generateToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  
  for (let i = 0; i < 6; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
};

export const formatTokenDisplay = (token) => {
  if (!token) return '';
  return token.toString().toUpperCase();
};