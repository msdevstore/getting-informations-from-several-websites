import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import convert from 'xml-js';

const scrapInfo = {
  store_url: `http://singapore-companies-directory.com/Categories/singapore_trading_list_t.htm`,
  ajax_url: `http://singapore-companies-directory.com/Database/singapore_companies_directory_`,
  per_letter_num : [90,49,106,41,54,41,48,63,38,32,53,63,73,40,23,65,5,37,148,101,19,19,39,1,1,1],
  start_letter : ["a","b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  website: `http://singapore-companies-directory.com`,
  name: `generic`,
  POI_Category: ``,
};

const fetchSource = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const postTitles = [];
      for(var k=0;k<26; k++)
         for(var i=1;i<= scrapInfo.per_letter_num[k]; i++)
          await axios.get(scrapInfo.ajax_url + scrapInfo.start_letter[k] + i +".htm")
            .then(res => {
                const $ = cheerio.load(res.data);  
                
                if(k == 0 || k== 1 || k==2 || k==14 || k==18)
                {
                  $('#table16 tbody tr').find("td:nth-child(2)").find("font").find("a").each((_idx, el) => {
                    var companies_name = $(el).text().replace(/\n/g,"").replace(/\t/g,"").trim();
                    var profile_link = $(el).attr('href').replace("../","http://singapore-companies-directory.com/").trim();
  
                    postTitles.push({   
                      companies_name,
                      profile_link 
                    });
                  });
                  $('#table16 tbody tr').find("td:nth-child(4)").find("font").find("a").each((_idx, el) => {
                    var companies_name = $(el).text().replace(/\n/g,"").replace(/\t/g,"").trim();
                    var profile_link = $(el).attr('href').replace("../","http://singapore-companies-directory.com/").trim();
  
                    postTitles.push({   
                      companies_name,
                      profile_link 
                    });
                  }); 
                }
                else{
                  $('#table16 tbody tr').find("td:nth-child(2)").find("font").each((_idx, el) => {
                    var companies_name_init = $(el).text().trim().split("\n");

                    for(var j=0;j<companies_name_init.length;j++)
                    postTitles.push({   
                      "companies_name" : companies_name_init[j].trim()
                    });
                  });
                  $('#table16 tbody tr').find("td:nth-child(4)").find("font").each((_idx, el) => {
                    var companies_name_init = $(el).text().trim().split("\n");
  
                    for(var j=0;j<companies_name_init.length;j++)
                    postTitles.push({   
                      "companies_name" : companies_name_init[j].trim()
                    });
                  }); 
                }

       
            });
        resolve(postTitles);   
    } catch (error) {
      reject();
      throw error;
    }
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
      };
      fs.writeFile('./results_/25.json', JSON.stringify(resData, null, 2), 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
