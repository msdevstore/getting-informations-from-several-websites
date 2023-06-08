
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `http://www.bsmartvina.com/bsmart_store/vn`,
    ajax_url: `http://www.bsmartvina.com/bsmart_store/vn`,
    website: `http://www.bsmartvina.com`,
    name: `Bsmart`,
    POI_Category: ``,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/12.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
        const $ = cheerio.load(data);

             $('.promo_list_item_content_store').each((_idx, el) => {
              var name = $(el).find(".promo_content_box1_store").text().trim();
              var address = $(el).find(".promo_content_box2_store").text().trim();
              var phone = $(el).find(".promo_content_box3_store").first().text().replace("\n","").replace("Số điện thoại. ","").trim();


             postTitles.push({          
              name,
              address,
              phone
             });
         });
        resolve(postTitles)
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
      fs.writeFile('./results_/12.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
