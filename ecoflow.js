// Ecoflow.js
const ecoflowmqttcredentials = require("ecoflow_mqtt_credentials");
const mqtt = require("mqtt");

// constructor function for the Cat class
class Ecoflow {


    constructor(param_serial_number, param_app_key, param_api_secret_key) {

        this.serial_number = param_serial_number;
        this.app_key = param_app_key;
        this.secret_key = param_api_secret_key;

    }

    sendCmd(node,msg) {
        if((typeof node.worker !== 'undefined') && (typeof node.mqttclient !== 'undefined') && (typeof node.mqttsettings !== 'undefined')) {
            node.mqttclient.publish(node.mqttsettings.mqtt_topics[1].topic+"/set",JSON.stringify(msg.payload));
        }
    }

    connectDevice(node) {
        const self=this;

        if(typeof node.worker == 'undefined') {
            node.worker = async function() {

            let registers = {};

            const mqttsettings = await ecoflowmqttcredentials.retrieve({
                email:self.app_key,
                password:self.secret_key,
                serial_number:self.serial_number
            }); 

            node.mqttsettings = mqttsettings;

            const mqttoptions = {
                port: mqttsettings.mqtt_port,
                host: mqttsettings.mqtt_server,
                protocol: mqttsettings.mqtt_protocol,
                username:mqttsettings.mqtt_username,
                password:mqttsettings.mqtt_password,
                clientId:mqttsettings.mqtt_client_ids[0]
              }

            const client = mqtt.connect(mqttoptions);
            node.mqttclient = client;

            client.subscribe(mqttsettings.mqtt_topics[0].topic);

            client.subscribe(mqttsettings.mqtt_topics[1].topic+"/set");
          
            client.on("message", function (topic, payload) {
                let msg = {
                    payload:JSON.parse(payload),
                    topic:topic
                }
                if(topic == mqttsettings.mqtt_topics[0].topic) {
                    if(msg.payload.moduleType == node.moduleType) {
                        for (const [key, value] of Object.entries(msg.payload.params)) {
                            registers[key] = value;
                        }
                        msg.payload = registers;
                        node.send([msg]);
                    }
                } else {
                        node.send([,msg]);
                }
            });
            }
        }
        node.worker();
    }

    

    
}
 
module.exports = {
    Ecoflow
    
};