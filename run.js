const chromeExeFilePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const pup = require("puppeteer");
const readLine = require("readline");
//creating readline interface
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "assistant ~ ",
});

let music = require("./music.js");
let test = require("./test.js");
let map = require("./direction.js");
//songInfo will contains the information that will help to play, pause, resume and stop the song in the same tab
let songInfo = {
    songTabIndex : -1,
    isPlaying : false,
};


//launching browser
(async function(){
    let executablePath = chromeExeFilePath;
    let browser = await pup.launch({
        executablePath,
        headless:false,
        slowMo:100,
        defaultViewport:null,
        args:["--start-maximized"],
    });

    //creating promt and taking actions on the input
    rl.prompt();
    rl.on("line",async function(input){
        //to play new song
        if(input.includes("play")){
            songInfo.songTabIndex = await findTab("wynk.in/music");
            if(songInfo.songTabIndex == -1){
                let successStat = await music.playSong(browser,input);
                songInfo.isPlaying = successStat;
                songInfo.songTabIndex =  (successStat == false)? -1 : await findTab("wynk.in/music");
            }else{
                let successStat = await music.playAnotherSong(browser,input,songInfo.songTabIndex);
                songInfo.isPlaying = successStat;
            }
            
        
        }
        //pause the already playing song in the same tab
        else if(input.includes("pause")){
            songInfo.songTabIndex = await findTab("wynk.in/music");
            if(songInfo.songTabIndex == -1 || !songInfo.isPlaying){
                console.log("No song is being played")
            }else{
                let pauseStatus = await music.pauseSong(browser,songInfo.songTabIndex);
                if(pauseStatus){
                    songInfo.isPlaying = false;
                }else{
                    console.log("Some issues had occured in pausing");
                }
            }
        
        }
        //resuming the already playing song in the same tab
        else if(input.includes("resume")){
            songInfo.songTabIndex = await findTab("wynk.in/music");
            if(songInfo.songTabIndex == -1 || songInfo.isPlaying){
                console.log("Song is already resumed")
            }else{
                let resumeStatus = await music.resumeSong(browser,songInfo.songTabIndex);
                if(resumeStatus){
                    songInfo.isPlaying = true;
                }else{
                    console.log("Some issues had occured in resuming");
                }
                
            }
        
        }
        //stops the song which is currently playing and close the music tab;
        else if(input.includes("stop")){
            songInfo.songTabIndex = await findTab("wynk.in/music");
            if(songInfo.songTabIndex != -1){
                let stopStatus = await music.stopSong(browser,songInfo.songTabIndex);
                if(stopStatus){
                    songInfo.songTabIndex = -1;
                    songInfo.isPlaying = false;
                }else{
                    console.log("Operation failesd, TRY AGAIN");
                }
            }
            
            
        }
        //create test on leetcode
        else if(input.includes("create")){
            await test.createTest(browser);
        }
        //open map and get you direction between source and destination
        else if(input.includes("get direction")){
            let idx= await findTab("maps");
            if(idx == -1){
                map.getDirection(browser,input);
            }
            console.log(idx);
        }
        //change destination 
        else if(input.includes("change destination")){
            let idx = await findTab("maps");
            if(idx != -1){
                await map.changeDestination(browser,idx,input);
            }else{
                console.log("No direction is loaded");
            }
           
        }
        //add stops in the map 
        else if(input.includes("add destination")){
            let idx = await findTab("maps");
            if(idx != -1){
                await map.addDestination(browser,idx,input);
            }else{
                console.log("cant add stop to empty map");
            }
           console.log(idx);
        }
        //remove location 
        else if(input.includes("remove location")){
            let idx = await findTab("maps");
            if(idx != -1){
                let result = await map.removeLocation(browser,idx,input);
                console.log(result);
            }else{
                console.log("cant add stop to empty map");
            }
           console.log(idx);
        }
        //open browser
        else if(input.includes("open")){
            browser = await pup.launch({
                executablePath,
                headless:false,
                slowMo:100,
                defaultViewport:null,
                args:["--start-maximized"],
            });
        }
        //close browser (not recommended while some operation is running)
        else if(input.includes("close")){
            browser.close();
        }
        else{
            console.log('assistant does not support "' + input + '" command');
        }
        
        // console.log(mapInfo);
        rl.prompt();

    })
async function findTab(link){
    return new Promise(async function(resolve,reject){
        let pages = await browser.pages();
        console.log(pages.length);
        for (let i = 0; i < pages.length; i++) {
            if(pages[i].url().includes(link)) resolve(i);
        }
        resolve(-1);
    })
}
})();



