var https = require('https'),
    urllib = require("url");
    
const {  Ecoflow } = require("./ecoflow.js");


function main() {

    
        var device =  new Ecoflow("SERIALXXXX","APPKEYYYYYY", "SECRETKEYZZZZZZ");

      
        device.getDeviceInfo()
            .then(async result => {
               
               console.log(JSON.stringify(result, null, 2));
            }
            ).catch(err => {
                console.error(err);
                return;
            })
}

main();