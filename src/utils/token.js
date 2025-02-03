/**
 * name: token.js
 * description: token 사용을 위한 sessionStorage Util
 */

import { localDataManager, sessionDataManager, ID_TOKEN_KEY, ID_REFESH_TOKEN_KEY } from '@utils/dataManager'

export function getToken() {
  return sessionDataManager.get(ID_TOKEN_KEY)
}

export async function saveToken(token) {
  await sessionDataManager.set(ID_TOKEN_KEY, token)
}

export async function destroyToken() {
  await sessionDataManager.remove(ID_TOKEN_KEY)
  await sessionDataManager.remove(ID_REFESH_TOKEN_KEY)
}

export function getRefreshToken() {
  return sessionDataManager.get(ID_REFESH_TOKEN_KEY)
}

export async function saveRefreshToken(token) {
  await sessionDataManager.set(ID_REFESH_TOKEN_KEY, token)
}

export function getLocalToken() {
  return localDataManager.get(ID_TOKEN_KEY)
}

export async function saveLocalToken(token) {
  await localDataManager.set(ID_TOKEN_KEY, token)
}

export async function destroyLocalToken() {
  await localDataManager.remove(ID_TOKEN_KEY)
  await localDataManager.remove(ID_REFESH_TOKEN_KEY)
}

export function getLocalRefreshToken() {
  return localDataManager.get(ID_REFESH_TOKEN_KEY)
}

export async function saveLocalRefreshToken(token) {
  await localDataManager.set(ID_REFESH_TOKEN_KEY, token)
}

export default { getToken, saveToken, destroyToken, getLocalToken, saveLocalToken, destroyLocalToken }
