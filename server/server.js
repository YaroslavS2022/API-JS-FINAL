const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const https = require('https');
const parser = new xml2js.Parser();
const app = express();
const cors = require('cors');

const xmlBodyParser = require('express-xml-bodyparser');

app.use(cors());
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlBodyParser());

const url = 'https://localhost:4443/data/json';
const port = 'https://localhost:4443';
const options = {
  cert: fs.readFileSync('certificate.crt'),
  key: fs.readFileSync('private.key')
};

// -----------------------------------GET METHODS-----------------------------------------------------

app.get('/data', (req, res) => {
  console.log(data);
  res.send(data);
  // console
});

const getter = '/data/XMLEntrySSL/do/depoapi/get';

app.get(`${getter}/:service`, (req, res) => {
  // res.send("Server.js received your API. Thank you!");
  const service = req.params.service;
  const apiUrl = `${port}${getter}/${service}`;

  axios
    .get(apiUrl, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignore self-signed certificate errors
      }),
    })
    .then(response => {
      const innerXml = response.data;

      parser.parseString(innerXml, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          res.status(500).send('Internal Server Error');
        } else {
          const builder = new xml2js.Builder();
          const xmlResponse = builder.buildObject(result);
          console.log(xmlResponse);

          res.set('Content-Type', 'text/xml');
          res.send(xmlResponse);
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
});

// -----------------------------------POST METHODS-----------------------------------------------------
app.use(express.text({
  type: "text/plain" 
}));

const builder = new xml2js.Builder({ renderOpts: { pretty: false } });

app.post(`${getter}/:service`, (req, res) => {
  const service = req.params.service;
  const apiUrl = `${port}${getter}/${service}`;
  const xmlData = req.body;
  console.log('TESTESTETSTESTETS')
  console.log(xmlData);
  console.log('TESTESTETSTESTETS')
  res.set('Content-Type', 'text/xml');

  axios.post(apiUrl, xmlData, {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Ignore self-signed certificate errors
    }),
  })
    .then(response => {
      const innerXml = response.data;
      console.log('-----------------------------------------------------------------');
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log(innerXml);
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log('-----------------------------------------------------------------------');
      res.send(innerXml);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });  
});

https.createServer(options, app).listen(4000, () => {
  console.log('Server is running on port 4000 (HTTPS)');
});