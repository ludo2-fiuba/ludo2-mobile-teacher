import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SessionManager {
  static myInstance = null;

  _access = null;
  _refresh = null;

  static getInstance() {
    if (SessionManager.myInstance == null) {
      SessionManager.myInstance = new SessionManager();
    }
    return this.myInstance;
  }

  async saveCredentials(credentials) {
    try {
      this._access = credentials.access;
      this._refresh = credentials.refresh;
      await AsyncStorage.setItem('@access', credentials.access);
      await AsyncStorage.setItem('@refresh', credentials.refresh);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getCredentials() {
    try {
      this._access = await AsyncStorage.getItem('@access');
      this._refresh = await AsyncStorage.getItem('@refresh');
      return true;
    } catch (e) {
      return false;
    }
  }

  async clearCredentials() {
    this._access = null;
    this._refresh = null;
    await AsyncStorage.removeItem('@access');
    await AsyncStorage.removeItem('@refresh');
  }

  async invalidateSession() {
    this._access = null;
    await AsyncStorage.removeItem('@access');
  }

  isLoggedIn() {
    return this._access != null;
  }

  getAuthToken() {
    return this._access;
  }

  getRefreshToken() {
    return this._refresh;
  }
}
