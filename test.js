async function createTest(browser){
    return new Promise(async function(resolve,reject){
        try{
            let page = await browser.newPage();
            await page.goto("https://leetcode.com/problemset/all/");
            let randomLink = await page.evaluate(function(){
                let link = document.querySelector(".btn.btn-default.btn-md").getAttribute("href");
                return "https://leetcode.com" + link;
            });
            
            let problemLevel = {
                Easy : 0,
                Medium : 0,
                Hard : 0,
                total : 0
            }
            let problemLinks = [];
            //until the all the valid ques get fetch(4 ques in this case), this loop will run
            while(problemLevel.total <= 4){
                let quesLink = await fetchProblem(browser,randomLink,problemLevel);
                if(quesLink != undefined)
                    problemLinks.push(quesLink);
            }
            resolve(true);
        }catch(err){
            reject(err);
        }
    })
}
//for every ques this function will run and helps to determine wether the ques is valid
//validity here is defined as the like percentage of the problem which should be greater than 
// 60%a and the there should be all type of ques(easy, medium, hard)
async function fetchProblem(browser,randomLink,problemLevel){
    return new Promise(async function(resolve,reject){
        try{
            let npage = await browser.newPage();
            await npage.goto(randomLink);
            await npage.waitForSelector(".css-10o4wqw");
            let problemDetails = await npage.evaluate(async function(){
                
                let box = document.querySelector(".css-10o4wqw");   
                let levelTag = box.querySelector("div");
                let level = levelTag.innerText;
                let info = box.querySelectorAll("button");
                
                let likes = Number(info[0].innerText);
                let dislikes = Number(info[1].innerText);
                let famous = (likes/(likes + dislikes)) * 100;

                return {level,famous};
            });
            //if valid the problem tab will open and if not problem tab will close
            if(problemDetails.famous >= 60.0 && problemLevel[problemDetails.level] < 2){
                let link = await npage.url();
                problemLevel[problemDetails.level]++;
                problemLevel.total++;
                
                resolve(link);
            }else{
                await npage.close();
                resolve();
            }
            
        }catch(err){
            reject(err);
            console.log(err);
            
        }
    });
    

}

module.exports = {
    createTest
}