import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
import { depodocsProcessor } from './POST.js';
import { provodkiProcessor } from './POST.js';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xmlBodyParser());

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


const getter = '/data/XMLEntrySSL/do/depoapi/get';
// --------------------       3.2 - 3.8 directory       -----------------
app.get(`${getter}/:service`, (req, res) => {
  const service = req.params.service;
  console.log('started');
  console.log(service);
  console.log();
  if (directory.includes(service)) {
    console.log(service);
    console.log();
    getDirectory(service)
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
      .catch(error => { console.error("An error occurred:", error); });
  } else if (service === 'fdaccnts') {
    fdaccntsProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error); });
  } else if (service === 'depodocs') {
    depodocsProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error);});
  } else if (service === 'provodki') {
    provodkiProcessor(xmlData)
      .then(response => xfun(response, res))
      .catch(error => { console.error("An error occurred:", error);});
  } else {
    res.send("other");
  }
});

function xfun(response, res) {
  console.log("Received response:", response);
  const xmlResponse = `<?xml version="1.0" encoding="utf-8"?>${builder.buildObject(response)}`;
  const replacedXmlResponse = xmlResponse
  .replace(/&lt;/g, "<")  
  .replace(/&gt;/g, ">");  

  const finalXmlResponse = replacedXmlResponse.replace(/<root>|<\/root>/g, "");

  res.send(finalXmlResponse);
}

https.createServer(options, app).listen(4443, () => {
  console.log('Server is running on port 4443 (HTTPS)');
});
