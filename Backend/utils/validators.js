export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password: 8–16 characters, must include at least one uppercase letter and one special character
export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[^\w\s]).{8,16}$/;
  return regex.test(password);
};

// Name: Min 20 characters, Max 60 characters
export const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length >= 5 && name.trim().length <= 60;
};

// Address: Max 400 characters
export const isValidAddress = (address) => {
  return typeof address === 'string' && address.trim().length <= 400;
};



export const isValidRating = (rating) => {
  const num = Number(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
};

export const areFieldsPresent = (obj, fields = []) => {
  return fields.every(field => obj[field] && obj[field].toString().trim().length > 0);
};

export const isValidRole = (role) => {
  const validRoles = ['admin', 'user', 'store_owner'];
  return validRoles.includes(role);
};
