"use strict";
const fb_messaging = require('../messaging.js');
const fb_sample = require('../templates/sample_listing.js');
const askdarcel_querying = require('../../askdarcel.js');
const templateGeneration = require('../../generateResourceListing.js');

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
    console.log(resource_categories);
    let resource_id = resource_categories.get(parameters["resource-category"]);
    let resources = await askdarcel_querying.getResourcesByIdLoc(resource_id, longitude,latitude);
    resources = resources["resources"];
    if (resources) {
        fb_messaging.sendTextMessage(sender, "Here's what I can find:");
        let templateMessage = templateGeneration.generateListing(resources, 4);
        console.log(templateMessage);
        fb_messaging.sendTemplateMessage(sender, templateMessage);

    } else {
        fb_messaging.sendTextMessage(sender, "Sorry, I couldn't find anything");
    }
    }
