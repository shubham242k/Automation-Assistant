//function for song, played for first time
async function playSong(browser,input){
    return new Promise(async function(resolve,reject){
        let data = "";
        try{
            
            let newPage = await browser.newPage();
            let link = 'https://wynk.in/music';
            data = input.split("play ").pop();
            await newPage.goto(link);
            searchAndPlay(newPage,data);
            resolve(true);
        }catch(error){
            console.log(error);
            resolve(false);
            // console.log(data +" not available");
            // reject(error);

        }
    })
}

//function for song which is played when already another song is played in same tab
async function playAnotherSong(browser,input,tab){
    return new Promise(async function(resolve,reject){
        try{
            input = input.split("play ").pop();
            let pages = await browser.pages();
            await pages[tab].reload();
            setTimeout(function(){
                searchAndPlay(pages[tab],input);
            },2000);
            resolve(true);
        }catch(error){
            console.log(error);
            resolve(false);
        }
    });
}
//helper function to search and start the song
async function searchAndPlay(page,data){
    return new Promise(async function(resolve,reject){
        try{
            await page.type('[type="search"]',data);
            await page.keyboard.press("Enter");
            await page.keyboard.press("Enter");
            await page.waitForSelector('#SONG');
            await page.evaluate(function(){
                let button = document.querySelector("#SONG li .icon-ic_global_play_dark");
                button.click();
            });
            resolve();
        }catch(err){
            reject(err);
        }
    })
}
//pause the song
async function pauseSong(browser,tab){
    return new Promise(async function(resolve,reject){
        try{
            let pages = await browser.pages();
            let stat = await pages[tab].evaluate(function(){
                let tag = document.querySelector('span.splay');
                if(tag.querySelector("button").getAttribute("title") == 'Pause'){
                    tag.querySelector("button > i").click();
                    
                }
                return true;
            });
            resolve(stat);
        }catch(error){
            console.log(error);
        }
    });
    
}
//resume the song
async function resumeSong(browser,tab){
    return new Promise(async function(resolve,reject){
        try{
            
            let pages = await browser.pages();
            let stat = await pages[tab].evaluate(function(){
                let tag = document.querySelector('span.splay');
                if(tag.querySelector("button").getAttribute("title") == 'Play'){
                    tag.querySelector("button > i").click();
                }
                return true;
            });
            resolve(stat);
        }catch(error){
            console.log(error);
        }
    });
    
}
//stop the song and close the tab
async function stopSong(browser,tab){
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



module.exports = {
    playSong,
    pauseSong,
    resumeSong,
    stopSong,
    playAnotherSong};