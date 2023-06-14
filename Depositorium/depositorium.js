import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import util from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const folderPath = path.join(__dirname, 'storage');


import express, { response } from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import xml2js from 'xml2js';

const app = express();
import cors from 'cors';
import xmlBodyParser from 'express-xml-bodyparser';

import { getDirectory } from './finder.js'

import { depoagreesProcessor } from './POST.js';
import { brokersProcessor } from './POST.js';
import { brokagreesProcessor } from './POST.js';
import { fdaccntsProcessor } from './POST.js';

const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xmlBodyParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// ---------------Certificates-------------------

const options = {
  cert: fs.readFileSync('certificate.crt'),
  key: fs.readFileSync('private.key')
};

// -----------------------------------GET METHODS-----------------------------------------------------

const directory = [
  'securities',
  'zberigs',
  'deponenttypes',
  'birgi',
  'depoopers',
  'depostats',
  'depostate',
];


// const port = 'http://localhost:4443';
const getter = '/data/XMLEntrySSL/do/depoapi/get';
// --------------------       3.2 - 3.8 directory       -----------------
app.get(`${getter}/:service`, (req, res) => {
  const service = req.params.service; // Use req.params.service instead of req.params.parameter
  console.log('started');
  console.log(service);
  console.log();
  if (directory.includes(service)) {
    console.log(service);
    console.log();
    getDirectory(service) // Use service instead of parameter
      .then(response => {
        console.log("Response:", response);
        if (response && response.length > 0) {
          const builder = new xml2js.Builder({
            renderOpts: { pretty: false },
          });
          const xmlResponse = builder.buildObject(response[0]);
          console.log(xmlResponse);
          res.set('Content-Type', 'text/xml');
          res.send(xmlResponse);
        } else {
          res.status(404).send('Not Found');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      });
  }
});

// -----------------------------------------POST-----------------------------------------------

const directoryPOST = [
    "provodki",
    "depoagrees",
    "fdaccnts",
    "depodocs",
    "provodki"];

// const folderPath = path.join(__dirname, 'storage');
app.use(express.text({
  type: "text/plain" 
}));

const builder = new xml2js.Builder({ renderOpts: { pretty: false } });

app.post(`${getter}/:service`, (req, res) => {
  const service = req.params.service;
  console.log(service);
  const xmlData = req.body;
  res.set('Content-Type', 'text/xml');

  if (service === 'depoagrees') {
    depoagreesProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error); });
  } else if (service === 'brokers') {
    brokersProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error); });
  } else if (service === "brokagrees") {
    brokagreesProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occured:", error); })
  } else if (service === 'fdaccnts') {
    fdaccntsProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error); });
  }
  else {
    res.send("other");
  }
});

function xfun(response, res) {
  // Handle the response here
  console.log("Received response:", response);
  const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>${builder.buildObject(response)}`;
  const replacedXmlResponse = xmlResponse
  .replace(/&lt;/g, "<")  // Replace all occurrences of "&lt;" with "<"
  .replace(/&gt;/g, ">"); // Replace all occurrences of "&gt;" with ">"

  // Remove the "root" tag
  const finalXmlResponse = replacedXmlResponse.replace(/<root>|<\/root>/g, "");

  res.send(finalXmlResponse);
  // Process the response further if needed
}

// ------------------------------- PUT --------------------------------

// import { DOMParser } from 'xmldom';
// import { create, convert } from 'xmlbuilder2';

// const newbuilder = create({ render: { pretty: true } });

// app.post('/data/XMLEntrySSL/do/depo/put/depoagrees', (req, res) => {
//   const xmlData = req.body;

//   // Call the depoagreesPUTProcessor function
//   depoagreesPUTProcessor(xmlData)
//     .then(updatedXml => {
//       // Save the updated XML data to depoagrees.xml
//       saveXmlToDepoagrees(updatedXml)
//         .then(() => {
//           // Send the response indicating success
//           const response = {
//             status_code: 200,
//             status_descr: 'Success',
//           };
//           res.set('Content-Type', 'text/xml');
//           const xmlResponse = newbuilder.buildObject(response);
//           res.send(xmlResponse);
//         })
//         .catch(error => {
//           console.error('Error saving XML to depoagrees.xml:', error);
//           res.status(500).send('Internal Server Error');
//         });
//     })
//     .catch(error => {
//       console.error('Error processing depoagrees:', error);
//       res.status(500).send('Internal Server Error');
//     });
// });

// function depoagreesPUTProcessor(xmlData) {
//   return new Promise((resolve, reject) => {
//     getDirectoryPUT()
//       .then(response => {
//         console.log(xmlData);
//         console.log();
//         const depoagrees = response[0].depoagrees;
//         console.log('here')
//         const depoagreesArray = depoagrees.depoagree;

//         const parser = new DOMParser({
//           errorHandler: {
//             warning: warning => {
//               console.warn('DOMParser Warning:', warning);
//             },
//             error: error => {
//               console.error('DOMParser Error:', error);
//             },
//             fatalError: error => {
//               console.error('DOMParser Fatal Error:', error);
//             },
//           },
//         });
        
//         const xmlDoc = parser.parseFromString(xmlData.toString(), 'text/xml');
//         const xmlDepoAgrees = xmlDoc.getElementsByTagName('depoagree');
        
//         // Process and modify the depoagrees data based on xmlData
//         Array.from(xmlDepoAgrees).forEach((depoagree, index) => {
//           const deponentId = depoagree.getElementsByTagName('deponent_id')[0].textContent;

//           // Check if deponentId is present in the xmlData and update status if necessary
//           if (xmlData.depoagree[index]) {
//             depoagreesArray[index].getElementsByTagName('status')[0].textContent =
//               xmlData.depoagree[index].status;
//           }

//           // Add additional data if needed
//           if (xmlData.additionalData) {
//             const additionalDataElement = create('additionalData').text(xmlData.additionalData);
//             depoagreesArray[index].appendChild(additionalDataElement);
//           }
//         });

//         // Create the XML document
//         const xmlBuilder = create({ version: '1.0', encoding: 'utf-8' })
//           .ele('depoagrees', {
//             'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
//             'xsi:schemaLocation': 'http://www.example.com/depoagrees datatypes.xsd',
//             'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//           });

//         depoagreesArray.forEach(depoagree => {
//           xmlBuilder.importDocument(depoagree);
//         });

//         const updatedXml = convert(xmlBuilder, { format: 'string' });

//         resolve(updatedXml);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// }

// function getDirectoryPUT() {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(__dirname, 'storage', 'depoagrees.xml');
//     fs.readFile(filePath, 'utf8', (error, data) => {
//       if (error) {
//         reject(error);
//         return;
//       }

//       const parser = new DOMParser({
//         errorHandler: {
//           warning: warning => {
//             console.warn('DOMParser Warning:', warning);
//           },
//           error: error => {
//             console.error('DOMParser Error:', error);
//           },
//           fatalError: error => {
//             console.error('DOMParser Fatal Error:', error);
//           },
//         },
//       });
//       const xmlDoc = parser.parseFromString(data, 'text/xml');

//       const depoagrees = xmlDoc.getElementsByTagName('depoagrees')[0];
//       const depoagreesArray = Array.from(depoagrees.getElementsByTagName('depoagree'));

//       resolve({ depoagrees: depoagreesArray });
//     });
//   });
// }



function saveXmlToDepoagrees(xmlData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'storage', 'depoagrees.xml'), xmlData, 'utf8', error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

https.createServer(options, app).listen(4443, () => {
  console.log('Server is running on port 4443 (HTTPS)');
});
