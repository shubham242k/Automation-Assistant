function playSong(browser,input){
    return new Promise(async function(resolve,reject){
        let data = "";
        try{
            
            let newPage = await browser.newPage();
            let link = 'https://wynk.in/music';
            data = input.split("play ").pop();
            await newPage.goto(link);
            await newPage.type('[type="search"]',data);
            await newPage.keyboard.press("Enter");
            await closePopup(newPage);
            await newPage.keyboard.press("Enter");
            await newPage.waitForSelector('#SONG');
            await newPage.evaluate(function(){
                let button = document.querySelector("#SONG li .icon-ic_global_play_dark");
                button.click();
            });
            resolve(true);
        }catch(error){
            console.log(error);
            console.log(data +" not available");
            reject(error);

        }
    })
}

function closePopup(newPage){
    return new Promise(async function(resolve,reject){
        try{
            await newPage.waitForSelector(".registration-wrap.row",{timeout:10000});
            await newPage.click(".p-5.position-relative > button");
            resolve();
        }
        catch(error){
            resolve();
        }
        
    })
}


async function pauseSong(browser,tab){
    return new Promise(async function(resolve,reject){
        try{
            let pages = await browser.pages();
            let stat = await pages[tab].evaluate(function(){
                let tag = document.querySelector('span.splay').click();
                if(tag.querySelector("button").getAttribute("title") == 'Pause'){
                    tag.querySelector("button > i").click();
                    return true;
                }else{
                    return false;
                }
            });
            resolve(stat);
        }catch(error){
            console.log(error);
        }
    });
    
}

async function resumeSong(browser,tab){
    return new Promise(async function(resolve,reject){
        try{
            let pages = await browser.pages();
            let stat = await pages[tab].evaluate(function(){
                let tag = document.querySelector('span.splay').click();
                if(tag.querySelector("button").getAttribute("title") == 'Play'){
                    tag.querySelector("button > i").click();
                }else{
                    return false;
                }
                return true;
            });
            resolve(stat);
        }catch(error){
            console.log(error);
        }
    });
    
}

async function stopAllSongs(browser,tab){
    return new Promise(async function(resolve,reject){
        try{
            let pages = await browser.pages();
            await pages[tab].close();
            resolve(true);
        }catch(error){
            console.log(error);
        }
    });
}

module.exports = {playSong,pauseSong,resumeSong,stopAllSongs};