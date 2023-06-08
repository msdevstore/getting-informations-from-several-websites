
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `http://www.co-opmart.com.vn/lienhe/hethongcoopmart.aspx`,
    ajax_url: `http://www.co-opmart.com.vn/lienhe/hethongcoopmart.aspx/DataserviceProvider.asmx/GetBranch`,
    website: `http://www.co-opmart.com.vn`,
    name: `Co-op Mart`,
    POI_Category: ``,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/14.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
         const $ = cheerio.load(data);

            $('.unactive').each((_idx, el) => {
          
            
              var name = $(el).find(".namebr").text().trim();
              var address = $(el).find("a").first().find("span:nth-child(4)").text().trim();
              var phone = $(el).find("a").first().find("span").last().text().replace("\n","").trim();
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
      fs.writeFile('./results_/14.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
