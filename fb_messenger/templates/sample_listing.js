"use strict";

const sampleItem = {
        title: "Lorem Ipsum",
        subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        buttons: [
                {
                        title: "View",
                        type: "web_url",
                        url: "https://sheltertechbot.herokuapp.com"
                }
        ]
}

const samplePayload = {
        template_type: "list", 
        top_element_style: "compact", 
        elements: [sampleItem, sampleItem, sampleItem, sampleItem],
        buttons: [
                {
                        title: "View More", 
                        type: "postback", 
                        payload: "sample payload"
                }
        ]
}

module.exports = {
        samplePayload: samplePayload
}
