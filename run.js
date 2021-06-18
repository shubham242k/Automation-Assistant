const chromeExeFilePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const pup = require("puppeteer");
const readLine = require("readline");
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "assistant ~",
});
let songInfo = {
    musicTab : -1,
    isPlaying : false,
}
let music = require("./music.js");


(async function(){
    let executablePath = chromeExeFilePath;
    let browser = await pup.launch({
        executablePath,
        headless:false,
        slowMo:100,
        defaultViewport:null,
        args:["--start-maximized"],
    });
    rl.prompt();
    
    rl.on("line",async function(input){
        if(input.includes("play") && songInfo.musicTab == -1){

            songInfo.musicTab = await (await browser.pages()).length;
            let success = await music.playSong(browser,input);
            songInfo.isPlaying = success;
            songInfo.musicTab = (success == false)?-1:songInfo.musicTab;
            
        }else if(input.includes("pause")){

            if(songInfo.musicTab == -1 || !songInfo.isPlaying){
                console.log("No song is being played")
            }else{
                let pauseStatus = await music.pauseSong(browser,songInfo.musicTab);
                if(pauseStatus){
                    songInfo.isPlaying = false;
                }else{
                    console.log("Some issues had occured in pausing");
                }
            }

        }else if(input.includes("resume")){

            if(songInfo.musicTab == -1 || songInfo.isPlaying){
                console.log("Song is already resumed")
            }else{
                let resumeStatus = await music.resumeSong(browser,songInfo.musicTab);
                if(resumeStatus){
                    songInfo.isPlaying = true;
                }else{
                    console.log("Some issues had occured in resuming");
                }
                
            }

        }else if(input.includes("stop") && songInfo.musicTab != -1){
            let stopStatus = await music.stopAllSongs(browser,songInfo.musicTab);
            if(stopStatus){
                songInfo.musicTab = -1;
                songInfo.isPlaying = false;
            }else{
                console.log("Operation failesd, TRY AGAIN");
            }
            
        }else{
            console.log('assistant does not support "' + input + '" command');
        }
        
        console.log(songInfo);
        rl.prompt();
    })

})();



