# tail-logs-on-prem-nodejs

The script is used in the SX server to monitor Tomcat, PS API, Agent, Alerter, Broker, DB Manager. Displays status in localhost/servicecheck.html with a JSON response and 200 (OK) or 203 (Down) status code. 

Their F5 loadbalancer, uses the HTTP response code to monitor and switch to a redundant SX server if anything other than a 200 is received. 


ie. https://sxserver.fqdn:8443/servicecheck.html

https://github.com/ApicaSystem/tail-logs-on-prem-nodejs

Requirements:

- Node.js 

- Tail module npm


The script is used in the SX server to monitor Tomcat, PS API, Agent, Alerter, Broker, DB Manager. Displays status in localhost/servicecheck.html with a JSON response and 200 (OK) or 203 (Down) status code. 

Their F5 loadbalancer, uses the HTTP response code to monitor and switch to a redundant SX server if anything other than a 200 is received. 

This is currently being used in their Prod with the HTTPS capability. 

ie. https://sxserver.fqdn:8443/servicecheck.html

https://github.com/ApicaSystem/tail-logs-on-prem-nodejs - Connect your Github account


 

Requirements:

Node.js 

Tail module npm

 

Procedure: 

Install Node.js in SX Server

Install tail module 

cd into the node folder and install tail module


npm install tail
Copy the contents of the repository folder to the node folder

Edit main.js or https_main.js to use the correct folder paths for \\Apica\\Monitor\\Log

If using HTTPS, you’ll need to add the filename of the cert and key and update folder path in the https_main.js script

Start application:


node main.js or node https_main.js
 Navigate to http://localhost:3000/servicecheck.html or https://localhost:8443/servicecheck.html

Turn on/off services to test the application

 

Use the application as a service using NSSM:

Create an appstart.bat file


cd D:\Program Files\Node\tail-logs-onprem-nodejs
node https_main.js
Use NSSM from the ZebraTester Install folder to create a service 


nssm install "Apica F5 Script"
browse for application appstart.bat
select OK
service should say success/installed
b. From Services edit “Apica F5 Script” > Properties to use Automatic/Restart Services 
