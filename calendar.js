const randomUseragent = require('random-useragent');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

//input = add event topic date time :
//data = car wash today 2am
async function addEvent(browser,email,password,input){
    return new Promise(async function(resolve,reject){
        try{
            let data = input.split("add task ").pop().split(" ");
            let time = data.pop();
            let work = data.join(" ");
            let page = await browser.newPage();
            await signin(page,email,password,browser);
            await fill(page,time,work);
            
            resolve();
        }catch(err){
            console.log(err);
            reject(err);
        }
    })
}

async function addOtherEvent(browser,input,tab){
    return new Promise(async function(resolve,reject){
        try{
            let data = input.split("add task ").pop().split(" ");
            let time = data.pop();
            let work = data.join(" ");
            let pages = await browser.pages();
            await fill(pages[tab],time,work);
            resolve();
        }catch(err){
            console.log(err);
            reject(err);
        }
    })
}

async function fill(page,time,work){
    return new Promise(async function(resolve,reject){
        await page.click('[aria-label="Create"]');
        await page.waitForSelector('[data-key="startTime"]');
        await page.click('[data-key="startTime"]');
        await page.waitForTimeout(1000);
        await page.keyboard.type(time);
        await page.keyboard.press("Enter");
        await page.click('[aria-controls="tabTask"]');
        await page.type('[aria-label="Add title"]',work);
        await page.click('.uArJ5e.UQuaGc.Y5sE8d.pEVtpe');
        resolve();
    })
}

async function signin(page,email,password,browser){
    return new Promise(async function(resolve,reject){
        try{
            await page.goto("https://www.google.com/calendar");
            await page.type('[type="email"]',email,{delay : 20});
            await Promise.all([
                page.click("#identifierNext"),
                await page.waitForTimeout(3000)
            ])
            
            await page.click("[type='password']");
            await page.keyboard.type(password,{delay : 20});
            await page.waitForSelector("#passwordNext");

            await Promise.all([
                page.waitForNavigation(),
                page.click("#passwordNext")
            ]);
            resolve();
        }catch(err){
            reject(err);
        }
    })
}

// https://www.google.com/calendar

// then(function (page){
//     gpage = page;
//     return page.goto("https://accounts.google.com");

// })
// .then(function(){
//     return mbrowser.defaultBrowserContext();
// })
// .then(function(context){
//    return context.overridePermissions(
//         "https://meet.google.com/", ["microphone", "camera", "notifications"]
//     );
// })
// .then(function(){
//     return gpage.type('input[type="email"]',"shubhamraju441@gmail.com",{delay : 300});
// })
// .then(function(){

//     return Promise.all([
//         gpage.waitForTimeout(3000),
//         gpage.click("#identifierNext")
//     ]);
    
// })
// .then(function(){
//     return gpage.keyboard.type("greatestofalltime",{delay : 200});
 
// })
// .then(function(){
//     return gpage.waitForSelector("#passwordNext");
// })
// .then(function(){
//      console.log("entered password");
//     return Promise.all([
//         gpage.waitForNavigation(),
//         gpage.click("#passwordNext")
//     ]);
    
// })

module.exports = {
    addEvent,
    addOtherEvent
}




// async function createPage (browser,url) {

//     //Randomize User agent or Set a valid one
//     const userAgent = randomUseragent.getRandom();
//     const UA = userAgent || USER_AGENT;
//     const page = await browser.newPage();

//     await page.setUserAgent(UA);
//     await page.setJavaScriptEnabled(true);
//     await page.setDefaultNavigationTimeout(0);
//     await page.goto(url, { waitUntil: 'networkidle2',timeout: 0 } );
//     // Skip images/styles/fonts loading for performance
//     // await page.setRequestInterception(true);
//     // page.on('request', (req) => {
//     //     if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
//     //         req.abort();
//     //     } else {
//     //         req.continue();
//     //     }
//     // });

//     await page.evaluateOnNewDocument(() => {
//         // Pass webdriver check
//         Object.defineProperty(navigator, 'webdriver', {
//             get: () => false,
//         });
//     });

//     await page.evaluateOnNewDocument(() => {
//         // Pass chrome check
//         window.chrome = {
//             runtime: {},
//             // etc.
//         };
//     });

//     await page.evaluateOnNewDocument(() => {
//         //Pass notifications check
//         const originalQuery = window.navigator.permissions.query;
//         return window.navigator.permissions.query = (parameters) => (
//             parameters.name === 'notifications' ?
//                 Promise.resolve({ state: Notification.permission }) :
//                 originalQuery(parameters)
//         );
//     });

//     await page.evaluateOnNewDocument(() => {
//         // Overwrite the `plugins` property to use a custom getter.
//         Object.defineProperty(navigator, 'plugins', {
//             // This just needs to have `length > 0` for the current test,
//             // but we could mock the plugins too if necessary.
//             get: () => [1, 2, 3, 4, 5],
//         });
//     });

//     await page.evaluateOnNewDocument(() => {
//         // Overwrite the `languages` property to use a custom getter.
//         Object.defineProperty(navigator, 'languages', {
//             get: () => ['en-US', 'en'],
//         });
//     });

    
//     return page;
// }

