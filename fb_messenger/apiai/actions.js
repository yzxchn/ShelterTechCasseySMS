"use strict";
const fb_messaging = require('../messaging.js');
const fb_sample = require('../templates/sample_listing.js');
const askdarcel_querying = require('../../askdarcel/askdarcel.js');
const templateGeneration = require('../../askdarcel/generateResourceListing.js');
const gmaps = require('../../googlemap/convertingAddress.js');

module.exports.requestUserLocation = function (sender, action, message, contexts, parameters) {
    var replies = [{"content_type":"location"}];
    fb_messaging.sendQuickReply(sender, message, replies, "request_location");
}

module.exports.findResource = async function (sender, action, message, contexts, parameters){
    var usrLocation = parameters.location;
    //fb_messaging.sendTemplateMessage(sender, fb_sample.samplePayload);
    let latitude = usrLocation.latitude;
    let longitude = usrLocation.longitude;
    let resource_categories = await askdarcel_querying.getCategoryMapping();
    let resource_id = resource_categories.get(parameters["resource-category"]);
    let resources = await askdarcel_querying.getResourcesByIdLoc(resource_id, longitude,latitude);
    resources = resources["resources"];
    if (resources) {
        let templateMessage = templateGeneration.generateListing(resources, 3);
        fb_messaging.sendTextMessage(
            sender, 
            "Here's what I can find:", 
            function () {
                fb_messaging.sendTemplateMessage(sender, templateMessage)
            });
        //sendTemplate is actually printResources in generateResourceListing
        //fb_messaging.sendTemplateMessage(sender, templateMessage);
    } else {
        fb_messaging.sendTextMessage(sender, "Sorry, I couldn't find anything");
    }
}

module.exports.findResourceWithAddress = function (sender, action, messages, contexts, parameters) {
    // what to do after sending the messages
    let address = parameters.address;
    let cb = async function () {
        let coord = await gmaps.geoCoding(address);
        if (coord) {
            console.log("Checking AskDarcel with coord lat: "+coord.latitude+" longitude: "+coord.longitude);
        } else {
            fb_messaging.sendTextMessage(sender, "Sorry, I couldn't find anything near that address.");
        }
    }
    fb_messaging.sendTextMessages(sender, messages, cb);
}
