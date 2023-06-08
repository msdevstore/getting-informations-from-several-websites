
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://www2.toysrus.co.jp/storeinfo/?q=&lang=en`,
    ajax_url: `https://www2.toysrus.co.jp/storeinfo/?q=&lang=en`,
    website: `https://www2.toysrus.co.jp`,
    name: `TOYSRUS BABIESRUS`,
    POI_Category: `Toy Store`,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {

      axios.get(scrapInfo.ajax_url)
      .then(res => {
      // fs.readFile(`./scrap_refer_new/1.tmp.json`, 'utf8', (err, data) => {
      //   if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);
        const postTitles = [];
        const $ = cheerio.load(res.data);
          $('script').each((_idx, el) => {
       var   init_text = $(el).text();
       var slug=[], name=[], type=[], postal_code=[], address=[], phone_number=[], opening=[];
       if(init_text.match("dataList"))
       {
        var split1 = init_text.split("\n");
        for(var k =0;k<split1.length ; k++){
          if(split1[k].match("slug"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
            slug.push(new2)
          }
          if(split1[k].match("name"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
            name.push(new2)
          }
          if(split1[k].match("type"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
            type.push(new2)
          }
          if(split1[k].match("postal_code"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
           postal_code.push(new2)
          }
          if(split1[k].match("address"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
           address.push(new2)
          }
          if(split1[k].match("phone_number"))
          {
            var split2 = split1[k].split(":");
           var new1 = split2[1].replace(/\"/g,"");
           var new2 =  new1.replace(",","");
           phone_number.push(new2)
          }
          if(split1[k].match("hours"))
          {
            var split2 = split1[k].split(":");
            var newjoin = "";
            for(var j=1 ;j<split2.length-1;j++)
              newjoin += split2[j] + ":";
              newjoin += split2[split2.length-1];
           var new1 = newjoin.replace(/\"/g,"");
           var new2 =  new1.replace(",","");
           opening.push(new2)
          }
           
        }
        
        for(var i=0;i<name.length;i++)
        postTitles.push({          
          "name":name[i],
          "type" : type[i],
          "slug" : slug[i],
          "postal_code" : postal_code[i],
          "address" : address[i],
          "phone" : phone_number[i],
          "opening" : opening[i]
        });
       
       }
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
      fs.writeFile('./results_/4.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
