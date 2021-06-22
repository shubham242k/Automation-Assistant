async function connect(browser,input,email,password){
    return new Promise(async function(resolve,reject){
        try{
            let data = input.split("connect with ").shift();
            let page = await browser.newPage();
            await page.goto("https://www.linkedin.com");
            await page.type("#session_key",email);
            await page.type("#session_password",password);
            await Promise.all([
                page.click('[type="submit"]'),
                pag.waitForNavigation()
            ]);
            await page.click(".always-show-placeholder");
            await page.keyboard.type(data);
        }catch{
            console.log(err);
            reject(err)
        }
    })
}