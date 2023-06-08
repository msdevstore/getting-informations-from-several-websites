import axios from 'axios';
import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
  store_url: `http://csdl.vietnamtourism.gov.vn/rest`,
  ajax_url: ``,
  website: `http://csdl.vietnamtourism.gov.vn`,
  name: `Restaurant`,
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
            var next=document.querySelector('a[rel="next"]');
            let items = document.querySelectorAll('.verticleilist');
            var rdata = [];
            items.forEach(item=>{
            var str=item.innerText;
            var arrdata=str.split('\n').map(record=>{
                record=record.trim();
                return record.indexOf(':')?record.split(':').map(item=>item.trim()): record;
                });
            var name='', addr='',phone='',email='',website='';
            arrdata.forEach(data => {
                if(data[0]=='')return;
                if(data.length==1){
                    name=data[0]
                }
                if(data.length==2){
                    switch(data[0]){
                      case 'Địa chỉ':
                        addr=data[1];
                        break;
                      case 'Điện thoại cố định':
                        phone=data[1];
                        break;
                      case 'Email':
                        email=data[1];
                        break;
                    }
                }
                if(data.length==3){
                    website=data[1]+":"+data[2];
                }
            });
            rdata.push({
                name,
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
      fs.writeFile('./results_/27.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};


