
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://saigoneer.com/listings/category-items/1-listings/13-eat-and-drink`,
    ajax_url: `https://saigoneer.com/listings/category-items/1-listings/13-eat-and-drink`,
    website: `https://saigoneer.com`,
    name: `Saigon's restaurant and cafe`,
    POI_Category: `Restaurant`,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      axios.get(scrapInfo.ajax_url)
      .then(res => {

         console.log('start a fetching: %s', scrapInfo.store_url);
         const postTitles = [];
         const $ = cheerio.load(res.data);
           $('.brick').each((_idx, el) => {

            var description = "", phone = "", address = "";
            var name = $(el).find("h2").first().text().replace("\n","");

            var init_desc = $(el).find(".fields-list").find(".field-short-description").text();
            var desc_split = init_desc.split("\n");
            for(var k = 0;k< desc_split.length;k++)
            {
              if(desc_split[k].trim() !="" && desc_split[k].trim() !=" ")
               description += desc_split[k].trim();
            }

            var init_phone = $(el).find(".fields-list").find(".field-phone").text();
            var phone_split = init_phone.split("\n");
            for(var k = 0;k< phone_split.length;k++)
            {
              if(phone_split[k].trim() !="" && phone_split[k].trim() !=" ")
               phone += phone_split[k].trim();
            }
    
            var init_addr = $(el).find(".fields-list").find(".field-address").text();
            var addr_split = init_addr.split("\n");
            for(var k = 0;k< addr_split.length;k++)
            {
              if(addr_split[k].trim() !="" && addr_split[k].trim() !=" ")
               address += addr_split[k].trim();
            }
        postTitles.push({          
         name,
         description,
         phone,
         address
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
      fs.writeFile('./results_/5.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
