import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
const puppeteer = require('puppeteer')

const scrapInfo = {
  store_url: `https://www.vinamilk.com.vn/en/distribution/domestic-market`,
  ajax_url: `https://www.vinamilk.com.vn/en/distribution/domestic-market`,
  website: `https://www.vinamilk.com.vn/en/distribution/domestic-market`,
  name: `VINAMILK STORE`,
  POI_Category: ``,
};

const fetchSource = () => {
    return new Promise( async (resolve,reject) => {
    try {
        const browser = await puppeteer.launch({})
        const page = await browser.newPage()
        await page.goto(scrapInfo.website)
        var result = await page.evaluate(() => {
            const contacts = []
            const entities = []
            var infos = document.querySelectorAll('.address_tt_1');
            infos.forEach(el => {
                let name = '', address='', phone='', print_='', mail='', web='';

                name = el.getElementsByTagName('h1')[0].innerText
                address = el.getElementsByTagName('p')[0].innerText
                phone = el.getElementsByClassName('telephone').length?el.getElementsByClassName('telephone')[0].innerText:''
                print_ = el.getElementsByClassName('print').length?el.getElementsByClassName('print')[0].innerText:''
                mail = el.getElementsByClassName('mail').length?el.getElementsByClassName('mail')[0].innerText:''
                web = el.getElementsByClassName('web').length?el.getElementsByClassName('web')[0].innerText:''
                contacts.push({
                    name,
                    address,
                    phone,
                    print:print_,
                    mail,
                    web
                })
            })
            
            var items =  document.querySelectorAll('.wrap_shops .all_address')
            items.forEach(el => {
                var data = el.querySelectorAll('td') 
                entities.push({
                    area: data[1].innerText,
                    address: data[2].innerText,
                    district: data[3].innerText,
                    phone: data[4].innerText,
                })
            });
            return {
                contacts,
                entities
            }
        })
        console.log(result)
        browser.close()
        resolve(result)
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
          entities: data.entities,
        },
        item_scraped_count: data.length,
      };
      fs.writeFile('./results_/20.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
