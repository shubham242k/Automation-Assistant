let fs = require("fs");
let problemLinks = [1,2,3,4,5,0,6,7];
fs.writeFileSync("abc.file",JSON.stringify(problemLinks));