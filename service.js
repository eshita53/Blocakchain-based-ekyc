const _ = require('lodash');
const fetch = require('node-fetch');
var timestamp = _.now();
//console.log(timestamp);

const nidApiFetch = async(req) => {
    const requestBody = {
        name: req.name,
        nid: req.nid,
        fatherName: req.fatherName,
        motherName: req.motherName,
        passwordHash: req.passwordHash,
        gender: req.gender,
        dateOfBirth: req.dateOfBirth,
    }
    const fetch_response = await fetch('http://localhost:3001/getData', {
        method: "POST",
        headers: {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          },
          body: new URLSearchParams(requestBody)
    });
    const data = await fetch_response.json();
    return data;
};



function getTimeStamp() {
    var now = new Date();
    return ((now.getDate()) + '-' +
        (now.getMonth() + 1) + '-' +
        now.getFullYear() + " " +
        now.getHours() + ':' +
        ((now.getMinutes() < 10)
            ? ("0" + now.getMinutes())
            : (now.getMinutes())) + ':' +
        ((now.getSeconds() < 10)
            ? ("0" + now.getSeconds())
            : (now.getSeconds())));
}
const currentTime = getTimeStamp();
module.exports = {
    currentTime, 
    nidApiFetch
};
