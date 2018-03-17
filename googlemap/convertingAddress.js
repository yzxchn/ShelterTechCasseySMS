"use strict";

const request = require('request');
const rp = require('request-promise-native');
const settings = require('../settings.js');
const crypto = require('crypto');


module.exports = {
    geoCoding
}


/*
 * Converting input address into longitude and latitude
 * @return a Promise object
 */
async function geoCoding(address) {
     let options = {
         uri: 'https://maps.googleapis.com/maps/api/geocode/json?address',
         qs: {
             address,
             key: settings.GOOGLE_API_KEY,
         },
         method: 'POST',
         json: address
     }

     try { 
         let response = await rp(options);
         console.log(response.results)
         let coord = {
             longitude: response.results[0].geometry.location.lng, 
             latitude: response.results[0].geometry.location.lat,
         }
         return coord;
     } catch (err) {
         console.log("Failure when using Google Maps Geocoding");
         console.log(err);
     }
}
//   try{
//     request({
//         uri: 'https://maps.googleapis.com/maps/api/geocode/json?address',
//         qs: {
//            address,
//             key: settings.GOOGLE_API_KEY,
//         },
//         method: 'POST',
//         json: address
//
//     }, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             let lng = body.results[0].geometry.location.lng;
//             let lat = body.results[0].geometry.location.lat;
//
//             console.log(`Longitude: ${lng}; Latitude: ${lat}`);
//             let coord = {
//                      longitude: lng, 
//                      latitude: lat, 
//                     };
//             return coord;
//         }
//   })
// } catch(e){
//            console.error("Please specify city", e);
//    };
// }

 // geoCoding('111 Market Street');
  // geoCoding('111 Market Street San Francisco');
  // geoCoding('111 Market Street SF');
// geoCoding('221 7th street, San Francisco, CA')
//geoCoding('221 7th street San Francisco 94103')
//geoCoding('221 7th street, San Francisco, CA 94103')
