var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

let input = document.querySelector("input");
let buttonText = document.querySelector(".text");
let buttonVoice = document.querySelector(".speech");
let ol = document.querySelector("ol");
buttonText.addEventListener("click",function(){
    let task = input.value;
    if(task != ''){
        input.value = "";
        let time = new Date().toLocaleTimeString().split(":");
        let atime = time.shift()+ ":" +time.shift();
        let li = document.createElement("li");
        
        let span1 = document.createElement("span");
        span1.className = "time";
        span1.innerText = atime + " ";
        console.log(span1);
        li.append(span1);

        let span2 = document.createElement("span");
        span2.innerText = task.toLowerCase();
        console.log(span2);
        li.append(span2);

        console.log(li);
        ol.append(li);
    }
    
})


function voiceWork(){
    let recognition = new SpeechRecognition();
    recognition.start();
    
    // buttonText.style.backgrounColor("grey");
    // buttonVoice.style.backgrounColor("green");
    

    recognition.onstart = function() {
        input.placeholder = "listening...";
        input.disabled = true;
        disabled = true;
        buttonVoice.disabled = true;
        buttonText.style.backgroundColor = "grey";
        buttonVoice.style.backgroundColor = "#18af70";
        
    };
    
    recognition.onspeechend = function() {
        input.placeholder = "Enter command or use voice recognition"
        input.disabled = false;
        buttonText.disabled = false;
        buttonVoice.disabled = false;
        buttonText.style.backgroundColor = "#E94560";
        buttonVoice.style.backgroundColor = "#E94560";
        recognition.stop();
    }

    recognition.onresult = function(event) {
        var result = event.results[0][0].transcript.toLowerCase();
        if(result != ''){
            let time = new Date().toLocaleTimeString().split(":");
            let atime = time.shift()+ ":" +time.shift();
            let li = document.createElement("li");
            
            let span1 = document.createElement("span");
            span1.className = "time";
            span1.innerText = atime;
            console.log(span1);
            li.append(span1);
    
            let span2 = document.createElement("span");
            span2.innerText = result;
            console.log(span2);
            li.append(span2);
    
            console.log(li);
            ol.append(li);
        }
        
      
    };
}

buttonVoice.addEventListener("click",voiceWork);