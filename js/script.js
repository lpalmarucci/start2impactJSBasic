
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
    // span.style.padding = "10px";
    // span.height = "30px";
    alert.append(span);

    let line = document.createElement('div');
    line.className = "line";
    alert.append(line);
    document.getElementById('container').append(alert);

    
    // line.style.height = "5px";
    // line.style.backgroundColor = "rgb(184, 241, 255)";
    // line.style.width = alert.clientWidth + 'px';
    
    
    let coordsAlert = alert.getBoundingClientRect();
    alert.style.position = 'absolute';
    alert.style.top = window.innerHeight - coordsAlert.height - 10 + 'px';
    alert.style.left = window.innerWidth/2 - coordsAlert.width + "px";

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
    }, 10);

}

function calc(op) {
    let valueElem = document.getElementById('counterValue');
    let cur_val = parseInt(valueElem.textContent);
    if(op === '+'){
        valueElem.textContent = cur_val + 1;
    } else{
        valueElem.textContent = cur_val - 1;        
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

//shortcut per resettare il counter
document.onkeydown = (e) => {
    if(((e.ctrlKey || e.metaKey) && e.code === 'KeyE')){
        if(!alertShowInPage){
            document.getElementById("counterValue").textContent = 0;
            drawAlert(e);
        }
    } else if(operations.join(' ').includes(e.key)){
        calc(e.key);
    }


    // if(!((e.ctrlKey || e.metaKey) && e.code === 'KeyE')) return;
    // document.getElementById("counterValue").textContent = 0;
    // if(!alertShowInPage){
    //     drawAlert(e);
    // }
}

