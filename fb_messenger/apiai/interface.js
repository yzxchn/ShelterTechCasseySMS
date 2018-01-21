"use strict";
const actions = require('./actions.js');
const fb_messaging = require('../messaging.js');
const config = require('../../conf.js');
const apiai = require('apiai');
const utils = require('../../utils.js');

module.exports = {
    handleApiAiResponse: handleApiAiResponse, 
    handleApiAiAction: handleApiAiAction, 
    sendToApiAi: sendToApiAi,       
    sendEventToApiAi: sendEventToApiAi
}

const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});

function handleApiAiResponse(sender, response) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    console.log("Data from api.ai:");
    console.log(response.result);

    fb_messaging.sendTypingOff(sender);
    
    if (messages.length == 0 && !utils.isDefined(action)){
        console.log('Unknown query' + response.result.resolvedQuery);
        fb_messaging.sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
    } else {
        console.log(messages);
        //Facebook doesn't send messages in order, join the messages together for now
//        for (let msg of messages) {
//            console.log("Sending message from handleApiAiAction");
//            // not differentiating between default text message and custom payloads for now.
//            fb_messaging.sendTextMessage(sender, msg.speech);
//        }
        let final_msg = "";
        for (let m of messages) {
            final_msg = final_msg.concat(m.speech);
        }
        handleApiAiAction(sender, action, final_msg, contexts, parameters);
    }
}

// Some of the code in this function is not necessary at this moment.
//
// function handleApiAiResponse(sender, response) {
//     let responseText = response.result.fulfillment.speech;
//     let responseData = response.result.fulfillment.data;
//     let messages = response.result.fulfillment.messages;
//     let action = response.result.action;
//     let contexts = response.result.contexts;
//     let parameters = response.result.parameters;
// 
//     console.log("Data from api.ai:");
//     console.log(response.result);
// 
//     fb_messaging.sendTypingOff(sender);
// 
//     if (utils.isDefined(messages) && (messages.length == 1 && messages[0].type != 0 || messages.length > 1)) {
//         let timeoutInterval = 1100;
//         let previousType ;
//         let cardTypes = [];
//         let timeout = 0;
//         for (var i = 0; i < messages.length; i++) {
// 
//             if ( previousType == 1 && (messages[i].type != 1 || i == messages.length - 1)) {
// 
//                 timeout = (i - 1) * timeoutInterval;
//                 setTimeout(handleCardMessages.bind(null, cardTypes, sender), timeout);
//                 cardTypes = [];
//                 timeout = i * timeoutInterval;
//                 setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
//             } else if ( messages[i].type == 1 && i == messages.length - 1) {
//                 cardTypes.push(messages[i]);
//                 timeout = (i - 1) * timeoutInterval;
//                 setTimeout(handleCardMessages.bind(null, cardTypes, sender), timeout);
//                 cardTypes = [];
//             } else if ( messages[i].type == 1 ) {
//                 cardTypes.push(messages[i]);
//             } else {
//                 timeout = i * timeoutInterval;
//                 setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
//             }
// 
//             previousType = messages[i].type;
// 
//         }
//     } else if (responseText == '' && !utils.isDefined(action)) {
//         //api ai could not evaluate input.
//         console.log('Unknown query' + response.result.resolvedQuery);
//         fb_messaging.sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
//     } else if (utils.isDefined(action)) {
//         handleApiAiAction(sender, action, responseText, contexts, parameters);
//     } else if (utils.isDefined(responseData) && utils.isDefined(responseData.facebook)) {
//         try {
//             console.log('Response as formatted message' + responseData.facebook);
//             fb_messaging.sendTextMessage(sender, responseData.facebook);
//         } catch (err) {
//             fb_messaging.sendTextMessage(sender, err.message);
//         }
//     } else if (utils.isDefined(responseText)) {
// 
//         fb_messaging.sendTextMessage(sender, responseText);
//     }
// }

// function handleMessage(message, sender) {
//     switch (message.type) {
//         case 0: //text
//             fb_messaging.sendTextMessage(sender, message.speech);
//             break;
//         case 1: //card message
//             break;
//         case 2: //quick replies
//             let replies = [];
//             for (var b = 0; b < message.replies.length; b++) {
//                 let reply =
//                     {
//                         "content_type": "text",
//                         "title": message.replies[b],
//                         "payload": message.replies[b]
//                     }
//                 replies.push(reply);
//             }
//             fb_messaging.sendQuickReply(sender, message.title, replies);
//             break;
//         case 3: //image
//             fb_messaging.sendImageMessage(sender, message.imageUrl);
//             break;
//         case 4:
//             // custom payload
//             var messageData = {
//                 recipient: {
//                     id: sender
//                 },
//                 message: message.payload.facebook
// 
//             };
// 
//             fb_utils.callSendAPI(messageData);
//             break;
//     }
// }

function handleApiAiAction(sender, action, message, contexts, parameters) {
    switch (action) {
        case 'request-location': //asks the user to share their location
            actions.requestUserLocation(sender, action, message, contexts, parameters);
            break;
        case 'ask-resource-with-location': //search for resource with given location
            actions.findResource(sender, action, message, contexts, parameters);
            break;
        default:
            fb_messaging.sendTextMessage(sender, message);
    }
}

function sendToApiAi(sender, sessionID, text) {

    fb_messaging.sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
        sessionId: sessionID
    });

    apiaiRequest.on('response', (response) => {
        if (utils.isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}

function sendEventToApiAi(sender, sessionID, event_obj) {
    fb_messaging.sendTypingOn(sender);
    let apiaiRequest = apiAiService.eventRequest(event_obj, {
        sessionId: sessionID
    });

    apiaiRequest.on('response', (response) => {
        if (utils.isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}
