import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `https://www.mobifone.vn/ho-tro-khach-hang/vi-tri-cua-hang`,
  ajax_url: `https://www.mobifone.vn/ho-tro-khach-hang/vi-tri-cua-hang`,
  website: `https://www.mobifone.vn`,
  name: `mobifone`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(scrapInfo.ajax_url)
        .then(res => {
            const $ = cheerio.load(res.data);
            const entities = [];
            $('.body-content .store').each((_idx, el) => {
                const name = $($(el).find('.store-name')[0]).text().trim();
                const phone = $($(el).find('.store-phone')[0]).text().trim();
                const address = $($(el).find('.store-address')[0]).text().trim();
                const working_hrs = $($(el).find('.store-time')[0]).text().trim();
                entities.push({
                    name,
                    phone,
                    address,
                    "working-time" : working_hrs
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
      fs.writeFile('./results_/22.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
