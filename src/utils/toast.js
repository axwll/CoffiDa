import { ToastAndroid } from 'react-native';

/**
 * Shows messages to the user
 *
 * @var {string}  message  The message to show to the user
 */
const toast = (message, length = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, length);
};

export default toast;
