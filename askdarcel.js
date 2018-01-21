"use strict";

const config = require('./conf.js');
const request = require('request');
const rp = require('request-promise-native');
const {URL} = require('url');

const BASE_URL = config.ASKDARCEL_URL;

module.exports.getCategories = async function () {
    let options = {
        uri: BASE_URL+"/categories", 
        //uri: "http://0.0.0.0:3000/categories",
        transform: function (body) {
            return JSON.parse(body);
        },
        method: 'GET'
    };

    try {
        return await rp(options);
    } catch (err) {
        console.log(err);
    }
}

/* Convert the resource category result to a mapping, with the keys 
 * being the (lowercase) name of the resource, and the value the id 
 * of that resource.
 * Returns a Promise object.
 * */
module.exports.getCategoryMapping = async function (){
    let categoryList;
    try {
        categoryList = await module.exports.getCategories();
    } catch (err) {
        console.log(err);
    }
    let mapping = new Map();
    for (let c of categoryList.categories) {
        mapping.set(c.name.toLowerCase(), c.id);
    }
    return mapping;
}

/*
 * Retrieves info for a single resource by its id
 */
module.exports.getResource = async function(id) {
    let options = {
        uri: BASE_URL+"/resources/"+id, 
        transform: function (body) {
            return JSON.parse(body);
        },
        method: "GET"
    };

    try {
        return await rp(options);
    } catch (err) {
        console.log(err);
    }
}

module.exports.getResourcesByIdLoc = async function(id, longitude, latitude) {
    let options = {
        uri: BASE_URL+"/resources", 
        qs: {
            category_id: id, 
            long: longitude, 
            lat: latitude
        },
        method: 'GET',
        json: true
    };

    try {
        return await rp(options);
    } catch (err) {
        console.log("Failed to retrieve resource list with ID and location");
        console.log(err); 
    }
}
