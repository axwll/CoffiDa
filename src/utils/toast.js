import { ToastAndroid } from 'react-native';

const toast = (message, length = ToastAndroid.SHORT) => {
  ToastAndroid.show(message, length);
};

export default toast;
