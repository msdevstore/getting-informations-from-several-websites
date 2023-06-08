
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://www.piaggio.com/vn_VI/dealer-locator/?f=all`,
    ajax_url:  ``,
    website: `https://www.piaggio.com`,
    name: `piaggio`,
    POI_Category: ``,
  };


  const fetchSource = () => {
    return new Promise((resolve, reject) => {
      try {
  
        fs.readFile(`./scrap_refer_new/8.tmp.json`, 'utf8', (err, data) => {
  
           console.log('start a fetching: %s', scrapInfo.store_url);
           const postTitles = [];
           const $ = cheerio.load(data);
  
              $('.sl_evo-results-list li').each((_idx, el) => {
                var name = $(el).find("h6").first().text().trim();
               var distance = $(el).find(".pin").find("span").first().text().trim();
               var address = $(el).find(".adr").find("span").first().text().trim() + ", " + $(el).find(".adr").find("span:nth-child(2)").text().trim();
               var phone = $(el).find(".adr").find("span").last().text().trim()
          postTitles.push({          
            name,
            distance,
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
        fs.writeFile('./results_/8.json', JSON.stringify(resData, null, 2), 'utf8', () => {
          console.log('saved json file')
        });
      })
      .catch();
  };
  
  export const scraperModule = {
    processFetch
  };
  