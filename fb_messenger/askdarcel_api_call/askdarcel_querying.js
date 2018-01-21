'use strict';

const request = require('request');
const getLocation = require("../apiai/actions.js");
const config = require('../../conf.js');


module.exports.handlingAskDarcel = function (resource_category, longitude,latitude){

  let reformatCategory = function (resource_category) {

    if(resource_category === "food"){
      return 1;
    }

  };

  request({
    uri: 'https://askdarcel.org/api/resources?',
    //qs - object containing querystring values to be appended to the uri
    qs:{
      // reformatCategory here
      category_id: reformatCategory,
      lat: latitude,
      long: longitude
    },
    method: 'GET'
  }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
  })
}
