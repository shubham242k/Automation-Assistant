let input = "get direction delhi to mumbai";
let data = input.split("get direction ").pop();
            let source = data.split(" to ")[0];
            let destination =  data.split(" to ")[1];
            console.log(source);
            console.log(destination);