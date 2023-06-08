import axios from 'axios';
import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `http://csdl.vietnamtourism.gov.vn/dnlh`,
  ajax_url: ``,
  website: `http://csdl.vietnamtourism.gov.vn`,
  name: `business travel`,
  POI_Category: ``,
};

let categoryIndex = 0;
let responseData = [];


const fetchSource = async () => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
    });

    const fetchData = () => {
      const doWork = async () => {
        try{
        const page = await browser.newPage()
        await page.goto(          
          scrapInfo.store_url+'?page='+categoryIndex,
          {
            waitUntil: 'load',
            timeout: 0,
          }
        )
        await page.waitForSelector('.verticle-listing-caption', {timeout: 0});
        let result = await page.evaluate(()=>{
            let phoneRegex=/^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
            let emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            let urlRegex=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            let locationRegex=/[A-Za-z0-9'\.\,]/

            var next=document.querySelector('a[rel="next"]');
            let items = document.querySelectorAll('.verticleilist');
            var rdata = [];
            items.forEach(item=>{
            var str=item.innerText;
            var arrdata=str.split('\n').map(record=>{
                record=record.trim();
                return record.indexOf(':')?record.split(':').map(item=>item.trim()): record;
                });
            var name='', en_name='', agency='Công ty lữ hành nội địa', license_number='', addr='',phone='',email='',website='';
            arrdata.forEach(data => {
                if(data[0]=='')return;
                if(data.length==1){
                    if(emailRegex.test(data[0]))
                        email=data[0]
                    else if(phoneRegex.test(data[0]))
                        phone=data[0]
                    else if(urlRegex.test(data[0]))
                        website=data[0]
                    else if(locationRegex.test(data[0]))
                        addr=data[0]
                    else
                        agency=data[0]
                }
                if(data.length==2){
                switch(data[0]){
                    case 'Tên tiếng Việt':
                        name=data[1];
                        break;
                    case 'Tên tiếng Anh':
                        en_name=data[1];
                        break;
                    case 'Số giấy phép':
                        license_number=data[1];
                        break;
                }
                }
            });
            rdata.push({
                name,
                en_name,
                license_number,
                agency,
                addr,
                phone,
                email,
                website
            })
            });
            var result={}
            result.data=rdata
            result.next=next?true:false
            return result
        })
        responseData=responseData.concat(result.data)
        categoryIndex = categoryIndex + 1
        await page.close()
        if(result.next)
        {
          return doWork();
        }else{
          await browser.close();
          return resolve(responseData);
        }
        }catch(err){
          console.log(err)
          return reject(err)    
        }
      }
      return doWork(); 
    }
    return fetchData();
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
      fs.writeFile('./results_/28.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};


