let uid = new ShortUniqueId();
let filters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let addBtn = document.querySelector(".add");
let delBtn = document.querySelector(".action2");
let colors = {
    pink: "#d595aa",
    blue: "#5ecdde",
    green: "#91e6c7",
    black: "black"
};
var x = document.referrer;
if (x == "") {
    alert("login pls");
    let body=document.querySelector("body");
    body.remove()
    location.replace("index.html");
}
//intialisation step
if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
}
if (!localStorage.getItem("RecycleBin")) {
    localStorage.setItem("RecycleBin", JSON.stringify([]));
}

let ColorArr = ["pink-color-btn", "blue-color-btn", "green-color-btn", "black-color-btn"];

LoadTasks();

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {
        // let color = e.currentTarget.classList[0].split("-")[0];
        let color;
        if (e.currentTarget.parentElement.classList.contains("active-modal-filer")) {
            e.currentTarget.parentElement.classList.remove("active-modal-filer");
            LoadTasks();
        }
        else {
            for (let j = 0; j < filters.length; j++) {
                if (filters[j].parentElement.classList.contains("active-modal-filer")) filters[j].parentElement.classList.remove("active-modal-filer");
            }
            e.currentTarget.parentElement.classList.add("active-modal-filer");
            color = e.currentTarget.classList[0];
            LoadTasks(color);
        }
    });
}

let sortBtn = document.querySelector(".sort");
sortBtn.addEventListener("click", function (e) {
    let bin = document.querySelector(".bin-container")
    if (e.currentTarget.classList.contains("active-modal-filer")) {
        e.currentTarget.classList.remove("active-modal-filer");
        if (bin.classList.contains("active-modal-filer"))
            LoadDeletedTasks();
        else LoadTasks();
    }
    else {
        if (bin.classList.contains("active-modal-filer")) {
            e.currentTarget.classList.add("active-modal-filer");
            LoadDeletedTasks("pink-color-btn");
            LoadDeletedTasks("blue-color-btn", "no");
            LoadDeletedTasks("green-color-btn", "no");
            LoadDeletedTasks("black-color-btn", "no");
        }
        else {
            if (modalDisp) {
                let modal = document.querySelector(".modal-container");
                modal.remove();
                modalDisp = false;
            }
            e.currentTarget.classList.add("active-modal-filer");
            LoadTasks("pink-color-btn");
            LoadTasks("blue-color-btn", "no");
            LoadTasks("green-color-btn", "no");
            LoadTasks("black-color-btn", "no");
        }
    }
});


let isPrioritySelected = false;
let SelectedColorClass;
let deleteState = false;
let body = document.querySelector("body");
let modalDisp = false;
let modal;

delBtn.addEventListener("click", function (e) {
    if (deleteState == false) {
        if (modalDisp) {
            let modal = document.querySelector(".modal-container");
            modal.remove();
            modalDisp = false;
        }
        deleteState = true
        e.currentTarget.classList.add("active-modal-filer");
    }
    else {
        deleteState = false;
        e.currentTarget.classList.remove("active-modal-filer");
    }
})
addBtn.addEventListener("click", function (e) {
    let recycleBin = document.querySelector(".bin-container")
    if (recycleBin.classList.contains("active-modal-filer")) {
        recycleBin.classList.remove("active-modal-filer");
        LoadTasks();
    }
    if (delBtn.classList.contains("active-modal-filer")) delBtn.classList.remove("active-modal-filer");
    deleteState = false;
    if (!modalDisp) {
        modal = document.createElement("div");
        let sortBtn = document.querySelector(".sort");
        if (sortBtn.classList.contains("active-modal-filer")) sortBtn.classList.remove("active-modal-filer");
        modal.classList.add("modal-container");
        modal.setAttribute("click-first", true);
        modal.innerHTML = `
    <div class="text-area" contenteditable>Enter Your Task</div>
    <div class="filter-area">
        <div class="modal-filter pink-color-btn"></div>
        <div class="modal-filter blue-color-btn"></div>
        <div class="modal-filter green-color-btn"></div>
        <div class="modal-filter black-color-btn"></div>
    </div>`;
        body.append(modal);
        modalDisp = true;

        let filters = document.querySelectorAll(".modal-filter");
        for (let i = 0; i < filters.length; i++) {
            filters[i].addEventListener("click", ModalFilterSelecter);
        }

        let textArea = document.querySelector(".text-area");
        textArea.addEventListener("click", function (e) {
            if (modal.getAttribute("click-first") == "true") {
                modal.setAttribute("click-first", false);
                e.currentTarget.innerText = ""
            }
        });

        textArea.addEventListener("keypress", TicketCreator);

    }
    else {
        modal.remove()
        modalDisp = false;
    }
});

