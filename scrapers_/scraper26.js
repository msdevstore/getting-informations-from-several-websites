import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `http://vietnamhotel.org.vn/Default.aspx?page=hotel&type=search`,
  ajax_url: `http://vietnamhotel.org.vn/Default.aspx?page=hotel&type=search`,
  website: `http://vietnamhotel.org.vn`,
  name: `hotel`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
        fs.readFile(`./scrap_refer_new/26.tmp.json`, 'utf8', (err, data) => {

            console.log('start a fetching: %s', scrapInfo.store_url);
            const postTitles = [];
            const $ = cheerio.load(data);

             $('#ctl00_ContentPlaceHolder1_ctl00_ctl00_grdList tbody tr td table tbody').find("tr:nth-child(2)").find("td table tbody tr").find("td:nth-child(2)").find("table tbody tr td").each((_idx, el) => {
                    var name = $(el).find(".hotelname").text().trim();
                    var address = $(el).find("div:nth-child(4)").find("span").first().text().trim();
                    var handphone = $(el).find("div:nth-child(5)").find("span").first().text().trim();
                    var email = $(el).find("div:nth-child(6)").find("span").first().text().replace("\n","").trim();
                    var website = $(el).find("div:nth-child(7)").find("span").first().text().replace("\n","").trim();
                    var brief = $(el).find(".brief").text().replace("\n","").trim();

                postTitles.push({
                    name,
                    address,
                    handphone,
                    email,
                    website,
                    brief
                })     
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
      fs.writeFile('./results_/26.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
