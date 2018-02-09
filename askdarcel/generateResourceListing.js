'use strict';

// Generate a List template of resources. 
// 
module.exports.generateListing = function (resources, max_length){
    let fbPayload = {
        template_type: "list", 
        top_element_style: "compact", 
        elements: []
    }
    for (let i=0; i<Math.min(max_length, resources.length); i++) {
        let r = resources[i];
        let listItem = {
            title: r.name, 
            subtitle: r.short_description, 
            buttons: [
                {
                    title: "Get Details",
                    type: "postback", 
                    payload: "GET_RESOURCE"+"|"+r.id
                }
            ]
        }
        fbPayload.elements.push(listItem);
    }

    return fbPayload;
}

module.exports.generateResourceGeneric = function (r) {
    let resource = r["resource"];
    let fbPayload = {
        template_type: "generic", 
        elements: [{
            title: resource.name,
            subtitle: resource.long_description,
            buttons: [
                {
                    title: "Directions", 
                    type: "postback", 
                    // not working atm
                    payload: "GET_DIRECTIONS"+"|",
                }, 
                {
                    title: "Website", 
                    type: "web_url", 
                    url: "https//askdarcel.org/resource?id="+resource.id
                }]
        }]
    }

    return fbPayload;
}
