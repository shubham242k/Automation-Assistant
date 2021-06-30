const chromeExeFilePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const pup = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin());

// const readLine = require("readline");
// const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: "assistant ~ ",
// });

let music = require("../files/music.js");
let test = require("../files/test.js");
let map = require("../files/direction.js");
let calendar = require("../files/calendar.js");
const { linkSync } = require("fs");
//songInfo will contains the information that will help to play, pause, resume and stop the song in the same tab
let songInfo = {
    songTabIndex : -1,
    isPlaying : false,
};

let email = "shubhamraju441@gmail.com";
let password = "greatestofalltime";
//launching browser
(async function(){
    let executablePath = chromeExeFilePath;
    let browser = await pup.launch({
        executablePath,
        headless:false,
        slowMo:100,
        defaultViewport:null,
        args:[
            '--start-maximized'
        ]
    });

    //creating promt and taking actions on the input
    let npage = await browser.pages();
    
    await npage[0].goto("file://E:/Hackathon/Automation-Hackathon/content.html");
    let context = await browser.defaultBrowserContext();
    await context.overridePermissions(
        "file://E:/Hackathon/Automation-Hackathon/content.html", ["microphone", "camera", "notifications"]
    );
    npage[0].exposeFunction('puppeteerMutationListener', puppeteerMutationListener);
    npage[0].focus
    await npage[0].evaluate(async function(){
        const target = document.querySelector("ol");
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(async function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let l = mutation.addedNodes[0].textContent;
                    let input = l.split("~").pop();
                    let result = await puppeteerMutationListener(input);
                    if(input.includes("create test") && result.length>0){
                        mutation.addedNodes[0].style.color = '#18af70';
                        let links = result;
                        let li = document.createElement("li");
                        for(let i = 0;i<links.length;i++){
                            li.innerText += links[i] + '\n';
                            li.style.color = "#18af70"
                            li.className = "output";
                            target.append(li);
                        }
                        
                    }else if(result == false){
                        mutation.addedNodes[0].style.color = 'red';
                    }else{
                        mutation.addedNodes[0].style.color = '#18af70';
                    }
                    
                }
            }
        });
        observer.observe(target, config);
    });
    async function puppeteerMutationListener(input) {
        let ml = await task(input);
        return ml;
    }

    async function task(input){
        return new Promise(async function(resolve,reject){
            try{
                let result = false;
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
                    result = true;
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
                            result = true;
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
                            result = true;
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
                            result = true;
                        }else{
                            console.log("Operation failesd, TRY AGAIN");
                        }
                    }
                    
                    
                }
                //create test on leetcode
                else if(input.includes("create test")){
                   result = await test.createTest(browser,input);
                }
                //open map and get you direction between source and destination
                else if(input.includes("get direction")){
                    let idx= await findTab("maps");
                    if(idx == -1){
                         map.getDirection(browser,input);
                    }
                    result = true;
                    console.log(idx);
                }
                //change destination 
                else if(input.includes("change destination")){
                    let idx = await findTab("maps");
                    if(idx != -1){
                     map.changeDestination(browser,idx,input);
                     result = true;
                    }else{
                        console.log("No direction is loaded");
                    }
                   
                }
                //add stops in the map 
                else if(input.includes("add destination")){
                    let idx = await findTab("maps");
                    if(idx != -1){
                        result = await map.addDestination(browser,idx,input);
                    }else{
                        console.log("cant add stop to empty map");
                    }
                   console.log(idx);
                }
                //remove location 
                else if(input.includes("remove location")){
                    let idx = await findTab("maps");
                    if(idx != -1){
                        result = await map.removeLocation(browser,idx,input);
                    }else{
                        console.log("cant add stop to empty map");
                    }
                }
                //add task to the calendar(just for current day)
                else if(input.includes("add task")){
                    let idx = await findTab("calendar");
                    if(idx == -1){
                        result = await calendar.addEvent(browser,email,password,input);
                    }else{
                       result = await calendar.addOtherEvent(browser,input,idx);
                    }
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
                    result = true;
                }
                //close browser (not recommended while some operation is running)
                else if(input.includes("close")){
                    browser.close();
                }else if(input.includes("https:")){
                    result = true;
                }
                //wrong command
                else{
                    console.log('assistant does not support "' + input + '" command');
                }
    
                resolve(result);
            }catch(err){
                reject();
            }
        })
        
    } 

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



