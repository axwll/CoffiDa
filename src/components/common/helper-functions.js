import {ToastAndroid} from 'react-native';

export function profanityFilter(sampleText) {
  const ILLEGAL_WORDS = ['tea', 'cake', 'pastries', 'pastry'];
  let profanityFound = false;

  ILLEGAL_WORDS.forEach((word) => {
    // Makes a capitalised word of each illegal word
    const capitalised = word.charAt(0).toUpperCase() + word.slice(1);

    // Makes an array of both types of illegal word
    const toCheck = [word, capitalised];

    // const res = toCheck.some(function (check) {
    //   console.log(sampleText.includes(check));
    //   console.log(sampleText);
    //   if (sampleText.includes(check)) {
    //     return sampleText.replace(check, 'non related coffee item');
    //   } else {
    //     return sampleText;
    //   }
    // });

    // console.log('FONE');
    // console.log(sampleText);

    // // Checks the words against the sample
    // This doesnt replace the word becuase it needs to replace 'check' not 'word' if you get me
    if (toCheck.some((check) => sampleText.includes(check))) {
      profanityFound = true;
      //   sampleText = sampleText.replace(word, '*'.repeat(word.length));
      sampleText = sampleText.replace(word, 'non related coffee item');
    }
  });
  console.log('FONE');

  console.log(sampleText);

  return {
    cleanText: profanityFound,
    data: sampleText,
  };
}

export function toast(message, length = ToastAndroid.SHORT) {
  ToastAndroid.show(message, length);
}
