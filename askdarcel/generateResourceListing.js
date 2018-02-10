'use strict';
let testJson = require('../testing.json');

// Generate a List template of resources as Facebook template
//
// module.exports.generateListing = function (resources, max_length){
//     let fbPayload = {
//         template_type: "list",
//         top_element_style: "compact",
//         elements: []
//     }
//     for (let i=0; i<Math.min(max_length, resources.length); i++) {
//         let r = resources[i];
//         let listItem = {
//             title: r.name,
//             subtitle: r.short_description,
//             buttons: [
//                 {
//                     title: "Get Details",
//                     type: "postback",
//                     payload: "GET_RESOURCE"+"|"+r.id
//                 }
//             ]
//         }
//         fbPayload.elements.push(listItem);
//     }
//
//     return fbPayload;
// }

// Generate a List template of resources as text response
//


// generate text listing


let generateListing = function(resources, max_length){
  //get into the resources file content
    let resourcesContent = resources.resources;
    // console.log(resourcesContent[0].id)
    let resourcesList = new Set();

    for (let i=0; i<Math.min(max_length, resourcesContent.length); i++) {
        let resource = resourcesContent[i];
        let listItem = {
            title: resource.name,
            description: resource.short_description,
            address:resource.address.address_1,
            phone: resource.phones[0].number
        }
        resourcesList.add(listItem);
    }

    return printResources(resourcesList)
}



let printResources = function(resourceList){
  let counter = 1;
  // console.log(resourceList);
  resourceList.forEach(resource => {
    //change this to return
    console.log(`${counter}:
                  Name: ${resource.title}
                  Address: ${resource.address}
                  Phone: ${resource.phone}
                `);
    counter++;
  })

}

//testing
console.log(generateListing(testJson, 3))

module.exports = {
    generateListing,
    printResources
}