function saveTicketInLocalStorage(id, SelectedColorClass, task, lockState) {
    let requiredObj = { id, SelectedColorClass, task, lockState };
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    tasksArr.push(requiredObj);
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function ModalFilterSelecter(e) {
    if (e.currentTarget.classList.contains("active-modal-filer")) {
        e.currentTarget.classList.remove("active-modal-filer");
        isPrioritySelected = false;
        SelectedColorClass = "";
    }
    else {
        let filters = document.querySelectorAll(".modal-filter");
        for (let j = 0; j < filters.length; j++) {
            if (filters[j].classList.contains("active-modal-filer")) filters[j].classList.remove("active-modal-filer");
        }
        e.currentTarget.classList.add("active-modal-filer");
        isPrioritySelected = true;
        SelectedColorClass = e.currentTarget.classList[1];
    }
}


function LoadTasks(PassedColor, removeState) {
    if (removeState == null || removeState == undefined) {
        let AllTickets = document.querySelectorAll(".ticket");

        for (let i = 0; i < AllTickets.length; i++) {
            AllTickets[i].remove();
        }
    }
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    for (let i = 0; i < tasks.length; i++) {
        let id = tasks[i].id;
        let task = tasks[i].task;
        let colorClass = tasks[i].SelectedColorClass;
        let lockState = tasks[i].lockState;
        if (PassedColor != undefined) {
            if (PassedColor != colorClass) {
                continue;
            }
        }

        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.addEventListener("click", DeleteFunc);

        let editable;
        if (lockState == "fa-lock-open") {
            editable = true;
        }
        else {
            editable = false;
        }

        ticket.innerHTML = `  <div class="ticket-color ${colorClass}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="lock fas ${lockState}"></div>
        <div class="ticket-box" contenteditable="${editable}" >${task}</div>`


        let ticketWritingArea = ticket.querySelector(".ticket-box");
        ticketWritingArea.addEventListener("input", WritingAreaTicketHandler)

        let lock = ticket.querySelector(".lock");
        lock.addEventListener("click", function (e) {
            let textArea = e.currentTarget.parentElement.querySelector(".ticket-box");

            if (e.currentTarget.classList.contains("fa-lock-open")) {
                e.currentTarget.classList.remove("fa-lock-open");
                e.currentTarget.classList.add("fa-lock");
                textArea.setAttribute("contenteditable", false);
            }
            else {
                e.currentTarget.classList.remove("fa-lock");
                e.currentTarget.classList.add("fa-lock-open");
                textArea.setAttribute("contenteditable", true);
            }

            let lockState = e.currentTarget.classList[2];

            let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
            let tasksArr = JSON.parse(localStorage.getItem("tasks"));
            let index = -1;
            for (let i = 0; i < tasksArr.length; i++) {
                if (id == tasksArr[i].id) {
                    index = i;
                    break;
                }
            }
            tasksArr[index].lockState = lockState;
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
        })

        grid.appendChild(ticket);

        let ticketColorDiv = ticket.querySelector(".ticket-color");

        ticketColorDiv.addEventListener("click", function (e) {
            if (e.currentTarget.parentElement.querySelector(".lock").classList.contains("fa-lock-open")) {
                let CurrColor = ticketColorDiv.classList[1];
                let idx = ColorArr.indexOf(CurrColor);
                idx = (idx + 1) % 4;
                ticketColorDiv.classList.remove(CurrColor);
                ticketColorDiv.classList.add(ColorArr[idx]);
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let index = -1;
                for (let i = 0; i < tasksArr.length; i++) {
                    if (tasksArr[i].id == id) {
                        index = i;
                        break;
                    }
                }
                tasksArr[index].SelectedColorClass = e.currentTarget.classList[1];
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            }
            else {
                alert("this ticket is locked");
            }
        });

    }
    let container = document.querySelector(".container");
    if (container.classList.contains("light")) {
        lightmode();
    }
    else {
        DarkMode();
    }
    let bin = document.querySelector(".bin-container");
    if (bin.classList.contains("active-modal-filer")) bin.classList.remove("active-modal-filer");
}

function WritingAreaTicketHandler(e) {
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let index = -1;
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id == id) {
            index = i;
            break;
        }
    }
    tasksArr[index].task = e.currentTarget.innerText;
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}



