import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
const puppeteer = require('puppeteer')

const scrapInfo = {
    store_url: `https://www.sgpbusiness.com/company/Grand-Cruise-Pte-Ltd#Overview`,
    ajax_url: `https://www.sgpbusiness.com/company/Grand-Cruise-Pte-Ltd#Overview`,
    website: `https://www.sgpbusiness.com/company/Grand-Cruise-Pte-Ltd#Overview`,
    name: `sgpbusiness`,
    POI_Category: `generic`,
  };
  const getFreeProxies = require('get-free-https-proxy')

const fetchSource = () => {
    return new Promise( async (resolve,reject) => {
    try {
        const [proxy1] = await getFreeProxies();
        console.log('using proxy', proxy1);

        const browser = await puppeteer.launch({
            product : 'firefox',
              headless: false,
            // args: [
            // `--proxy-server=${proxy1.host}:${proxy1.port}`
            // ]
        })
        const page = await browser.newPage()
        await page.goto(scrapInfo.website,{
            waitUntil: 'load'
            // timeout: 0
        })
        var html = await page.evaluate(() => {
            return document.body.innerHTML
        })
        // fs.readFile(`./scrap_refer/18.ref.txt`, 'utf8', (err, data) => {
        //     if (err) throw err;
            const $ = cheerio.load(html);
            let entities = {
                activity:{
                    principal: [],
                    secondary: [],
                },
                similar:{
                    local: [],
                    other: []
                }
            }
            var el1 = $('#Entities-With-the-Same-Principal-Activity');
            var el2 = $('#Entities-With-the-Same-Secondary-Activity');
            var el3 = $('#Similarly-Named-Entities');
            var el4 = $('#Similarly-Named-Entities').parent().next().children().eq(0);
            
            let d1 = [];
            el1.find('a').each((_idx, el) =>{
                var link = $(el).attr('href')
                var name = $(el).find('.media-body .list-group-item-heading').eq(0).text().trim();
                var content = $(el).find('.media-body .list-group-item-text').eq(0).text().trim();
                d1.push({
                    name,
                    content,
                    link
                })
            })
            let d2 = [];
            el2.find('a').each((_idx, el) =>{
                var link = $(el).attr('href')
                var name = $(el).find('.media-body .list-group-item-heading').eq(0).text().trim();
                var content = $(el).find('.media-body .list-group-item-text').eq(0).text().trim();
                d2.push({
                    name,
                    content,
                    link
                })
            })
            let d3 = [];
            el3.find('a').each((_idx, el) =>{
                var link = $(el).attr('href')
                var name = $(el).find('.media-body .list-group-item-heading').eq(0).text().trim();
                var content = $(el).find('.media-body .list-group-item-text').eq(0).text().trim();
                d3.push({
                    name,
                    content,
                    link
                })
            })
            let d4 = [];
            el4.find('a').each((_idx, el) =>{
                var link = $(el).attr('href')
                var name = $(el).find('.media-body .list-group-item-heading').eq(0).text().trim();
                d4.push({
                    name,
                    link
                })
            })
            console.log(d1)
            console.log(d2)
            console.log(d3)
            console.log(d4)
            entities.activity.principal=d1
            entities.activity.secondary=d2
            entities.similar.local=d3
            entities.similar.other=d4
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
      fs.writeFile('./results_/18.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
