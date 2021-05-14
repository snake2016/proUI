/*
 * @Author: spp
 * @Date: 2021-02-26 13:43:53
 * @LastEditors: spp
 * @LastEditTime: 2021-04-30 11:44:14
 * @FilePath: \proUI\src\utils\resetMessage.js
 */

import { Message } from 'element-ui';
let messageInstance = null;
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetMessage(options);
  };
});

export const message = resetMessage;
