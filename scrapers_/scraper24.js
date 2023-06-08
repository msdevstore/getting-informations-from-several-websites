import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import convert from 'xml-js';

const scrapInfo = {
  store_url: `https://www.hlb.gov.sg/notices`,
  ajax_url: [`https://www.hlb.gov.sg/notices/1a-2022-q1/`,`https://www.hlb.gov.sg/notices/1a-2022-q2/`,`https://www.hlb.gov.sg/notices/1a-2022-q3/`,`https://www.hlb.gov.sg/notices/2022/permalink/`,
              `https://www.hlb.gov.sg/notices/1a-2021-q1/`, `https://www.hlb.gov.sg/notices/1a-2021-q2/`, `https://www.hlb.gov.sg/notices/1a-2021-q3/`, `https://www.hlb.gov.sg/notices/1a-2021-q4/`,
              `https://www.hlb.gov.sg/notices/2a-2020-q1/`, `https://www.hlb.gov.sg/notices/2a-2020-q2/`, `https://www.hlb.gov.sg/notices/2a-2020-q3/`, `https://www.hlb.gov.sg/notices/2a-2020-q4/`,
              `https://www.hlb.gov.sg/notices/3a-2019-q4/`],
  website: `https://www.hlb.gov.sg`,
  name: `generic`,
  POI_Category: ``,
};
 
const fetchSource = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const entities = [];
      for(var k = 0; k< scrapInfo.ajax_url.length ; k++)
      await axios.get(scrapInfo.ajax_url[k])
        .then(res => {
            const $ = cheerio.load(res.data);
            
            $('tbody tr').each((_idx, el) => {
              if(_idx != 0)
              {
                let date = $($(el).find('td')[0]).text();
                let name = $($(el).find('td')[1]).text();                
                let address = $($(el).find('td')[2]).html()+'';
                let t=address.split('<br>').map(s=>s.trim());
                address = t[0]+' '+t[1];
                entities.push({
                    date,
                    name,
                    address
                })
              }
            })
            
        });
        resolve(entities)
    } catch (error) {
      reject();
      throw error;
    }
  });
};

const processFetch = () => {
    fetchSource()
    .then((data) => {
      let resData = {
        type: 'Feature',
        name: scrapInfo.name,
        'POI:Category': scrapInfo.POI_Category,
        store_url: scrapInfo.store_url,
        website: scrapInfo.website,
        properties: {
            entities: data,
        },
        item_scraped_count: data.length,
      };
      fs.writeFile('./results_/24.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