function TicketCreator(e) {
    if (e.key == "Enter" && isPrioritySelected) {
        let task = e.currentTarget.innerText;
        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.addEventListener("click", DeleteFunc);
        let id = uid();
        ticket.innerHTML = `  <div class="ticket-color ${SelectedColorClass}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="lock fas fa-lock-open"></div>
        <div class="ticket-box" contenteditable >${task}</div>`

        let container=document.querySelector(".container");
        if(container.classList.contains("dark")){
        ticket.style.backgroundColor = "#333333"
        let id = ticket.querySelector(".ticket-id");
        id.style.color = "#f9c859";
        let text = ticket.querySelector(".ticket-box");
        text.style.color = "#ff6480";
        }

        let ticketWritingArea = ticket.querySelector(".ticket-box");
        ticketWritingArea.addEventListener("input", WritingAreaTicketHandler)

        let lock = ticket.querySelector(".lock");
        lock.addEventListener("click", function (e) {
            let textArea = e.currentTarget.parentElement.querySelector(".ticket-box");

            if (e.currentTarget.classList.contains("fa-lock-open")) {
                e.currentTarget.classList.remove("fa-lock-open");
                e.currentTarget.classList.add("fa-lock");
                textArea.setAttribute("contenteditable", false);
            }
            else {
                e.currentTarget.classList.remove("fa-lock");
                e.currentTarget.classList.add("fa-lock-open");
                textArea.setAttribute("contenteditable", true);
            }
            let lockState = e.currentTarget.classList[2];

            let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
            let tasksArr = JSON.parse(localStorage.getItem("tasks"));
            let index = -1;
            for (let i = 0; i < tasksArr.length; i++) {
                if (id == tasksArr[i].id) {
                    index = i;
                    break;
                }
            }
            tasksArr[index].lockState = lockState;
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
        })
        let lockState = lock.classList[2];
        saveTicketInLocalStorage(id, SelectedColorClass, task, lockState);
        grid.appendChild(ticket);
        modalDisp = false;
        modal.remove();
        isPrioritySelected = false;
        SelectedColorClass = "";

        let ticketColorDiv = ticket.querySelector(".ticket-color");

        ticketColorDiv.addEventListener("click", function (e) {
            if (e.currentTarget.parentElement.querySelector(".lock").classList.contains("fa-lock-open")) {
                let CurrColor = ticketColorDiv.classList[1];
                let idx = ColorArr.indexOf(CurrColor);
                idx = (idx + 1) % 4;
                ticketColorDiv.classList.remove(CurrColor);
                ticketColorDiv.classList.add(ColorArr[idx]);
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let index = -1;
                for (let i = 0; i < tasksArr.length; i++) {
                    if (tasksArr[i].id == id) {
                        index = i;
                        break;
                    }
                }
                tasksArr[index].SelectedColorClass = e.currentTarget.classList[1];
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            }
            else {
                alert("this ticket is locked");
            }
        });
    }
}

function DeleteFunc(e) {
    if (deleteState) {
        e.currentTarget.remove();
        let Currid = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];

        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
        tasksArr = tasksArr.filter(function (el) {
            if (el.id != Currid) return el;
            else {
                let bin = JSON.parse(localStorage.getItem("RecycleBin"));
                bin.push(el);
                localStorage.setItem("RecycleBin", JSON.stringify(bin));
            }
        })
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
}

let bin = document.querySelector(".bin-container");
bin.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("active-modal-filer")) {
        e.currentTarget.classList.remove("active-modal-filer");
        LoadTasks();
    }
    else {
        let sortBtn = document.querySelector(".sort");
        if (sortBtn.classList.contains("active-modal-filer")) sortBtn.classList.remove("active-modal-filer");
        LoadDeletedTasks();
    }
})

let srchBtn = document.querySelector(".btn");
let bar = document.querySelector(".inp");
let inp = document.querySelector("input");
srchBtn.addEventListener("click", function (e) {
    bar.classList.toggle("inp");
    bar.classList.toggle("inpAnimation");
    inp.value = "";
    if (bar.classList.contains("inp")) {
        let DeletedTasks = JSON.parse(localStorage.getItem("RecycleBin"));
        if (DeletedTasks.length > 0) LoadDeletedTasks();
        LoadTasks();
    }
})
inp.addEventListener("input", function (e) {
    let value = inp.value;
    value = value.trim();
    let tickets = document.querySelectorAll(".ticket");
    for (let i = 0; i < tickets.length; i++) {
        let text = tickets[i].querySelector(".ticket-box").innerText;
        let id = tickets[i].querySelector(".ticket-id").innerText;
        if (text.includes(value) || id.includes(value)) {
            tickets[i].style.display = "block";
        }
        else {
            tickets[i].style.display = "none";
        }
    }
})

