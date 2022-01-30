// Ecoflow.js

var https = require('https'),
    urllib = require("url");

// constructor function for the Cat class
class Ecoflow {


    constructor(param_serial_number, param_api_key) {

        this.serial_number = param_serial_number;
        this.api_key = param_api_key;

    }

    getDeviceInfo() {

        var self=this;

        return new Promise((resolve, reject) => {
           
       // https://iot1.ecoflow.com/api/v1/devices/queryDeviceData?sn=xxxxxxx&appkey=cccccccccccc

        var url =  "/api/v1/devices/queryDeviceData?sn=" + this.serial_number + "&appkey=" + this.api_key;
    
        var options = {
            method: 'GET',
            host: "iot1.ecoflow.com",
            port: 443,
            path: url,
            headers: {
    
               
    
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