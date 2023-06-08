
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://phongtap.25fit.net/vi/studio-25fit`,
    ajax_url: `https://phongtap.25fit.net/vi/studio-25fit`,
    website: `https://phongtap.25fit.net`,
    name: `studio-25fit`,
    POI_Category: ``,
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

            $('span#hs_cos_wrapper_module_151811938048045_').each((_idx, el) => {
              if($(el).text() !="")
              {
              
              var   init_text = $(el).text();

           var split1 = init_text.split("\n");
           var slice = split1.slice(2);

           for(var k = 0;k<slice.length;k++){

            if(slice[k].match(":")&& slice[k].trim().startsWith("25 FIT"))
             {var divider = slice[k].split(":");
            
              var name = divider[0];
               var description = divider[1];

             postTitles.push({          
              name,
              description
             });
            }
           }
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
      fs.writeFile('./results_/10.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
