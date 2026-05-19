// src/utils/sdkLoader.js
export const loadExternalSDK = (id, src, callbackName) => {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接返回
    if (document.getElementById(id)) {
      resolve(window[id.split('-')[0]]);
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;

    // 针对需要初始化回调的情况（如 Google 或 Facebook）
    if (callbackName) {
      window[callbackName] = () => resolve();
    }

    script.onload = () => !callbackName && resolve();
    script.onerror = () => reject(new Error(`SDK load error: ${src}`));

    document.head.appendChild(script);
  });
};