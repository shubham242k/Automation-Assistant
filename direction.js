const { listenerCount } = require("events");

async function getDirection(browser,input){
    return new Promise(async function(resolve,reject){
        try{
            let data = input.split("get direction ").pop();
            let source = data.split(" to ")[0];
            let destination =  data.split(" to ")[1];
            let link = 'https://www.google.co.in/maps'

            let page = await browser.newPage();
            await page.goto(link);
            await page.waitForSelector('[aria-label="Directions"]');
            await page.click('[aria-label="Directions"]');
            await page.type("#directions-searchbox-0 input",source);
            await page.type("#directions-searchbox-1 input",destination);
            await page.keyboard.press("Enter");
            await page.click('[aria-label="Driving"]');
            resolve(true);
        }catch(err){
            console.log(err);
            resolve(false);
            
        }
    })
}
async function changeDestination(browser,tab,input){
    return new Promise(async function(resolve,reject){
        let data = input.split("change destination ").pop();
        let pages = await browser.pages();
        await pages[tab].click('div.widget-directions-searchboxes > div:last-child');
        await pages[tab].keyboard.down("Control");
        await pages[tab].keyboard.press("KeyA");
        await pages[tab].keyboard.press("KeyX");
        await pages[tab].keyboard.up("Control");
        await pages[tab].type('div.widget-directions-searchboxes > div:last-child',data);
        await pages[tab].keyboard.press("Enter");
        resolve();
    })

}
async function addDestination(browser,tab,input){
    return new Promise(async function(resolve,reject){
        let data = input.split("add destination ").pop();
        let pages = await browser.pages();
        await pages[tab].click('[data-tooltip=" Add destination "]');
        await pages[tab].type('[placeholder="Choose destination, or click on the map..."]',data);
        await pages[tab].keyboard.press("Enter");
        resolve();
    })
    
}

async function removeLocation(browser,tab,input){
    return new Promise(async function(resolve,reject){
        let data = input.split("remove location ").pop();
        let pages = await browser.pages();
        let existAt = await pages[tab].evaluate(function(data){
            let box = document.querySelectorAll('div.widget-directions-searchboxes > div');
            if(box.length <= 2){
                return -2;
            }
            for(let i = 1;i<box.length;i++){
                let loc = box[i].querySelector("input").getAttribute("aria-label")
                                .split("Destination ").pop();
                
                if(loc.toLowerCase().includes(data.toLowerCase())){
                    return i+1;
                }
            }
            return -1;
        },data)
        if(existAt == -1){
            resolve("No such location");
        }else if(existAt == -2){
            resolve("cant remove last destination");
        }
        else{
            await pages[tab].click("div.widget-directions-searchboxes > div:nth-child("+existAt+") .widget-directions-icon.remove-waypoint");
            resolve("done");
        }
        
    });
}
module.exports = {
    getDirection,
    addDestination,
    removeLocation,
    changeDestination
}