const https = require('https');
const forEachPromise = require('./so-code/forEachPromise')

module.exports = {
  getGamePlatforms
}

/**
 * Outputs array of a games valid platforms based on appid
 * @param {*} appIDs list of app ids used in the steam URL query
 * @param {*} output output to console bool
 */
function getGamePlatforms(appIDs, output = false) {
  
  return new Promise((resolve, reject) => {    
    const result = [];
    forEachPromise.forEachPromise(appIDs, doScrape, {result, output}).then(() => {
      resolve(result);
    })
  })
}


function doScrape(appID, context) {
  
  return new Promise((resolve, reject) => {

    const options = {
      hostname: 'store.steampowered.com',
      port: 443,
      method: 'GET'
    }    
    if (!appID) return;
  
    options.path = `/api/appdetails?appids=${appID}`;  

    const req = https.request(options, res => {

      // Build response body in a string
      var resBody = '';

      // Listen for data and add
      res.on('data', chunk => {
        resBody += chunk
      });

      res.on('end', () => {
        const appResponse = JSON.parse(resBody);
        for (var appID in appResponse) {
          const appDetails = appResponse[appID];

          const appDetailsObject = {};
          appDetailsObject.name = appDetails?.data?.name;
          appDetailsObject.windows = appDetails?.data ?.platforms?.windows;
          appDetailsObject.mac = appDetails?.data?.platforms?.mac;
          appDetailsObject.linux = appDetails?.data?.platforms?.linux;

          
          if(context.output) {
            console.log(appDetailsObject);
          }

          context.result.push(appDetailsObject);
          resolve(appDetailsObject);
        }
      })
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  })
}
