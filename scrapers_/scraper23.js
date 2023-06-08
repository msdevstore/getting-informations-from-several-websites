import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `http://www.vnpost.vn/buu-cuc/tim-kiem/province/48/district/273/service`,
  ajax_url: `http://www.vnpost.vn/buu-cuc/tim-kiem/province/48/district/273/service`,
  website: `http://www.vnpost.vn`,
  name: `Post office`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(scrapInfo.ajax_url)
        .then(res => {
            const $ = cheerio.load(res.data);
            const entities = [];
            $('.list-office .post-item').each((_idx, el) => {
                const str = $(el).text();
                const arrdata = str.replaceAll(':\n','').split('\n').map(s=>s.trim());
                const code = arrdata[2]                
                const post_office = arrdata[5]                
                const address = arrdata[8]
                const phone = address.slice(address.indexOf('(ÐT: ')+5, address.indexOf(')'))
                entities.push({
                    code,
                    post_office,
                    address,
                    phone
                })     
            })
            resolve(entities)
        });
    } catch (error) {
      reject();
      throw error;
    }
  });
};
 
const processFetch = () => {
    fetchSource()
    .then((data) => {
      console.log(data);
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
      fs.writeFile('./results_/23.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
