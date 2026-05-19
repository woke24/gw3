import CryptoJS from 'crypto-js';

const SECRET_KEY = 'katvr-gateway-secret';

/**
 * 加密字符串
 * @param {string} text 要加密的明文
 */
export function encrypt (text) {
  if (!text) return null;
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * 解密字符串
 * @param {string} ciphertext 要解密的密文
 */
export function decrypt (ciphertext) {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}