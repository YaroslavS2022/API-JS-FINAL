import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import util from 'util';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const folderPath = path.join(__dirname, 'storage');
const readFileAsync = util.promisify(fs.readFile);

export function getDirectory(targetValue) {
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

