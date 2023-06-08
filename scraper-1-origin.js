import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `https://www.nbk.com/kuwait/find-us.html`,
  ajax_url: `https://www.nbk.com/.rest/nbk/locations?lang=en&path=kuwait`,
  website: `https://www.nbk.com`,
  name: `National Bank of Kuwait`,
  POI_Category: `Bank /ATM`,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('start a fetching: %s', scrapInfo.store_url);
      axios.get(scrapInfo.store_url)
        .then(res => {
          console.log('processing res...');
          const $ = cheerio.load(res.data);
          const postTitles = [];

          $('.branch-item').each((_idx, el) => {
            // console.log('-->', $(el).find('h4').first().text());
            const title = $(el).find('h4').first().text();
            const addr = $(el).find('.b-detail .b-item span').first().text();
            const phone = $(el).find('.b-detail .b-item-more div').first().text().replace(/(\r\n|\n|\r)/gm, "");
            const type = $(el).find('.b-detail .facilities span').first().text();
            const availability = $(el).find('.b-detail .branchDay').first().text();
            const location_url = $(el).find('.b-detail .mapMobileView a').first().attr('href');
            const lat_log = location_url.split('/').slice(-1);
            const [lat, lon] = lat_log[0].split(',');
            // const postTitle = $(el).find('h4').text();
            postTitles.push({
              title,
              addr,
              phone,
              type,
              availability,
              coordinates: [lat, lon],
            })
          });

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
    .then((resJson) => {
      console.log(resJson);
      // let resData = {
      //   type: 'Feature',
      //   properties: {
      //     store_url: fetchUrl,
      //     website: websiteUrl,
      //     locators: resJson,
      //   }
      // };
      // fs.writeFile('res.json', JSON.stringify(resData, null, 2), 'utf8', () => {
      //   console.log('saved json file')
      // });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
