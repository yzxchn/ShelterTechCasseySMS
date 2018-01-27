"use strict";

const request = require('request');
const config = require('../conf.js');
const crypto = require('crypto');


module.exports = {
    geoCoding
}


/*
 * Converting input address into longitude and latitude
 *
 */
 function geoCoding(address) {
   try{
     request({
         uri: 'https://maps.googleapis.com/maps/api/geocode/json?address',
         qs: {
            address,
             key: config.GOOGLE_API_KEY,
         },
         method: 'POST',
         json: address

     }, function (error, response, body) {
         if (!error && response.statusCode == 200) {
             let lng = body.results[0].geometry.location.lng;
             let lat = body.results[0].geometry.location.lat;

             console.log(`Longitude: ${lng}; Latitude: ${lat}`);
         }
   })
 } catch(e){
            console.error("Failed calling Send API", e);
    };
 }

geoCoding('221 7th street, San Francisco, CA')
