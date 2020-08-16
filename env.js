const envaild = require('envalid');
const {cleanEnv, num, str, port, host, bool} = envaild;

const env = cleanEnv(process.env, {
    PORT: port(),
    DB_URI: str(),
    UPUSH_SEND_URL: str(),
    UPUSH_APPKEY: str(),
    UPUSH_MASTER_SECRET: str()
});

module.exports = env;
