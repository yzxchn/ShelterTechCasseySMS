let tokens;
if (process.env.NODE_ENV == 'local'){
    tokens = require('./config.js');
} else if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'prod') {
    tokens = {
        FB_PAGE_TOKEN: process.env.FB_PAGE_TOKEN,
        FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
        API_AI_CLIENT_ACCESS_TOKEN: process.env.API_AI_CLIENT_ACCESS_TOKEN,
        FB_APP_SECRET: process.env.FB_APP_SECRET,
        SERVER_URL: process.env.SERVER_URL,
        ASKDARCEL_URL: process.env.ASKDARCEL_URL
    };
}

module.exports.tokens = tokens;

//module.exports = {
//    FB_PAGE_TOKEN: config.FB_PAGE_TOKEN,
//    FB_VERIFY_TOKEN: config.FB_VERIFY_TOKEN,
//    API_AI_CLIENT_ACCESS_TOKEN: config.API_AI_CLIENT_ACCESS_TOKEN,
//    FB_APP_SECRET: config.FB_APP_SECRET,
//    SERVER_URL: config.SERVER_URL,
//    ASKDARCEL_URL: config.ASKDARCEL_URL
//}
