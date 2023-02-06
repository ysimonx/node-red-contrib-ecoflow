var https = require('https'),
    urllib = require("url");
 
const {  Ecoflow } = require("./ecoflow.js");



module.exports = function(RED) {

    
    function ecoflowCredentials(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.serial_number = n.serial_number;
        this.app_key = n.app_key;
        this.secret_key = n.secret_key;
        
    }

    RED.nodes.registerType("ecoflow-credential", ecoflowCredentials);
    



    function ecoflowConnectNode(n) {

        RED.nodes.createNode(this, n);

        var node = this;
        node.credentials = RED.nodes.getNode(n.server);

        node.serial_number = node.credentials.serial_number;
        node.app_key = node.credentials.app_key;
        node.secret_key = node.credentials.secret_key;
        

        function fetchData() {
           
            var ecoflow =  new Ecoflow(node.serial_number,node.app_key, node.secret_key);

           
            ecoflow.getDeviceInfo()
            .then(deviceInfo => {
                node.send(deviceInfo);
                node.status({});
            }).catch(err => {
                node.error(msg.error);
                node.status({ fill: "red", shape: "dot", text: "error" });
                return;
            });

          
            
            }

            node.on("close", function(){
            
            });

            node.on("input", function(){
                fetchData();
            });

        
    }




    RED.nodes.registerType("ecoflow-connect", ecoflowConnectNode);

};
