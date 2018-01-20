'use strict';

const config = require('./conf.js');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const uuid = require('uuid');
const fb_events = require('./fb_messenger/event_handling.js');
const fb_utils = require('./fb_messenger/messenger_utils.js');
const utils = require('./utils.js');
const util = require('util');
const askdarcel = require('./askdarcel.js');


// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
if (!config.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
}
if (!config.API_AI_CLIENT_ACCESS_TOKEN) {
    throw new Error('missing API_AI_CLIENT_ACCESS_TOKEN');
}
if (!config.FB_APP_SECRET) {
    throw new Error('missing FB_APP_SECRET');
}
if (!config.SERVER_URL) { //used for ink to static files
    throw new Error('missing SERVER_URL');
}

// categories is a promise obj
const categories = askdarcel.getCategoryMapping();

app.set('port', (process.env.PORT || 5000))

//verify request came from facebook
app.use(bodyParser.json({
    verify: fb_utils.verifyRequestSignature
}));

//serve static files in the public directory
app.use(express.static('public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// Process application/json
app.use(bodyParser.json())

const sessionIDs = new Map();

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    console.log("request");
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
        console.log("Successfully verified with Facebook.");
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
})

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook/', function (req, res) {
    var data = req.body;
    //console.log(JSON.stringify(data));
    //
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.optin) {
                    fb_events.receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    fb_events.receivedMessage(messagingEvent, sessionIDs);
                } else if (messagingEvent.delivery) {
                    fb_events.receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    fb_events.receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    fb_events.receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    fb_events.receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        // You must send back a 200, within 20 seconds
        res.sendStatus(200);
    }
});

// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})
