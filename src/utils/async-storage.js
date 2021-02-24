import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async(key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(`Unable to find key: ${key} in Async storage`);
    return null;
  }
};

export const setItem = async(key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Unable to store key: ${key} in Async storage`);
    return null;
  }
};

export const clear = async() => await AsyncStorage.clear();
