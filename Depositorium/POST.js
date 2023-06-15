
import path from 'path';
import { getDirectory } from './finder.js'
import { Builder } from 'xml2js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 3.9
export function depoagreesProcessor(xmlData) {
  return new Promise((resolve, reject) => {
    getDirectory("depoagrees")
      .then(response => {
        const inputs = xmlData.request.depocodes[0].depocode;
        const depoagrees = response[0].depoagrees;
        const depoagreesArray = depoagrees.depoagree;

        const filteredDepoagrees = depoagreesArray.filter(depoagree => {
          const deponentId = depoagree.deponent_id[0];
          return inputs.includes(deponentId);
        });

        const xmlObject = {
          depoagrees: {
            $: {
              'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
              'xsi:schemaLocation': 'http://www.example.com/depoagrees datatypes.xsd',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            depoagree: filteredDepoagrees.map(depoagree => ({
              deponent_id: depoagree.deponent_id[0],
              deponent_type: depoagree.deponent_type[0],
              agree_no: depoagree.agree_no[0],
              agree_date: depoagree.agree_date[0],
              cltype_nk: depoagree.cltype_nk[0],
              country_id: depoagree.country_id[0],
              full_name: depoagree.full_name[0],
              short_name: depoagree.short_name[0],
              account: depoagree.account[0],
              open_date: depoagree.open_date[0],
              close_date: depoagree.close_date[0],
              accnt_type: depoagree.accnt_type[0],
              address: depoagree.address[0],
              note: depoagree.note[0],
              status: depoagree.status[0],
              additional_element: depoagree.additional_element[0],
            }))
          }
        };

        const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
        const xmlString = builder.buildObject(xmlObject);
        resolve(xmlString);
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}

  // 3.10
  export function brokersProcessor(xmlData) {
    return new Promise((resolve, reject) => {
      getDirectory("brokers")
        .then(response => {
          const inputs = xmlData.request.brokers[0].broker;
          console.log(inputs);
          const brokersEntries = response[0].brokers;
          const brokersArray = brokersEntries.broker;
          console.log(brokersArray);
          const filteredBrokers = brokersArray.filter(broker => {
            const code = broker.broker_id[0];
            return inputs.some(input => input.opcode[0] === code);
          });
          console.log(filteredBrokers);
          const xmlObject = {
            brokers: {
              $: {
                'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
                'xsi:schemaLocation': 'http://www.example.com/brokers datatypes.xsd',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
              },
              broker: filteredBrokers.map(broker => ({
                broker_id: broker.broker_id[0],
                broker_name: broker.broker_name[0]
              }))
            }
          };
  
          const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
          const xmlString = builder.buildObject(xmlObject);
          resolve(xmlString);
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
  

  // 3.11
  export function brokagreesProcessor(xmlData) {
    return new Promise((resolve, reject) => {
      getDirectory("brokagrees")
        .then(response => {
          const inputs = xmlData.request.brokagreecodes[0].opcode;
          const brokagrees = response[0].brokagrees;
          const brokagreesArray = brokagrees.brokagree;
          console.log(inputs);
          const filteredBrokagrees = brokagreesArray.filter(brokagree => {
            const agreeId = brokagree.dog_zb_no[0];
            return inputs.includes(agreeId);
            // return inputs.some(input => input === agreeId);
          });
          const xmlObject = {
            brokagrees: {
              $: {
                'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
                'xsi:schemaLocation': 'http://www.example.com/brokagrees datatypes.xsd',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
              },
              brokagree: filteredBrokagrees.map(brokagree => ({
                broker_id: brokagree.broker_id[0],
                deponent_type: brokagree.deponent_type[0],
                deponent_id: brokagree.deponent_id[0],
                deponent_name: brokagree.deponent_name[0],
                dog_zb_no: brokagree.dog_zb_no[0],
                dog_zb_date: brokagree.dog_zb_date[0],
                is_zb_act: brokagree.is_zb_act[0],
                del_zb_date: brokagree.del_zb_date[0],
                is_rc_act: brokagree.is_rc_act[0],
                accnt_type: brokagree.accnt_type[0],
              }))
            }
          };
  
          const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
          const xmlString = builder.buildObject(xmlObject);
          resolve(xmlString);
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
  
  // 3.12
  export function fdaccntsProcessor(xmlData) {
    return new Promise((resolve, reject) => {
      getDirectory("fdaccnts")
        .then(response => {
          console.log(':::::::::');
          const inputs = xmlData.request.fdaccnts[0].fdaccnt;
          const fdaccntsEntries = response[0].fdaccnts;
          const fdaccntsArray = fdaccntsEntries.fdaccnt;
          const filteredFdaccnts = fdaccntsArray.filter(fdaccnt => {
            const code = fdaccnt.opcode[0];
            var day = (new Date()).toString();
            day = fdaccnt.lastdmv[0];
            return inputs.some(input => input.opcode[0] === code || input.lastdmv[0] === day);
          });
          const xmlObject = {
            fdaccnts: {
              $: {
                'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
                'xsi:schemaLocation': 'http://www.example.com/fdaccnts datatypes.xsd',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
              },
              fdaccnt: filteredFdaccnts.map(fdaccnt => ({
                fda_key: fdaccnt.fda_key[0],
                accnt: fdaccnt.accnt[0],
                opcode: fdaccnt.opcode[0],
                owner: fdaccnt.owner[0],
                pledgee: fdaccnt.pledgee[0],
                dt_in: fdaccnt.dt_in[0],
                cr_in: fdaccnt.cr_in[0],
                dt: fdaccnt.dt[0],
                cr: fdaccnt.cr[0],
                lastdmv: fdaccnt.lastdmv[0]
              }))
            }
          };
  
          const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
          const xmlString = builder.buildObject(xmlObject);
          resolve(xmlString);
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
  
  // 3.13
export function depodocsProcessor(xmlData) {
  return new Promise((resolve, reject) => {
    getDirectory("depodocs")
      .then(response => {
        const inputs = xmlData.request.depodocs[0].depodoc;
        const depodocsEntries = response[0].depodocs;
        const depodocsArray = depodocsEntries.depodoc;
        const filteredDepodocs = depodocsArray.filter(depodoc => {
          const code = depodoc.opcode[0];
          return inputs.some(input => input.opcode[0] === code);
        });
        console.log(filteredDepodocs);
        const xmlObject = {
          fdaccnts: {
            $: {
              'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
              'xsi:schemaLocation': 'http://www.example.com/fdaccnts datatypes.xsd',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            depodoc: filteredDepodocs.map(depodoc => ({

              ddoc_key: depodoc.ddoc_key[0],
              opcode: depodoc.opcode[0],
              owner1: depodoc.owner1[0],
              owner2: depodoc.owner2[0],
              tp_id: depodoc.tp_id[0],
              clcode_tp: depodoc.clcode_tp[0],
              net_id: depodoc.net_id[0],
              doctype: depodoc.doctype[0],
              cpcode: depodoc.cpcode[0],
              cpcount: depodoc.cpcount[0],
              summa_doc: depodoc.summa_doc[0],
              depoday_r: depodoc.depoday_r[0],
              status: depodoc.status[0],
              deal_key: depodoc.deal_key[0],
              deal_no: depodoc.deal_no[0],
              deal_date: depodoc.deal_date[0],
              summa: depodoc.summa[0],
              pay_date: depodoc.pay_date[0],
              p_code: depodoc.p_code[0],
              p_accnt: depodoc.p_accnt[0],
              p_iban: depodoc.p_iban[0],
              ground: depodoc.ground[0],
              regtime: depodoc.regtime[0],
              donetime: depodoc.donetime[0]
            }))
          }
        };
        const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
        const xmlString = builder.buildObject(xmlObject);
        resolve(xmlString);
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}

// pi

export function provodkiProcessor(xmlData) {
  return new Promise((resolve, reject) => {
    getDirectory("provodki")
      .then(response => {
        const inputs = xmlData.request.provodki[0].provodka;
        const provodkiEntries = response[0].provodki;
        console.log(provodkiEntries);
        const provodkiArray = provodkiEntries.provodka;
        const filteredProvodki = provodkiArray.filter(provodka => {
          const code = provodka.opcode[0];
          return inputs.some(input => input.opcode[0] === code);
        });
        console.log(filteredProvodki);
        const xmlObject = {
          fdaccnts: {
            $: {
              'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
              'xsi:schemaLocation': 'http://www.example.com/fdaccnts datatypes.xsd',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            depodoc: filteredProvodki.map(provodka => ({

              prov_id: provodka.prov_id[0],
              dt_accnt: provodka.dt_accnt[0],
              dt_owner: provodka.dt_owner[0],
              dt_pledgee: provodka.dt_pledgee[0],
              cr_accnt: provodka.cr_accnt[0],
              cr_owner: provodka.cr_owner[0],
              cr_pledgee: provodka.cr_pledgee[0],
              opcode: provodka.opcode[0],
              cpcount: provodka.cpcount[0],
              ddoc_key: provodka.ddoc_key[0],
              regtime: provodka.regtime[0],
              execmode: provodka.execmode[0]
            }))
          }
        };
        const builder = new Builder({ renderOpts: { pretty: true }, xmldec: { version: '1.0', encoding: 'UTF-8' } });
        const xmlString = builder.buildObject(xmlObject);
        resolve(xmlString);
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}
  