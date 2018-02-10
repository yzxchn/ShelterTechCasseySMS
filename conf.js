let config;
// if the environment variable is dev on our computer, use info from config.js
if (process.env.NODE_ENV == 'dev'){
    config = require('./config.js');
} // prod is the production env on heroku
else if (process.env.NODE_ENV == 'prod') {
    config = {
        FB_PAGE_TOKEN: process.env.FB_PAGE_TOKEN,
        FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
        API_AI_CLIENT_ACCESS_TOKEN: process.env.API_AI_CLIENT_ACCESS_TOKEN,
        FB_APP_SECRET: process.env.FB_APP_SECRET,
        SERVER_URL: process.env.SERVER_URL,
        ASKDARCEL_URL: process.env.ASKDARCEL_URL,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
    };
}

module.exports = {
    FB_PAGE_TOKEN: config.FB_PAGE_TOKEN,
    FB_VERIFY_TOKEN: config.FB_VERIFY_TOKEN,
    API_AI_CLIENT_ACCESS_TOKEN: config.API_AI_CLIENT_ACCESS_TOKEN,
    FB_APP_SECRET: config.FB_APP_SECRET,
    SERVER_URL: config.SERVER_URL,
    ASKDARCEL_URL: config.ASKDARCEL_URL
}