export const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.length === 0) {
    return {
      status: false,
      error: 'Email is required',
    };
  } else if (!regex.test(email)) {
    return {
      status: false,
      error: 'Email is an invalid format',
    };
  } else {
    return {status: true};
  }
};

export const validatePassword = (password) => {
  const containsLetters = /[a-zA-Z]/g.test(password);
  const containNumbers = /\d/.test(password);

  if (password.length === 0) {
    return {
      status: false,
      error: 'Password is required',
    };
  } else if (password.length < 7) {
    return {
      status: false,
      error: 'Password must be seven or more characters',
    };
  } else if (!containsLetters || !containNumbers) {
    return {
      status: false,
      error: 'Password must contain both letters and numbers',
    };
  } else {
    return {status: true};
  }
};

export const validateName = (key, value) => {
  const lettersCheck = /[a-zA-Z]/g.test(value);

  if (value.length === 0) {
    return {
      status: false,
      error: `${key} is required`,
    };
  } else if (value.length > 50) {
    return {
      status: false,
      error: `${key} must be no longer than fifty characters`,
    };
  } else if (!lettersCheck) {
    return {
      status: false,
      error: `${key} must only contain letters`,
    };
  } else {
    return {status: true};
  }
};

export const validatePasswordMatch = (password, conformation) => {
  if (password !== conformation) {
    return {
      status: false,
      error: 'Passwords do no match',
    };
  } else {
    return {status: true};
  }
};
