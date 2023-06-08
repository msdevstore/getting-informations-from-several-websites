
import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `https://www.shipsltd.co.jp/store/list.aspx`,
  ajax_url: ``,
  website: `https://www.shipsltd.co.jp`,
  name: `SHIPS`,
  POI_Category: `Clothing and Accessories`,
};


const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      fs.readFile(`./scrap_refer_new/2.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);

        const postTitles = [];
         const $ = cheerio.load(data);

            $('.info').each((_idx, el) => {
            var  name = $(el).find(".name a").text().trim();
            var  address = $(el).find(".address").text().trim();
            var  phone = $(el).find(".tel span").last().text().trim();
            var  open = $(el).find(".open span").last().text().replace("詳細はこちら","").trim();

              postTitles.push({
                name,
                address,
                phone,
                'opening-time':open
              })
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
// let categoryIndex = 1;
// let responseData = [];

// const fetchSource = () => {
//   return new Promise(async (resolve, reject) => {
//     const browser = await puppeteer.launch({
//       // userDataDir: './puppeteer_data',
//       headless: false,
//     });
    
//     const fetchData = async() => {
//       const doWork = async () => {
//         const page = await browser.newPage()
//         await page.goto(          
//           scrapInfo.store_url+'?p='+categoryIndex + '&ps=10',
//           {
//             waitUntil: 'load',
//             timeout: 0,
//           }
//         );
//         await page.waitForSelector('.list-area', {timeout: 0});
//         let result = await page.evaluate(()=>{
//           // var next=document.querySelector('a[rel="next"]');
          
//           let items = document.querySelector('.list-area');
//           const $ = cheerio.load(items);
//             var name='', address='',phone='',open='';
//             $('.info').each((_idx, el) => {
//               name = $(el).find(".name a").text();
//               address = $(el).find(".address").text();
//               phone = $(el).find(".tel span").last().text();
//               open = $(el).find(".open span").last().text();

//               data.push({
//                 name,
//                 address,
//                 phone,
//                 'opening-time':open
//               })
//             });
//             return data
//           });
//           responseData=responseData.concat(result);
//          categoryIndex = categoryIndex + 1;
//          await page.close();
//          if(categoryIndex<=8)
//            return doWork();
//           else {
//           await browser.close();
//           return resolve(responseData);

//           }
//         }
//         return doWork();
//       }

//      return fetchData();
    
//   });
// };

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
          attributes : resJson,
        },
        item_scraped_count: resJson.length,
      };
      fs.writeFile('./results_/2.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
