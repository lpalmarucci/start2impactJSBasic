
let interval;
let alertShowInPage = false;
let operations = ['-','+'];

const drawElements = function(operations){
    const container = document.getElementById('container');
    let span = document.createElement('span');
    span.setAttribute('id','counterValue');
    span.addEventListener('dblclick', function(e){
        e.preventDefault();
        this.innerText = 0;
    })
    container.append(span);

    let wrapperButtons = document.createElement('div');
    wrapperButtons.setAttribute('id','buttonsContainer');

    for(let op of operations){
        let btn = document.createElement('button');
        btn.setAttribute('data-operation',op);
        btn.innerText = op;
        wrapperButtons.append(btn);
    }

    container.append(wrapperButtons);
}

const drawAlert = (event) => {
    alertShowInPage = true;

    //creating alert
    let alert =  document.createElement('footer');
    alert.setAttribute('id','alert');

    let span = document.createElement('span');
    span.textContent = 'Counter resetted';
    span.classList.add('text-alert');
    alert.append(span);

    let line = document.createElement('div');
    line.className = "line";
    alert.append(line);
    document.getElementById('container').append(alert);

    let coordsAlert = alert.getBoundingClientRect();
    alert.style.position = 'absolute';
    alert.style.top = window.innerHeight - coordsAlert.height - 10 + 'px';
    alert.style.left = window.innerWidth/2 - coordsAlert.width/2 + "px";

    let timerEvent = new CustomEvent('timer');
    line.addEventListener('timer', () => {
        document.getElementById('alert').style.opacity = 0;
        clearInterval(interval);
        alertShowInPage = false;
        setTimeout(() => document.getElementById('alert').remove(), 400);
    })

    const timer = setInterval(() => {
        let width = line.getBoundingClientRect().width;
        if(width - 1 <= 0){
            interval = timer;
            line.dispatchEvent(timerEvent);
        } 
        line.style.width = width - 1 + "px";
    }, 6);

}

function calc(op) {
    let valueElem = document.getElementById('counterValue');
    let cur_val = parseInt(valueElem.textContent);
    switch(op){
        case '+':
            valueElem.textContent = cur_val + 1;
            break;
        case '-':
            valueElem.textContent = cur_val - 1;    
            break;

        //In caso si dovessero aggiungere nuove operazioni
        default:
            console.error('Operation not supported');
            break;

    }
}


document.addEventListener("DOMContentLoaded", (e) => {
    drawElements(operations);
    document.getElementById("counterValue").textContent = 0;
})

//gestione pulsanti con event delegation
document.addEventListener('click', (e) => {
    if(e.target.tagName.toLowerCase() !== 'button') return;
    let op = e.target.dataset.operation;
    calc(op);
})

//Premere CTRL + E per resettare il counter
document.onkeydown = (e) => {
    if(((e.ctrlKey || e.metaKey) && e.code === 'KeyE')){
        if(!alertShowInPage){
            document.getElementById("counterValue").textContent = 0;
            drawAlert(e);
        }
    } else if(operations.join(' ').includes(e.key)){
        calc(e.key);
    }
}

window.onresize = (e) => {
    //se l'alert non è disegnato non proseguo
    if(!alertShowInPage) return;
    let alert = document.getElementById('alert');
    let coordsAlert = alert.getBoundingClientRect();
    alert.style.position = "absolute";
    alert.style.top = window.innerHeight - coordsAlert.height - 10+ 'px';
    alert.style.left = e.target.innerWidth/2 - coordsAlert.width/2 + "px";
}