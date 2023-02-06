// Ecoflow.js

var https = require('https'),
    urllib = require("url");

// constructor function for the Cat class
class Ecoflow {


    constructor(param_serial_number, param_app_key, param_api_secret_key) {

        this.serial_number = param_serial_number;
        this.app_key = param_app_key;
        this.secret_key = param_api_secret_key;

    }

    getDeviceInfo() {

        var self=this;

        return new Promise((resolve, reject) => {
           
        // https://api.ecoflow.com/iot-service/open/api/device/queryDeviceQuota?sn=R331ZEB4ZE8Q0464

        var url =  "/iot-service/open/api/device/queryDeviceQuota?sn=" + this.serial_number ;
    
        var options = {
            method: 'GET',
            host: "api.ecoflow.com",
            port: 443,
            path: url,
            headers: {
                "Content-Type": "application/json",
                "appKey": this.app_key,
                "secretKey": this.secret_key
            }   
        };
    
        
        var msg = {};
        var request = https.request(options, function(res) {
            res.setEncoding('utf8');
    
            
            msg.statusCode = res.statusCode;
            msg.payload = "";
    
            res.on("data", function(chunk) {
                msg.payload += chunk;
            
            });
    
            res.on("end",function() {
    
                
                try {
                    msg.payload = JSON.parse(msg.payload); 
                    msg.error = "";
                    resolve(msg);
                    // cb_ok(context, msg);
                }
            
                catch(e) { 
                    
                    // cb_error(msg);
                    msg.error= e;
                    reject(msg);
                }
            });
        });
    
        request.on("error", function(err) {
            msg.error = err;
            reject(msg);
        });
    
       
        request.end();
        })
    }

    

    
}
 
module.exports = {
    Ecoflow
    
};