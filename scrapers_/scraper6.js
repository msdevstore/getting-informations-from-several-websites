
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://www.lotteria.vn/rest/english/V1/branch`,
    ajax_url: `https://www.lotteria.vn/rest/english/V1/branch`,
    website: `https://www.lotteria.vn/`,
    name: `Lotteria`,
    POI_Category: `Restaurant`,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
        axios.get(scrapInfo.ajax_url)
        .then(res => {
          console.log('start a fetching: %s', scrapInfo.store_url);
          // const resJson = convert.xml2js(res.data, {compact: true, spaces: 2});
         
         const postTitles = [];
         var result = res.data;
         
         for(var k=0;k<result.length;k++)
          {

            postTitles.push({          
              "name":result[k].name,
              "street" : result[k].street,
              "region_name" : result[k].region_name,
              "district_name" : result[k].district_name,
              "phone" : result[k].phone_number,
              "latitude" : result[k].latitude,
              "longitude" : result[k].longitude
            });
          }

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
      fs.writeFile('./results_/6.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
