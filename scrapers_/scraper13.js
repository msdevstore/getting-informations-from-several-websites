
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `http://www.banhmituanmap.com.vn/He-thong-cua-hang.html`,
    ajax_url: `http://www.bsmartvina.com/bsmart_store/vn`,
    website: `http://www.banhmituanmap.com.vn`,
    name: `banhmituanmap`,
    POI_Category: `Restaurant`,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/13.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
        const $ = cheerio.load(data);

             $('#slideanh').each((_idx, el) => {
              var name = $(el).find(".main_ttt").text().trim();
              var address = $(el).find("b").first().text().trim();
              var phone = $(el).find("div").first().find("p:nth-child(3)").find("b").first().text().trim();
              var email = $(el).find("div").first().find("p:nth-child(4)").find("b").first().text().trim();


             postTitles.push({          
              name,
              address,
              phone,
              email
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
      fs.writeFile('./results_/13.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
