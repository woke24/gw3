
/**
 * JS 调用/获取 C++（通过 HostObject）
**/

export const callNative = () => {
  if (!window.chrome?.webview?.hostObjects) {
    console.warn('WebView2 could not be use');
    return null;
  } else {
    return window.chrome.webview.hostObjects;
  }
};

/**
 * JS 发送消息到 C++（通过 postMessage
**/

export const postMessageToNative = (message) => {
  if (!window.chrome?.webview?.postMessage) {
    console.warn('WebView2 postMessage 不可用');
    return null;
  } else {
    window.chrome.webview.postMessage(message);
  }
};

// /**
//  * 监听 C++ 发送给 JS 的消息
//  * @param {string} type - 消息类型（C++ 发送时需指定）
//  * @param {Function} callback - 消息回调（参数为 C++ 发送的数据）
//  * @returns {Function} - 取消监听的函数
//  */
// export const onNative = (type, callback) => {
//   if (!isWebView2) {
//     console.warn('WebView2 could not be use');
//     return () => {}; // 空函数，无实际操作
//   }

//   // 消息处理函数
//   const handleMessage = (event) => {
//     const { type: msgType, data } = event.data || {};
//     if (msgType === type) {
//       callback(data); // 触发回调
//     }
//   };

//   // 注册监听
//   window.chrome.webview.addEventListener('message', handleMessage);

//   // 返回取消监听的函数（供组件卸载时调用）
//   return () => {
//     window.chrome.webview.removeEventListener('message', handleMessage);
//   };
// };