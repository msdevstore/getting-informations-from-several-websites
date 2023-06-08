import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
const puppeteer = require('puppeteer')

const scrapInfo = {
    store_url: `https://brgshopping.vn/new_detail/he-thong-sieu-thi-cua-brgmart.html`,
    ajax_url: `https://brgshopping.vn/new_detail/he-thong-sieu-thi-cua-brgmart.html`,
    website: `https://brgshopping.vn/new_detail/he-thong-sieu-thi-cua-brgmart.html`,
    name: `BRG Mart`,
    POI_Category: ``,
  };

const fetchSource = () => {
    return new Promise( async (resolve,reject) => {
    try {
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        await page.goto(scrapInfo.website,{
            waitUntil: 'load',
            timeout: 0
        })
        var html = await page.evaluate(() => {
            return document.body.innerHTML
        })
        // fs.readFile(`./scrap_refer/19.ref.txt`, 'utf8', (err, data) => {
        //     if (err) throw err;
            const $ = cheerio.load(html);
            let entities = []
            let location = null
            let sublocation = null
            $($('.news-content')[0]).children().each((_idx, el) => {
                if($(el).is('h2')){
                    if(location)
                        entities.push(location)
                        location = {name: $(el).text(),locations:[]}
                }
                if($(el).is('h1')){
                    $(el).children().each((_idx, el) => {
                        if($(el).is('br'))return;
                        if($(el).css('background-color')=='rgb(206, 0, 0)'){
                            if(sublocation)
                                location.locations.push(sublocation)
                            sublocation = {
                                name:$(el).text(),
                                locations:[]
                            }    
                        }
                        else{
                            sublocation.locations.push($(el).text())
                        }
                    })
                }
            });
            browser.close()
            resolve(entities)
        // })
    } catch (error) {
     reject(error)
      throw error;
    }
});
};

const processFetch = () => {
    fetchSource()
    .then((data) => {
      console.log(data);
      let resData = {
        type: 'Feature',
        name: scrapInfo.name,
        'POI:Category': scrapInfo.POI_Category,
        store_url: scrapInfo.store_url,
        website: scrapInfo.website,
        contacts: data.contacts,
        properties: {
          entities: data,
        },
        item_scraped_count: data.length,
      };
      fs.writeFile('./results_/19.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
