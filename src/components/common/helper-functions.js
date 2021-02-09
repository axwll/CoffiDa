import {ToastAndroid} from 'react-native';

export const profanityFilter = (sampleText) => {
  const ILLEGAL_WORDS = ['tea', 'cake', 'pastries', 'pastry'];

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

export const toast = (message, length = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, length);
};
