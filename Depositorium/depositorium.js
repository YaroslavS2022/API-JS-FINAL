const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const app = express();
const cors = require('cors');
const util = require('util');
const path = require('path');
const e = require('express');
const xmlParser = new xml2js.Parser();
const xmlBodyParser = require('express-xml-bodyparser');

const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);
const port = 'https://localhost:4443';

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

const folderPath = path.join(__dirname, 'storage');

app.post(`${getter}/:opcode`, (req, res) => {
  const opcode = req.params.opcode;
  if (opcode === 'brokers') {
    processBrokers(req, res);
  }
  else
    console.log('other');
  const schemaFile = `${opcode}-schema.xsd`;
  extractXML(opcode, schemaFile)
    .then(response => {
      if (response) {
        const builder = new xml2js.Builder({
          renderOpts: { pretty: false },
        });
        const xmlResponse = builder.buildObject(response);
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
});



function processBrokers(req, res) {
  const opcode = req.params.opcode;
  const xmlData = req.body;
      // Perform any additional processing or operations based on the extracted data
  console.log();
  console.log();
  console.log();
  console.log('---------------------------------------------------------------------');
  console.log(opcode);
  console.log(xmlData);
  console.log('---------------------------------------------------------------------');
  console.log();
  console.log();
  console.log();
}










function getDirectory(targetValue) {
  const filePath = path.join(__dirname, 'storage', targetValue + '.xml');

  return readFileAsync(filePath, 'utf8')
    .then(xmlData => {
      return new Promise((resolve, reject) => {
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
            reject(err);
          } else {
            console.log('Matching file:', filePath);
            console.log('XML content:', result);
            resolve([result]);
          }
        });
      });
    })
    .catch(err => {
      console.error('Error reading file:', err);
      throw err;
    });
}

function extractXML(opcode, _) {

  return readdirAsync(folderPath)
    .then(files => {
      const promises = files.map(file => {
        const filePath = path.join(folderPath, file);
        const fileName = path.basename(filePath);

        if (fs.statSync(filePath).isDirectory()) {
          // Skip directories
          return Promise.resolve(null);
        }

        if (fileName.startsWith(opcode)) {
          return readFileAsync(filePath, 'utf8')
            .then(xmlData => {
              return new Promise((resolve, reject) => {
                const parser = new xml2js.Parser();
                parser.parseString(xmlData, (err, result) => {
                  if (err) {
                    console.error('Error parsing XML:', err);
                    reject(err);
                    return;
                  }
                  console.log('Matching file:', filePath);
                  console.log('XML content:', result);
                  resolve(result);
                });
              });
            })
            .catch(err => {
              console.error('Error reading file:', err);
              throw err;
            });
        } else {
          return Promise.resolve(null);
        }
      });

      return Promise.all(promises);
    })
    .then(results => {
      const filteredResults = results.filter(result => result !== null);
      if (filteredResults.length > 0) {
        return filteredResults[0];
      } else {
        return null;
      }
    })
    .catch(err => {
      console.error('Error reading folder:', err);
      throw err;
    });
}

https.createServer(options, app).listen(4443, () => {
  console.log('Server is running on port 4443 (HTTPS)');
});


// app.listen(4443, () => {
//   console.log('Server is running on port 4443');
// });
