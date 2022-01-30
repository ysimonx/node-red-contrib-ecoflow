var https = require('https'),
    urllib = require("url");
 
const {  Ecoflow } = require("./ecoflow.js");



module.exports = function(RED) {

    
    function ecoflowCredentials(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.serial_number = n.serial_number;
        this.api_key = n.api_key;
        
    }

    RED.nodes.registerType("ecoflow-credential", ecoflowCredentials);
    



    function ecoflowConnectNode(n) {

        RED.nodes.createNode(this, n);

        var node = this;
        node.credentials = RED.nodes.getNode(n.server);

        node.serial_number = node.credentials.serial_number;
        node.api_key = node.credentials.api_key;
        

        function fetchData() {
           
            var ecoflow =  new Ecoflow(node.serial_number,node.api_key);

           
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
