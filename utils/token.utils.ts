import * as SecureStore from "expo-secure-store";
import {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_SESSION_KEY,
} from "../constants/storage";
import { AuthSession } from "../types";

export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function deleteAccessToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveUserSession(session: AuthSession) {
  await SecureStore.setItemAsync(USER_SESSION_KEY, JSON.stringify(session));
}

export async function getUserSession(): Promise<AuthSession | null> {
  const json = await SecureStore.getItemAsync(USER_SESSION_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function deleteUserSession() {
  await SecureStore.deleteItemAsync(USER_SESSION_KEY);
}
