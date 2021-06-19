const chromeExeFilePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const pup = require("puppeteer");
const readLine = require("readline");
//creating readline interface
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "assistant ~",
});

let music = require("./music.js");
let test = require("./test.js");
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
            if(songInfo.songTabIndex == -1){
                let successStat = await music.playSong(browser,input);
                songInfo.isPlaying = successStat;
                songInfo.songTabIndex =  (successStat == false)? -1 : (await browser.pages()).length-1;
            }else{
                let successStat = await music.playAnotherSong(browser,input,songInfo.songTabIndex);
                songInfo.isPlaying = successStat;
            }
            
        
        }
        //pause the already playing song in the same tab
        else if(input.includes("pause")){
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
        else if(input.includes("stop") && songInfo.songTabIndex != -1){
            let stopStatus = await music.stopSong(browser,songInfo.songTabIndex);
            if(stopStatus){
                songInfo.songTabIndex = -1;
                songInfo.isPlaying = false;
            }else{
                console.log("Operation failesd, TRY AGAIN");
            }
            
        }
        //create test on leetcode
        else if(input.includes("create")){
            test.createTest(browser);
        }

        else if(input.includes("close")){
            rl.close();
        }
        else{
            console.log('assistant does not support "' + input + '" command');
        }
        
        console.log(songInfo);
        rl.prompt();

    })

})();



