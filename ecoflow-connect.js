var https = require('https'),
    urllib = require("url");
 
const {  Ecoflow } = require("./ecoflow.js");
const ecoflowmqttcredentials = require("ecoflow_mqtt_credentials");


module.exports = function(RED) {

    
    function ecoflowCredentials(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.serial_number = n.serial_number;
        this.app_key = n.app_key;
        this.secret_key = n.secret_key;
        this.moduleType = n.command;
    }

    RED.nodes.registerType("ecoflow-credential", ecoflowCredentials);
    
    function ecoflowConnectNode(n) {

        RED.nodes.createNode(this, n);

        const node = this;
        node.credentials = RED.nodes.getNode(n.server);

        node.serial_number = node.credentials.serial_number;
        node.app_key = node.credentials.app_key;
        node.secret_key = node.credentials.secret_key;
        node.moduleType = n.command;
   
        const ecoflow =  new Ecoflow(node.serial_number,node.app_key, node.secret_key);
        ecoflow.connectDevice(node);

        node.on('input', async function(msg) {
            ecoflow.sendCmd(node,msg);
        });
        
    }



    RED.nodes.registerType("ecoflow-connect", ecoflowConnectNode);

};
