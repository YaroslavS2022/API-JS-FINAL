const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const https = require('https');
const parser = new xml2js.Parser();
const app = express();
const cors = require('cors');

app.use(cors());
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = 'https://localhost:4443/data/json';
const port = 'https://localhost:4443';
const options = {
  cert: fs.readFileSync('certificate.crt'),
  key: fs.readFileSync('private.key')
};

async function makePostRequest(url, data, contentType) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': contentType,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignore self-signed certificate errors
      }),
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('POST Error:', error.message);
  }
}

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

// POST endpoint for receiving messages
app.post('/message', (req, res) => {
  const message = req.body.message;
  console.log('Received message:', message);

  res.json({ message }); // Return the received message as the response
});

// POST endpoint for JSON data
app.post('/data/json', (req, res) => {
  const jsonData = req.body;
  console.log('Received JSON data:', jsonData);
  data.push(jsonData);
  makePostRequest(url, jsonData, 'application/json');
  res.send('JSON data stored');
});

// POST endpoint for XML data
app.post('/data/xml', (req, res) => {
  const xmlData = req.body;
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error('Error parsing XML data:', err);
      res.status(400).send('Error parsing XML data');
    } else {
      console.log('Received XML data:', result);
      data.push(result);
      res.send('XML data stored');
    }
  });
});

const xml = require('xml');
const path = require('path');
const folderPath = 'Depositorium';

app.post('/data/XMLEntrySSL/do/depoapi/get/depoagrees/:parameter', (req, res) => {
  const parameter = req.params.parameter;
  const apiUrl = 'http://localhost:4443/data/XMLEntrySSL/do/depoapi/get/depoagrees/' + parameter; // Replace with the actual API URL

  axios.post(apiUrl, { parameter }, {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Ignore self-signed certificate errors
    }),
  })
    .then(response => {
      const innerXml = response.data;
      xmlParser.parseString(innerXml, (err, result) => {
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

const server = https.createServer(options, app);

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
