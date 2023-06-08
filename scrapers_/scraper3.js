
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://store.united-arrows.co.jp/brand/ua/storelocator/`,
    ajax_url:[ `uyr`,`umu`,`udtw`,'unb','urp','usj','uft','uhj', 'usys', 'usy','dst','uaew','uib','uibw','uksjw','utk','uom','ukw','uyh','usyw',  'usp','uak','usd','uni','ukz','ung','unge',
    'ukt','uss','ulow','unbp','uosm','udkw','udkm','uks','uhs','ufo','ukm','uot','uataipei','uataipei2','uataipei3'],
    website: `https://store.united-arrows.co.jp/brand/ua/storelocator/`,
    name: `UNITED ARROWS`,
    POI_Category: `Clothing and Accessories`,
  };

const fetchSource = () => {
  return new Promise(async(resolve, reject) => {
    try {
      console.log('start a fetching: %s', scrapInfo.store_url);
      const postTitles = [];
      
         for(var k=0 ; k<scrapInfo.ajax_url.length ;k++)
     await axios.get( scrapInfo.website+scrapInfo.ajax_url[k]+'.html')
      .then(res => {       
        const $ = cheerio.load(res.data);
       var el = $('.max-w-2xl');
       var  name="", address="", phone_number='', fax="", opening=[];
          name = $(el).find("p").first().text();

          var address_init = $(el).find("dl:nth-child(2)").find("dd").first().text();
          var addr_split = address_init.split("\n");
          for(var add = 0 ;add < addr_split.length ;add++)
            if(addr_split[add].trim() !="" && addr_split[add].trim() !=" " )
             address += addr_split[add].trim()+", ";
          
         var phone_init = $(el).find("dl:nth-child(3)").find("dd").first().text();
         var phone_split = phone_init.split("\n");
          for(var phon = 0 ;phon < phone_split.length ;phon++)
            if(phone_split[phon].trim() !="" && phone_split[phon].trim() !=" " )
            phone_number += phone_split[phon].trim()+", ";

        var fax_init = $(el).find("dl:nth-child(4)").find("dd").first().text();
        var fax_split = fax_init.split("\n");
          for(var phon = 0 ;phon < fax_split.length ;phon++)
            if(fax_split[phon].trim() !="" && fax_split[phon].trim() !=" " )
            fax += fax_split[phon].trim()+", ";

        var opening_init = $(el).find(".col").first().find("dd").first().text();
        var opening_split = opening_init.split("\n");
          for(var phon = 0 ;phon < opening_split.length ;phon++)
            if(opening_split[phon].trim() !="" && opening_split[phon].trim() !=" " )
            opening += opening_split[phon].trim()+", ";

        postTitles.push({          
          name,
          address,
          phone_number,
          fax,
          "opening-time" : opening
        });      
      })
      resolve(postTitles)
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
      fs.writeFile('./results_/3.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
