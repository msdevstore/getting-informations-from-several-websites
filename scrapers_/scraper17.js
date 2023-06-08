import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `https://shop.vnpt.vn/diem-giao-dich.html`,
  ajax_url: `https://shop.vnpt.vn/site/getAgentMaps.html`,
  website: `https://shop.vnpt.vn`,
  name: `vinaphone`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/17.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
         const $ = cheerio.load(data);
         var name=[], address = [], phone = [], workTime = [];

            $('.panel-heading').each((_idx, el) => {
              name.push($(el).text().trim());
            });
            $('.panel-body').each((_idx, el) => {
              address.push($(el).find("p").first().text().replace("\n","").trim());
              phone.push($(el).find("p:nth-child(2)").first().text().replace("\n","").trim());
              workTime.push($(el).find("p:nth-child(3)").first().text().replace("\n","").trim());
            })

            for(var k = 0 ; k < name.length ; k++)
              postTitles.push({
                "name" : name[k],
                "phone" : phone[k],
                "address" : address[k],           
                'opening-time':workTime[k]
              })
              resolve(postTitles)
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
      fs.writeFile('./results_/17.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
