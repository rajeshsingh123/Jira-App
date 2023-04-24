let addbtn=document.querySelector(".addbutton");
let taskareacont=document.querySelector(".textarea-cont");
let modelcont=document.querySelector(".model-cont");
let maincont=document.querySelector(".main-cont");
let allprioritycolor=document.querySelectorAll(".priority-color")
let modelproritycolor='black';
let removebtn=document.querySelector(".deletebutton");
let toolBoxColors=document.querySelectorAll(".color");
let removeflag=false;
let colors=['lightpink','blue','green','black'];
let modalpcolor=colors[colors.length-1];
var uid = new ShortUniqueId();
let ticketArr=[];
let flag=true;


if(localStorage.getItem("tickets")){
    let str=localStorage.getItem("tickets");
    let arr=JSON.parse(str);
    ticketArr=arr;
    for(let i=0;i<arr.length;i++){
        let ticketobj=arr[i];
        createticket(ticketobj.color,ticketobj.task,ticketobj.id);
    }
}


addbtn.addEventListener("click",function(){
    if(flag){
        modelcont.style.display="flex";
        
    }else{
        modelcont.style.display="none";
       // flag=false;
    }
    flag=!flag;
   
})



for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", function () {
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for (let i = 0; i < ticketArr.length; i++) {
            if (ticketArr[i].color == currentColor) {
                filteredArr.push(ticketArr[i]);
            }
        }
        // console.log(filteredArr);
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < filteredArr.length; i++) {
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createticket(color, task, id)
        }
    })

    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createticket(color, task, id)
        }
    })
}









for(let i=0; i<allprioritycolor.length; i++){
    let prioritycolor=allprioritycolor[i];
    prioritycolor.addEventListener("click",function(){
        for(let j=0; j<allprioritycolor.length; j++){
            allprioritycolor[j].classList.remove("active");
        }
        prioritycolor.classList.add("active")
        modelproritycolor=prioritycolor.classList[0];
    })
}

removebtn.addEventListener("click",function(){
   if(removeflag){
      removebtn.style.color='black'
   }else{
    removebtn.style.color='red';
   }
   removeflag=!removeflag;
})


modelcont.addEventListener("keydown",function(e){
    let key=e.key;
    if(key=='Enter'){
        createticket( modelproritycolor,taskareacont.value);
       taskareacont.value="";
       modelcont.style.display="none";
       flag=!flag;
    }
})

function createticket(ticketcolor,task,ticketId){
// console.log("ndjdhjxd")
// <div class="main-cont">
// <div class="ticket-cont">
//     <div class="ticket-color green"></div>
//      <div class="ticket-id">jdjdj</div>
//      <div class="task-area">task</div>
// </div>
// </div>

let id;
if (ticketId == undefined) {
    id = uid();
} else {
    id = ticketId;
}

let ticketcont=document.createElement("div");
ticketcont.setAttribute('class','ticket-cont');
ticketcont.innerHTML= `<div class="ticket-color ${ticketcolor}"></div>
                     <div class="ticket-id">#${id}</div>
                     <div class="task-area">${task}</div>
                     <div class="lock-unlock"><i class="fa fa-lock"></i></div>`
                       
maincont.appendChild(ticketcont);   

//lock-unlock handle
let lockunlockbtn=ticketcont.querySelector(".lock-unlock i");
let tickettaskarea=ticketcont.querySelector(".task-area");
lockunlockbtn.addEventListener("click",function(){
    if(lockunlockbtn.classList.contains("fa-lock")){
        lockunlockbtn.classList.remove("fa-lock");
        lockunlockbtn.classList.add("fa-unlock")
        tickettaskarea.setAttribute("contenteditable","true");
    }else{
        lockunlockbtn.classList.remove("fa-unlock");
        lockunlockbtn.classList.add("fa-lock");
        tickettaskarea.setAttribute("contenteditable","false")
    }

//update ticketarr
let ticketIdx= getTicketIdx(id);
ticketArr[ticketIdx].task=tickettaskarea.textContent;
updateLocalStorage();
})


ticketcont.addEventListener("click",function(){
    if(removeflag){
        //delete from UI
        ticketcont.remove();
        //delete from ticket array
       let ticketIdx= getTicketIdx(id);
       ticketArr.splice(ticketIdx,1);
       updateLocalStorage();
    //    let stringify=JSON.stringify(ticketArr);
    //    localStorage.setItem("tickets",stringify);
    }
    
})
//handle color
let ticketColorBand = ticketcont.querySelector(".ticket-color");
ticketColorBand.addEventListener("click", function () {
    //update UI
    let currentTicketColor = ticketColorBand.classList[1];
    let currentTicketColorIdx = -1;
    for (let i = 0; i < colors.length; i++) {
        if (currentTicketColor == colors[i]) {
            currentTicketColorIdx = i;
            break;
        }
    }
    let nextColorIdx = (currentTicketColorIdx + 1) % colors.length;
    let nextColor = colors[nextColorIdx];
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(nextColor);
    
    // let ticketIdx;
    // for(let i=0; i<ticketArr.length; i++){
    //     if(ticketArr[i].id==id){
    //         ticketIdx=i;
    //         break;
    //     }
    // }
    let ticketIdx= getTicketIdx(id);
   ticketArr[ticketIdx].color=nextColor;
   updateLocalStorage();


})
if(ticketId == undefined){
    ticketArr.push({ "color": ticketcolor, "task": task, "id": id })
    // let stringifyarr=JSON.stringify(ticketArr);
    // localStorage.setItem("tickets",stringifyarr);
   updateLocalStorage();
}


    }


    function getTicketIdx(id){
        for(let i=0;i<ticketArr.length;i++){
            if(ticketArr[i].id==id){
                return i;
            }
        }
    }
    
    function updateLocalStorage(){
        let stringifyarr=JSON.stringify(ticketArr);
        localStorage.setItem("tickets",stringifyarr);
    }