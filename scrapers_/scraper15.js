
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';


const scrapInfo = {
    store_url: `https://en.starbucks.vn/store-locator`,
    ajax_url: `https://en.starbucks.vn/store-locator`,
    website: `https://en.starbucks.vn`,
    name: `Starbucks`,
    POI_Category: ``,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      axios.get(scrapInfo.ajax_url)
      .then(res => {
      // fs.readFile(`./scrap_refer_new/1.tmp.json`, 'utf8', (err, data) => {
      //   if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
        
         const $ = cheerio.load(res.data);

            $('script').each((_idx, el) => {
               if($(el).text() !="" && !$(el).text().startsWith("!function"))
               {
              
               var   init_text = $(el).text();
               var last_total = "";
               var split1 = init_text.split("\n");
               for(var k = 0; k<split1.length ; k++)
               {
                if(split1[k] !="" && split1[k].trim().startsWith("const shopLists = "))
                 last_total = split1[k].trim();
               }
               
          var newData = new Function(last_total+'; return shopLists;')();
        


             postTitles.push({          
              "info" : newData
             });
            }
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
      fs.writeFile('./results_/15.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
