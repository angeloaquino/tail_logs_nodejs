// Importing express
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https'); //change to https but needs certificate .pem .cer
const Tail = require('tail').Tail;
const port = 8443;

const options = {  // object for PS API Status 
    hostname: 'localhost',
    port: 8080,
    path: "//proxysniffer//api?format=json",
    method: 'GET'
}
const privateKey = fs.readFileSync('key.pem');
const certificate = fs.readFileSync('cert.pem');

const app = express();

const httpsOptions = { key: privateKey, cert: certificate };

const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
    console.log("server starting on port : " + port)
});


//input vars
var apicaServicesFolderPath = "C:\\Program Files (x86)\\Apica\\Monitor\\Log\\";
var amonAgentFiles = ["AmonAgent-0000.log", "AmonAgent-0001.log", "AmonAgent-0002.log", "AmonAgent-0003.log", "AmonAgent-0004.log", "AmonAgent-0005.log", "AmonAgent-0006.log"];
var amonAlerterFiles = ["AmonAlerter-0000.log", "AmonAlerter-0001.log", "AmonAlerter-0002.log", "AmonAlerter-0003.log", "AmonAlerter-0004.log", "AmonAlerter-0005.log", "AmonAlerter-0006.log"];
var amonBrokerFiles = ["AmonBroker-0000.log", "AmonBroker-0001.log", "AmonBroker-0002.log", "AmonBroker-0003.log", "AmonBroker-0004.log", "AmonBroker-0005.log", "AmonBroker-0006.log"];
var amonDBManagerFiles = ["AmonDBManager-0000.log", "AmonDBManager-0001.log", "AmonDBManager-0002.log", "AmonDBManager-0003.log", "AmonDBManager-0004.log", "AmonDBManager-0005.log", "AmonDBManager-0006.log"];

var apicaService = ["Apica Monitor Agent", "Apica Monitor Alerter", "Apica Monitor Broker", "Apica Monitor DbManager", "PS API"];
var serviceStatus = "live";
var psAPIstatus = "true";
var httpStatusCode = 200;

status_json = { apicaService: serviceStatus }; //create the status JSON



// Handling GET / Request
app.get('/servicecheck.html', function (req, res) {
    //res.send("Hello World!, I am server created by expresss");
    //fs.createReadStream("./index.html").pipe(res)
    psApiJsonStatus(apicaService[4]);  //fuction for PS AI status
    for (var i = 0; i < 7; i++) { //for loop that goes through every file 
        var agentFile = apicaServicesFolderPath + amonAgentFiles[i]; //assigns to type of service file
        var alerterFile = apicaServicesFolderPath + amonAlerterFiles[i];
        var brokerFile = apicaServicesFolderPath + amonBrokerFiles[i];
        var DbManagerFile = apicaServicesFolderPath + amonDBManagerFiles[i];
        tailingLogs(agentFile, apicaService[0], "Successfully established", "Lost connection to broker");
        tailingLogs(agentFile, apicaService[0], "Successfully established", "Failed to connect");
        tailingLogs(alerterFile, apicaService[1], "established Apica Broker connection", "service has stopped");
        tailingLogs(alerterFile, apicaService[1], "established Apica Broker connection", "Failed to connect");
        tailingLogs(brokerFile, apicaService[2], "Connect from", "stopped");
        tailingLogs(DbManagerFile, apicaService[3], "Successfully connected", "failed to connect");
        //tail.unwatch();
    }
    var statusJSONstring = JSON.stringify(status_json);
    console.log(statusJSONstring);
    if (statusJSONstring.indexOf("down") > -1) {
        console.log("Down Status");
        httpStatusCode = 203;
    } else {
        console.log("UP Status");
        httpStatusCode = 200;
    }
    res.statusCode = httpStatusCode;
    res.end(statusJSONstring); //adding to json before it post to localhost site
})

function psApiJsonStatus(apicaService) { //fuction to run the PSI api endpoint and pull status 
    var req = http.request(options, res => {
        // console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            var psAPI = JSON.parse(d);
            //    console.log(psAPI.apiStatusResult);
            psAPIstatus = psAPI.apiStatusResult.overallStatusOk;
            //    console.log(psAPIstatus);
            if (psAPIstatus === true) {  //if ps api is true then status up
                serviceStatus = "up";
                status_json[apicaService] = serviceStatus;
                console.log(apicaService + ": " + serviceStatus);
            }
            else if (psAPIstatus === false) { //if ps api true status down
                serviceStatus = "down";
                status_json[apicaService] = serviceStatus;
                console.log(apicaService + ": " + serviceStatus);
            }
        });
    });
    req.on('error', error => {  //error handling 
        console.error(error);
        status_json[apicaService] = "down";
        console.log("Tomcat is down, start the service.");
    });
    req.end();
};


function tailingLogs(fileToTail, apicaService, successKeyword, failKeyword) { //filepath, service[i], success string, failure string
    //Tail = require('tail').Tail; //library method to tail the logs
    try {
        tail = new Tail(fileToTail);
        tail.on("line", data => { //function to look for keywords in new lines
            console.log(data);
            if (data.indexOf(successKeyword) >= 0) { //if success string matches - status = up
                serviceStatus = "up";
                status_json[apicaService] = serviceStatus;
                console.log("Tail log shows keyword: " + successKeyword);
                //tail.unwatch();
            }
            else if (data.indexOf(failKeyword) >= 0) {
                serviceStatus = "down";
                status_json[apicaService] = serviceStatus;
                console.log("Tail log shows keyword: " + failKeyword);
                //tail.unwatch();
            }
            tail.unwatch();
        });
        tail.on("error", function (error) { //tail error handling
            console.log('ERROR: ', error);
        });
    } catch (FileNotFoundException) {  //file doesnt exist error handling
        console.log("File does not exist: " + fileToTail);
    }
}

// Listening to server at port 3000
//app.listen(8443, function () {
//    console.log("server started");
//})// JavaScript source code
