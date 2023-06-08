
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const scrapInfo = {
    store_url: `http://www.osdrug.com/sub1.htm`,
    ajax_url: `http://www.osdrug.com/sub1.htm`,
    website: `http://www.osdrug.com`,
    name: `osdrug`,
    POI_Category: `Drugstore or Pharmacy`,
  };

const fetchSource = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(`./scrap_refer_new/1.tmp.json`, 'utf8', (err, data) => {
        if (err) throw err;
        console.log('start a fetching: %s', scrapInfo.store_url);
        const postTitles = [];
        const $ = cheerio.load(data);
        $('table tbody').each((_idx, el) => {
            var init_txt = $(el).find('tr:nth-child(2)').text();
           if(init_txt !==""){
            const init_array = init_txt.split("\n");
            var results = [];
            var location = "", phones = "", fax="", openingHours="", station="";
            for(var k = 0 ; k<init_array.length ; k++)
            {
                results.push(init_array[k].trim());
            }
            for(var i = 0 ; i<results.length ; i++)
            {
                if(results[i].startsWith("Tel") || results[i].startsWith("Ｔel"))
                   phones=results[i];
                if(results[i].startsWith("Fax"))
                   fax = results[i];
                if(results[i].includes(":","～"))
                  openingHours = results[i];
                if(results[i].endsWith("分"))
                  station += results[i] + ",";
               
            }
            var name = $(el).find("tr").first().find("td").last().find("font").text().trim();
            var city = $(el).find("tr").last().find("td").last().text().split("\n");

            for(var j=0; j<city.length ; j++)
            {              
                if(city[j].trim() !="" && city[j].trim() != " ")
                {location = city[j].trim();
                    break;
                }               
            }

        postTitles.push({          
            name,
             "add:location" : location,
             phones,
             fax,
            "addr:opening-hours": openingHours,
             "addr:from-station" : station
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
      fs.writeFile('./results_/1.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
