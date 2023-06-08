import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `https://yamaha-motor.com.vn/dai-ly/?province=0&district=0&type=0`,
  ajax_url: `https://yamaha-motor.com.vn/dai-ly/?province=0&district=0&type=0`,
  website: `https://yamaha-motor.com.vn/dai-ly/?province=0&district=0&type=0`,
  name: `yamaha-motor.`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(scrapInfo.ajax_url)
        .then(res => {
            const $ = cheerio.load(res.data);
            const entities = [];
            $('.each-location').each((_idx, el) => {
                const lat = $(el).attr('data-lat');
                const lng = $(el).attr('data-lng');
                const name = $($(el).find('.name')[0]).text().trim();
                const phone = $($(el).find('.phone')[0]).text().trim();
                const address = $($(el).find('.address')[0]).text().trim();
                entities.push({
                    name,
                    phone,
                    address,
                    geometry: {
                        type: "Point",
                        coordinates: [
                        lat+', '+lng
                        ]
                    }
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
      fs.writeFile('./results_/21.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
