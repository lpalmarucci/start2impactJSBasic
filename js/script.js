let interval;
//Per evitare che vengano visualizzati più alert in pagina
let alertShowInPage = false;
//Oggetto operazioni
let operations = {
    '-' : (val, numToSub = 1) => {
        return val - numToSub;
    },
    '+' : (val, numToSum = 1) => {
        return val + numToSum;
    }
}

const drawElements = function(){
    const container = document.getElementById('container');
    //Creazione counter
    let span = document.createElement('span');
    span.setAttribute('id','counterValue');
    container.append(span);

    let wrapperButtons = document.createElement('div');
    wrapperButtons.setAttribute('id','buttonsContainer');

    //Creo un pulsante per ogni operazione trovata
    for(let op of Object.keys(operations)){
        let btn = document.createElement('button');
        //Per sapere che operazione eseguire al click del pulsante
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

    //posizionamento alert al fondo (alzato di 10 pixel) e al centro della pagina
    let coordsAlert = alert.getBoundingClientRect();
    alert.style.position = 'absolute';
    alert.style.top = window.innerHeight - coordsAlert.height - 10 + 'px';
    alert.style.left = window.innerWidth/2 - coordsAlert.width/2 + "px";

    //Gestione animazione a scomparsa con il setInterval + CustomEvent
    let timerEvent = new CustomEvent('timerExpired');
    line.addEventListener('timerExpired', () => {
        document.getElementById('alert').style.opacity = 0;
        clearInterval(interval);
        //Posso permettere di disegnare un altro alert
        alertShowInPage = false;
        //Per permettere l'animazione dell'alert
        setTimeout(() => document.getElementById('alert').remove(),400);
    })

    let timerInterval = setInterval(() => {
        let width = line.getBoundingClientRect().width;
        if(width - 1 === 0){
            interval = timerInterval;
            line.dispatchEvent(timerEvent);
        } 
        line.style.width =  `${width - 1}px`;
    }, 6);
}

function calc(op) {
    let valueElem = document.getElementById('counterValue');
    let cur_val = parseInt(valueElem.textContent);
    valueElem.textContent = operations[op](cur_val);
}

document.addEventListener("DOMContentLoaded", (e) => {
    drawElements();
    document.getElementById("counterValue").textContent = 0;
})

//gestione click pulsanti con event delegation
document.addEventListener('click', (e) => {
    if(e.target.tagName.toLowerCase() !== 'button') return;
    calc(e.target.dataset.operation);
})

//Premere CTRL + E per resettare il counter
document.onkeydown = (e) => {
    if(((e.ctrlKey || e.metaKey) && e.code === 'KeyE') || e.key === '0' ){
        if(!alertShowInPage){
            document.getElementById("counterValue").textContent = 0;
            drawAlert(e);
        }
    } else if(Object.keys(operations).join(' ').includes(e.key)){
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