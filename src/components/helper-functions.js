import { ToastAndroid } from 'react-native';

export const toast = (message, length = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, length);
};
