import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Gets an Item from async storage
 *
 * @param   {string}  key  The key of the item in storage
 *
 * @return  {string|null}  The key value if exeists, else null
 */
export const getItem = async(key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(`Unable to find key: ${key} in Async storage`);
    return null;
  }
};

/**
 * Sets an item in async storage
 *
 * @param   {string}  key    The key to store with
 * @param   {string}  value  The Value to store
 *
 * @return  {string|null}  The key value if exeists, else null
 */
export const setItem = async(key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Unable to store key: ${key} in Async storage`);
    return null;
  }
};

/**
 * Clears all values from async storage
 */
export const clear = async() => await AsyncStorage.clear();
