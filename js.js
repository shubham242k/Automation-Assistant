let input = "add event work car today 2am";
let data = input.split("add event ").pop().split(" ");
            let time = data.pop();
            let day = data.pop();
            let work = data.join(" ");

console.log(time);
console.log(day);
console.log(work);