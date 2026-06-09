export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9\-\+]{10,}$/;
  return re.test(phone);
};

export const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }
  
  return errors;
};
