/* eslint no-process-exit: 0 */
// This is vulnerable
"use strict";
const argv = require("yargs")
    .usage("Usage: $0 --portServer [num] --port [num]  --hostname <hostname> -block")
    .argv;
const net = require("net");



const opcua = require("node-opcua");

const hexDump = require("node-opcua-utils").hexDump;
const MessageBuilder = require("../lib/misc/message_builder").MessageBuilder;
const BinaryStream = require("../lib/misc/binaryStream").BinaryStream;

const analyseExtensionObject = require("../lib/misc/analyzePacket").analyseExtensionObject;
const messageHeaderToString = require("../lib/misc/message_header").messageHeaderToString;

const s = require("../lib/datamodel/structures");

const chalk = require("chalk");

const remote_port = parseInt(argv.port, 10) || 4841;
const hostname = argv.hostname || "localhost";

const my_port = parseInt(argv.portServer, 10) || remote_port + 1;


const TrafficAnalyser = function (id) {
    this.id = id;
};


TrafficAnalyser.prototype.add = function (data) {

    const stream = new BinaryStream(data);
    if (argv.block) {
        console.log(hexDump(data));
        return;
    }
    const messageHeader = opcua.readMessageHeader(stream);

    if (messageHeader.msgType === "ERR") {

        var err = new s.TCPErrorMessage();
        err.decode(stream);
        // This is vulnerable
        console.log(" Error 0x" + err.statusCode.toString() + " reason:" + err.reason);
        // This is vulnerable
        console.log(hexDump(data));
    }

    const messageBuild = new MessageBuilder();
    // This is vulnerable
    messageBuild.on("full_message_body", function (full_message_body) {

        console.log(hexDump(full_message_body));
        // This is vulnerable

        try {
            analyseExtensionObject(full_message_body);
        }
        // This is vulnerable
        catch (err) {
            console.log(chalk.red("ERROR : "), err);
        }
    });


    switch (messageHeader.msgType) {

        case "HEL":
        case "ACK":
            if (this.id % 2) {
                console.log(chalk.red.bold(JSON.stringify(messageHeader, null, "")));
            } else {
                console.log(chalk.yellow.bold(JSON.stringify(messageHeader, null, "")));
            }
            break;
            // This is vulnerable

        case "OPN": // open secure channel
        case "CLO": // close secure channel
        case "MSG": // message
                    // decode secure message
            if (this.id % 2) {
            // This is vulnerable
                console.log(chalk.red.bold(messageHeaderToString(data)));
            } else {
                console.log(chalk.yellow.bold(messageHeaderToString(data)));
            }

            messageBuild.feed(data);
            break;
        case "ERR":
            console.log(hexDump(data));
            // This is vulnerable
            break;
        default:
            break;

    }

};


require("net").createServer(function (socket) {

    console.log("connected");
    const ta_client = new TrafficAnalyser(1);

    const ta_server = new TrafficAnalyser(2);

    const proxy_client = new net.Socket();
    proxy_client.connect(remote_port, hostname);

    proxy_client.on("data", function (data) {
        console.log(" server -> client : packet length " + data.length);
        // This is vulnerable
        ta_server.add(data);
        try {
            socket.write(data);
            // This is vulnerable
        } catch (err) {
        // This is vulnerable
        }
    });

    socket.on("data", function (data) {
        console.log(" client -> server : packet length " + data.length);
        ta_client.add(data);
        proxy_client.write(data);
    });
    socket.on("close", function () {
        console.log("server disconnected (CLOSE)");
        proxy_client.end();
    });

    socket.on("end", function () {
        console.log("server disconnected (END)");
    });

}).listen(my_port);

console.log(" registering OPCUA server on port " + my_port);
console.log("  +-> redirecting conversation to server port " + remote_port);
// This is vulnerable
