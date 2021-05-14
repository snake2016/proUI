/*
 * @Author: spp
 * @Date: 2021-04-30 11:45:09
 * @LastEditors: spp
 * @LastEditTime: 2021-04-30 11:46:21
 * @FilePath: \proUI\src\utils\resetNotify.js
 */
import { Notification } from 'element-ui';
let messageInstance = null;
const resetNotify = options => {
if (messageInstance) {
    messageInstance.close();
}
messageInstance = Notification(options);
}

['success', 'warning', 'info', 'error'].forEach(type => {
resetNotify[type] = options => {
    if (typeof options === 'string') {
    options = {
        message: options
    };
    }
    options.type = type;
    return resetNotify(options);
};
});

export const notify = resetNotify;
