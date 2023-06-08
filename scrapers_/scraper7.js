
import * as cheerio from 'cheerio';
import * as fs from 'fs';


const scrapInfo = {
    store_url: `https://yody.vn/he-thong-cua-hang`,
    ajax_url: `https://yody.vn/he-thong-cua-hang`,
    website: `https://yody.vn`,
    name: `Yody`,
    POI_Category: ``,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/7.tmp.json`, 'utf8', (err, data) => {

         console.log('start a fetching: %s', scrapInfo.store_url);
         const postTitles = [];
         const $ = cheerio.load(data);

            $('.item').each((_idx, el) => {
             var name = $(el).find("b").first().text().trim();
              var address = $(el).find("p").first().text().trim();
              var phone = $(el).find("a").first().text().trim();    
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
      fs.writeFile('./results_/7.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
