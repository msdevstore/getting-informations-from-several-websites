
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';

const scrapInfo = {
    store_url: `https://maps.skymapglobal.vn/api/search-places?search=&key=v69LyQEXxKPqdhiRnsvt6eeSCS48Pc-Dpu1VA22cQTq730R-vmdtz_4UiL6ZYCmn`,
    ajax_url: `https://maps.skymapglobal.vn/api/search-places?search=&key=v69LyQEXxKPqdhiRnsvt6eeSCS48Pc-Dpu1VA22cQTq730R-vmdtz_4UiL6ZYCmn`,
    website: `https://maps.skymapglobal.vn/`,
    name: `viettelstore`,
    POI_Category: ``,
  };

  const fetchSource = () => {
    return new Promise((resolve, reject) => {
      try {
          axios.get(scrapInfo.ajax_url)
          .then(res => {
            console.log('start a fetching: %s', scrapInfo.store_url);
            // const resJson = convert.xml2js(res.data, {compact: true, spaces: 2});
           
           const postTitles = [];
           var result = res.data.data;

           
           for(var k=0;k<result.length;k++)
            {
  
              postTitles.push({          
                "name":result[k].name,
                "code" : result[k].code,
                "address" : result[k].address,
                "opening-times" : result[k].workTimes,
                "latitude" : result[k].lat,
                "longitude" : result[k].lng           
              });
            }
  
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
        fs.writeFile('./results_/9.json', JSON.stringify(resData, null, 2), 'utf8', () => {
          console.log('saved json file')
        });
      })
      .catch();
  };
  
  export const scraperModule = {
    processFetch
  };
  