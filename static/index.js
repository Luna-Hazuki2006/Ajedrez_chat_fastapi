var client_id = Date.now()
let tabla = document.getElementById('tablero')
document.querySelector("#ws-id").textContent = client_id;
var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
ws.onmessage = function(event) {
    console.log(event);
    var messages = document.getElementById('messages')
    var message = document.createElement('li')
    var content = document.createTextNode(event.data)
    message.appendChild(content)
    messages.appendChild(message)
};
function sendMessage(event) {
    var input = document.getElementById("messageText")
    let tipo = {
        'tipo': 'mensaje', 
        'valor': input.value
    }
    ws.send(JSON.stringify(tipo))
    input.value = ''
    event.preventDefault()
}

function llenar_datos() {
    let verdad = false
    for (let i = 1; i <= 8; i++) {
        let tr = document.createElement('tr')
        for (let j = 1; j <= 8; j++) { 
            verdad = !verdad
            let td = document.createElement('td')
            td.id = i + '-' + j
            if (i == 2 || i == 7) {
                td.innerText = '♟'
                td.setAttribute('onclick', 'mover(this);')
                if (i == 2) {
                    td.classList.add('blancas')
                } else if (i == 7) {
                    td.classList.add('negras')
                }
            } else if (i == 1 || i == 8) {
                if (j == 1 || j == 8) {
                    td.innerText = '♖'
                } else if (j == 2 || j == 7) {
                    td.innerText = '♞'
                } else if (j == 3 || j == 6) {
                    td.innerText = '♝'
                } else if (j == 4) {
                    td.innerText = '♛'
                } else if (j == 5) {
                    td.innerText = '♚'
                }
                if (i == 1) {
                    td.classList.add('blancas')
                } else if (i == 8) {
                    td.classList.add('negras')
                }
            } else {
                td.innerText = '|'
            }
            if (verdad) td.classList.add('blanca')
            else td.classList.add('negra')
            tr.appendChild(td)
        }
        verdad = !verdad
        tabla.appendChild(tr)
    }
}

function mover(data) {
    
}

llenar_datos()