
// import * as cheerio from 'cheerio';
// import * as fs from 'fs';
// import axios from 'axios';

// const scrapInfo = {
//     store_url: `https://store.united-arrows.co.jp/brand/ua/storelocator/`,
//     ajax_url:[ `uyr`,`umu`,`udtw`,'unb','urp','usj','uft','uhj', 'usys', 'usy','dst','uaew','uib','uibw','uksjw','utk','uom','ukw','uyh','usyw',  'usp','uak','usd','uni','ukz','ung','unge',
//     'ukt','uss','ulow','unbp','uosm','udkw','udkm','uks','uhs','ufo','ukm','uot','uataipei','uataipei2','uataipei3'],
//     website: `https://store.united-arrows.co.jp/brand/ua/storelocator/`,
//     name: `UNITED ARROWS`,
//     POI_Category: `Clothing and Accessories`,
//   };

// const fetchSource = () => {
//   return new Promise(async(resolve, reject) => {
//     try {
//       console.log('start a fetching: %s', scrapInfo.store_url);
//       const postTitles = [];
      
//          for(var k=0 ; k<scrapInfo.ajax_url.length ;k++)
//      await axios.get( scrapInfo.website+scrapInfo.ajax_url[k]+'.html')
//       .then(res => {       
//         const $ = cheerio.load(res.data);
//        var el = $('.max-w-2xl');
//        var  name="", address="", phone_number='', fax="", opening=[];
//           name = $(el).find("p").first().text();

//           var address_init = $(el).find("dl:nth-child(2)").find("dd").first().text();
//           var addr_split = address_init.split("\n");
//           for(var add = 0 ;add < addr_split.length ;add++)
//             if(addr_split[add].trim() !="" && addr_split[add].trim() !=" " )
//              address += addr_split[add].trim()+", ";
          
//          var phone_init = $(el).find("dl:nth-child(3)").find("dd").first().text();
//          var phone_split = phone_init.split("\n");
//           for(var phon = 0 ;phon < phone_split.length ;phon++)
//             if(phone_split[phon].trim() !="" && phone_split[phon].trim() !=" " )
//             phone_number += phone_split[phon].trim()+", ";

//         var fax_init = $(el).find("dl:nth-child(4)").find("dd").first().text();
//         var fax_split = fax_init.split("\n");
//           for(var phon = 0 ;phon < fax_split.length ;phon++)
//             if(fax_split[phon].trim() !="" && fax_split[phon].trim() !=" " )
//             fax += fax_split[phon].trim()+", ";

//         var opening_init = $(el).find(".col").first().find("dd").first().text();
//         var opening_split = opening_init.split("\n");
//           for(var phon = 0 ;phon < opening_split.length ;phon++)
//             if(opening_split[phon].trim() !="" && opening_split[phon].trim() !=" " )
//             opening += opening_split[phon].trim()+", ";

//         postTitles.push({          
//           name,
//           address,
//           phone_number,
//           fax,
//           "opening-time" : opening
//         });      
//       })
//       resolve(postTitles)
//     } catch
//       (error) {
//       reject();
//       throw error;
//     }
//   });
// };

// const processFetch = () => {
//   fetchSource()
//     .then((resJson) => {
//       let resData = {
//         type: 'Feature',
//         name: scrapInfo.name,
//         'POI:Category': scrapInfo.POI_Category,
//         store_url: scrapInfo.store_url,
//         website: scrapInfo.website,
//         properties: {
//             attributes: resJson,
//         },
//         item_scraped_count: resJson.length,
//       };
//       fs.writeFile('./results_/30.json', JSON.stringify(resData, null, 2), 'utf8', () => {
//         console.log('saved json file')
//       });
//     })
//     .catch();
// };

// export const scraperModule = {
//   processFetch
// };



const puppeteer = require('puppeteer');
// const openai = require('openai');

// openai.api_key = "youapikey";
// const model_engine = "text-davinci-002";

const user_name = "your email";
const password = "yourpassword";
const keywords = ['Geology'];
const Time = ['hour','day','week','month','year'];

let counter = 0;
let LinkPost = 100;

const processFetch = async () => {



  const browser = await puppeteer.launch({
    headless: false,
    // args: ['--incognito']
  });
  const page = await browser.newPage();
  // await page.goto("https://www.quora.com/?prevent_redirect=1");
  await page.setViewport({ width: 1280, height: 800 });
  var html = await page.evaluate(() => {
     document.body.innerHTML = "<div>fdfdfd</div>";
})
  // await page.evaluate(() => {
  //   document.querySelector("#email").value = user_name;
  //   document.querySelector("#password").value = password;
  //   document.querySelector("#root > div > div.signup_wall_container > div > div > div > div > div > div.signup_wall_form > div.signup_wall_form_content > div.submit_button_container > button").click();
  // });



  // for (const k of keywords) {
  //   await page.goto(`https://www.quora.com/search?q=${k}&time=${Time[3]}&type=question`);
  //   await page.evaluate(() => {
  //       window.scrollTo(0, document.body.scrollHeight);
  //   });
  //   const page_source = await page.content();
  //   const soup = new JSSoup(page_source);
  //   const Questions = soup.findAll("a", { class: "q-box Link___StyledBox-t2xg9c-0 dFkjrQ puppeteer_test_link qu-display--block qu-cursor--pointer qu-hover--textDecoration--underline" });
  //   for (const question of Questions) {
  //     const prompt = question.text + 'give me a 1000 words detailed answer ! ';
  //     const Question_Link = question["href"];
  //     console.log("------The Question------");
  //     console.log(question.text);
  //     if (counter < LinkPost) {
  //       const Twist = " I hope this helps";
  //       counter += 1;
  //     } else {
  //       const Twist = "If you are looking for some free content to learn GIS, Geology and Mining Engineering here is a great YouTube Channel : ";
  //       counter = 0;
  //     }
  //   }
  // }
}

     
       export const scraperModule = {
        processFetch
        };