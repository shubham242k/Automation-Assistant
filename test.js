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
            while(problemLevel.total <= 4){
                let quesLink = await fetchProblem(browser,randomLink,problemLevel);
                console.log(problemLevel);
                if(quesLink != undefined)
                    problemLinks.push(quesLink);
            }

            console.log(problemLinks);
            resolve();
        }catch(err){
            reject(err);
        }
    })
}

async function fetchProblem(browser,randomLink,problemLevel){
    return new Promise(async function(resolve,reject){
        try{
            let npage = await browser.newPage();
            await npage.goto(randomLink);
            await npage.waitForSelector(".css-10o4wqw");
            let problemDetails = await npage.evaluate(async function(){
                
                console.log("here");
                let box = document.querySelector(".css-10o4wqw");
                console.log(box);
                let levelTag = box.querySelector("div");
                let level = levelTag.innerText;
                let info = box.querySelectorAll("button");
                
                let likes = Number(info[0].innerText);
                let dislikes = Number(info[1].innerText);
                let famous = (likes/(likes + dislikes)) * 100;

                return {level,famous};
            });
            console.log(problemDetails);
            
            if(problemDetails.famous >= 60.0 && problemLevel[problemDetails.level] < 2){
                let link = await npage.url();
                problemLevel[problemDetails.level]++;
                problemLevel.total++;
                
                console.log(link);
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