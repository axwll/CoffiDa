import { Component } from 'react';

import ILLEGAL_WORDS from '../assets/data/profanity-filter.json';
import { translate } from '../locales';
import ValidatorResponse from '../models/validation-response';
import { toast } from './toast';

class FormValidator extends Component {
  validateEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (email.length === 0) {
      return new ValidatorResponse(false, translate('email_required_error'));
    }

    if (!regex.test(email)) {
      return new ValidatorResponse(false, translate('email_invalid_error'));
    }

    return new ValidatorResponse(true);
  };

  validatePassword = (password) => {
    const containsLetters = /[a-zA-Z]/g.test(password);
    const containNumbers = /\d/.test(password);

    if (password.length === 0) {
      return new ValidatorResponse(false, translate('password_required_error'));
    }

    if (password.length < 7) {
      return new ValidatorResponse(
        false,
        translate('password_too_short_error'),
      );
    }

    if (!containsLetters || !containNumbers) {
      return new ValidatorResponse(
        false,
        translate('password_non_alphanumeric_error'),
      );
    }

    return new ValidatorResponse(true);
  };

  validateName = (key, value) => {
    const lettersCheck = /[a-zA-Z]/g.test(value);

    let keyTranslation = '';
    if (key === 'First Name') {
      keyTranslation = translate('first_name_for_sentance');
    } else {
      keyTranslation = translate('last_name_for_sentance');
    }

    if (value.length === 0) {
      return new ValidatorResponse(
        false,
        keyTranslation + translate('name_required_error'),
      );
    }

    if (value.length > 50) {
      return new ValidatorResponse(
        false,
        keyTranslation + translate('name_too_long_error'),
      );
    }

    if (!lettersCheck) {
      return new ValidatorResponse(
        false,
        keyTranslation + translate('name_numeric_error'),
      );
    }

    return new ValidatorResponse(true);
  };

  validatePasswordMatch = (password, conformation) => {
    if (password !== conformation) {
      return new ValidatorResponse(false, translate('password_confirm_error'));
    }

    return new ValidatorResponse(true);
  };

  profanityFilter = (sampleText) => {
    let formatted = sampleText;
    ILLEGAL_WORDS.forEach((word) => {
      // Makes a capitalised string of each illegal word
      const capitalised = word.charAt(0).toUpperCase() + word.slice(1);

      const toCheck = [word, capitalised];

      toCheck.forEach((check) => {
        if (sampleText.includes(check)) {
          formatted = sampleText.replace(check, translate('profanity_replace'));
          toast(translate('profanity_error_toast'));
        }
      });
    });

    return formatted;
  };
}

const Validator = new FormValidator();
export default Validator;