function LoadDeletedTasks(PassedColor, removeState) {
    let bin = document.querySelector(".bin-container");

    if (modalDisp) {
        modalDisp = false;
        let Modal = document.querySelector(".modal-container");
        Modal.remove();
    }
    let DeletedTasks = JSON.parse(localStorage.getItem("RecycleBin"));
    if (DeletedTasks.length == 0) {
        alert("Recycle bin is Empty");
        LoadTasks();
        return;
    }
    else {
        let DeletedTasks = JSON.parse(localStorage.getItem("RecycleBin"));
        bin.classList.add("active-modal-filer");
        if (delBtn.classList.contains("active-modal-filer")) {
            delBtn.classList.remove("active-modal-filer");
            deleteState = false;
        }
        if (removeState == null || removeState == undefined) {
            let visibleTickets = document.querySelectorAll(".ticket");
            for (let i = 0; i < visibleTickets.length; i++) {
                visibleTickets[i].remove();
            }
        }
        for (let j = 0; j < DeletedTasks.length; j++) {
            let id = DeletedTasks[j].id;
            let task = DeletedTasks[j].task;
            let colorClass = DeletedTasks[j].SelectedColorClass;

            if (PassedColor != undefined) {
                if (PassedColor != colorClass) {
                    continue;
                }
            }

            let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.addEventListener("click", function (e) {
                e.currentTarget.remove();
                let Currid = ticket.querySelector(".ticket-id").innerText.split("#")[1];
                DeletedTasks = DeletedTasks.filter(function (ele) {
                    if (ele.id != Currid) return ele;
                    else if (!deleteState && ele.id == Currid) {
                        let tasks = JSON.parse(localStorage.getItem("tasks"));
                        tasks.push(ele);
                        localStorage.setItem("tasks", JSON.stringify(tasks));
                    }
                })
                localStorage.setItem("RecycleBin", JSON.stringify(DeletedTasks));
                if (DeletedTasks.length == 0) {
                    if (delBtn.classList.contains("active-modal-filer")) delBtn.classList.remove("active-modal-filer");
                    bin.classList.remove("active-modal-filer");
                    deleteState = false;
                    LoadTasks();
                }
            });

            ticket.innerHTML = `  <div class="ticket-color ${colorClass}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box" >${task}</div>`
            grid.appendChild(ticket);
        }
        let container = document.querySelector(".container");
        if (container.classList.contains("light")) {
            lightmode();
        }
        else {
            DarkMode();
        }
    }
}


let themeBtn = document.querySelector(".themeBtn");
themeBtn.addEventListener("click", function (e) {
    let container = document.querySelector(".container")
    container.classList.toggle("light");
    container.classList.toggle("dark")
    if (e.currentTarget.classList.contains("active-modal-filer")) {
        e.currentTarget.classList.remove("active-modal-filer");
        lightmode();
    }
    else {
        e.currentTarget.classList.add("active-modal-filer");
        DarkMode();
    }
})
function lightmode() {
    let grid = document.querySelector(".grid");
    let navbar = document.querySelector(".navbar");
    let tickets = document.querySelectorAll(".ticket");
    navbar.style.backgroundColor = "#333333"
    grid.style.backgroundColor = "#f2f2f2"
    for (let i = 0; i < tickets.length; i++) {
        tickets[i].style.backgroundColor = "white"
        let id = tickets[i].querySelector(".ticket-id");
        id.style.color = "#989393";
        let text = tickets[i].querySelector(".ticket-box");
        text.style.color = "black";
    }
}
function DarkMode() {
    let grid = document.querySelector(".grid");
    let navbar = document.querySelector(".navbar");
    let tickets = document.querySelectorAll(".ticket");
    navbar.style.backgroundColor = "black"
    grid.style.backgroundColor = "#081B33"
    for (let i = 0; i < tickets.length; i++) {
        tickets[i].style.backgroundColor = "#333333"
        let id = tickets[i].querySelector(".ticket-id");
        id.style.color = "#f9c859";
        let text = tickets[i].querySelector(".ticket-box");
        text.style.color = "#ff6480";
    }
}
 // let btn = document.querySelector("button");
        // btn.addEventListener("click", function (e) {
        //     let id = document.querySelector(".id").innerText;
        //     let pass = document.querySelector(".pass").innerText;
        //     let passarr = JSON.parse(localStorage.getItem("Pass&key"));
        //     var hash = CryptoJS.HmacMD5(pass, id);
        //     let password = hash.toString(CryptoJS.enc.Base64);
        //     if (password == passarr[0]) {
        //         alert("login succesfull")
        //     }
        //     else {
        //         alert("login failed")
        //     }
    // }
//)