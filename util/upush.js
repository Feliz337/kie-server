const env = require('../env');

const md5 = require('md5');

const generateSign = (postBody) => {
    const method = 'POST';
    const url = env.UPUSH_SEND_URL
    const appMasterSecret = env.UPUSH_MASTER_SECRET
    const payload = method + url + postBody + appMasterSecret;
    return md5(payload);
};

const generateBody = (content) => {
    const title = 'kie收到消息: '+content
    const payload = {
        "display_type": "notification",
        body: {
            "title": title,
            "ticker": title,
            "text": content,
            "after_open": "go_activity",
            "activity": "cc.foxa.kie.NotifyClickActivity",
            "play_vibrate": "false",
            "play_lights": "false",
            "play_sound": "true"
        }
    }
    const body = {
        appkey: env.UPUSH_APPKEY,
        timestamp: Date.now(),
        type: 'broadcast',
        mipush: true,
        mi_activity: "cc.foxa.kie.NotifyClickActivity",
        description: "kie消息: " + content,
        payload: payload,
    };

    return JSON.stringify(body);
}

module.exports = {generateSign, generateBody}
