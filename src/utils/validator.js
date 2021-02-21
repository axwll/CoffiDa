import ILLEGAL_WORDS from '../assets/data/profanity-filter.json';

interface Response {
  status: Boolean;
  message?: string;
}

class FormValidator extends Component<Response> {
  validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.length === 0) {
      return new Response(false, 'Email is required');
    } else if (!regex.test(email)) {
      return new Response(false, 'Email is an invalid format');
    } else {
      return new Response(true);
    }
  };

  validatePassword = (password) => {
    const containsLetters = /[a-zA-Z]/g.test(password);
    const containNumbers = /\d/.test(password);

    if (password.length === 0) {
      return new Response(false, 'Password is required');
    } else if (password.length < 7) {
      return new Response(false, 'Password must be seven or more characters');
    } else if (!containsLetters || !containNumbers) {
      return new Response(
        false,
        'Password must contain both letters and numbers',
      );
    } else {
      return new Response(true);
    }
  };

  validateName = (key, value) => {
    const lettersCheck = /[a-zA-Z]/g.test(value);

    if (value.length === 0) {
      return new Response(false, `${key} is required`);
    } else if (value.length > 50) {
      return new Response(
        false,
        `${key} must be no longer than fifty characters`,
      );
    } else if (!lettersCheck) {
      return new Response(false, `${key} must only contain letters`);
    } else {
      return new Response(true);
    }
  };

  validatePasswordMatch = (password, conformation) => {
    if (password !== conformation) {
      return new Response(false, 'Passwords do no match');
    } else {
      return new Response(true);
    }
  };

  profanityFilter = (sampleText) => {
    ILLEGAL_WORDS.forEach((word) => {
      // Makes a capitalised string of each illegal word
      const capitalised = word.charAt(0).toUpperCase() + word.slice(1);

      const toCheck = [word, capitalised];

      toCheck.forEach((check) => {
        if (sampleText.includes(check)) {
          sampleText = sampleText.replace(check, 'non related coffee item');
          toast(
            'Please try to keep your reviews clean. I have had to remove all profanity from your review.',
          );
        }
      });
    });

    return sampleText;
  };
}

const Validator = new FormValidator();
export default Validator;
