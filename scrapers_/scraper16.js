
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';


const scrapInfo = {
    store_url: `https://mediamart.vn/he-thong-sieu-thi`,
    ajax_url: `https://mediamart.vn/he-thong-sieu-thi`,
    website: `https://mediamart.vn`,
    name: `Media Mart`,
    POI_Category: ``,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      axios.get(scrapInfo.ajax_url)
      .then(res => {

        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
        
         const $ = cheerio.load(res.data);

             $('.card-body .list-unstyled li').each((_idx, el) => {
              var name = $(el).find("a").first().text().replace("\n","").trim();
              var address_init = $(el).find(".store-address").text().trim();
              var address_mo = address_init.split("-");
              var address = address_mo[0].trim();

              var phone = $(el).find(".store-address").find("a").first().text().trim();
              

             postTitles.push({          
              name,
              address,
              phone
             });
        });
        resolve(postTitles);
      });
    } catch
      (error) {
      reject();
      throw error;
    }
  });
};

const processFetch = () => {
  fetchSource()
    .then((resJson) => {
      let resData = {
        type: 'Feature',
        name: scrapInfo.name,
        'POI:Category': scrapInfo.POI_Category,
        store_url: scrapInfo.store_url,
        website: scrapInfo.website,
        properties: {
            attributes: resJson,
        },
        item_scraped_count: resJson.length,
      };
      fs.writeFile('./results_/16.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
