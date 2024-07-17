var client_id = Date.now()
let tabla = document.getElementById('tablero')
let tipo = {}
document.querySelector("#ws-id").textContent = client_id;
var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
ws.onmessage = function(event) {
    data = JSON.parse(event.data)
    console.log(data);
    if (data['tipo'] == 'mensaje') {
        var messages = document.getElementById('messages')
        var message = document.createElement('li')
        var content = document.createTextNode(data['valor'])
        message.appendChild(content)
        messages.appendChild(message)   
    } else if (data['tipo'] == 'movimiento') {
        let borrar = document.getElementById(data['original'])
        let nueva = document.getElementById(data['nuevo'])
        if (nueva) {
            nueva.classList.remove('negras')
            nueva.classList.remove('blancas')
            if (data['color'] == 'negras') {
                nueva.classList.add('negras')
            } else if (data['color'] == 'blancas') {
                nueva.classList.add('blancas')
            }
            nueva.setAttribute('onclick', 'mover(this);')
            borrar.innerText = '|'
            nueva.innerText = data['valor']
        } else {
            borrar.classList.add(data['color'])
        }
    }
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
                    td.innerText = '♜'
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
                td.setAttribute('onclick', 'mover(this);')
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

function eliminar() {
    let todos = document.getElementsByTagName('td')
    for (const esto of todos) {
        if (esto.classList.contains('oportunidad')) {
            esto.classList.remove('oportunidad')
            esto.removeAttribute('onclick')
        }
    }
}

function dar_clickeo(nuevo) {
    nuevo.classList.add('oportunidad')
    nuevo.setAttribute('onclick', 'movimiento(this);')
}

function mover(data) {
    eliminar()
    let pieza = data.innerText
    tipo = {
        'tipo': 'movimiento', 
        'valor': pieza, 
        'original': data.id
    }
    let esto = '' + data.id
    let ubicacion = esto.split('-')

    switch (tipo.valor) {
        case '♟':
            if (ubicacion[0] == 2) {
                let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
                dar_clickeo(posibilidad)
                posibilidad = document.getElementById(Number(ubicacion[0]) + 2 + '-' + ubicacion[1])
                dar_clickeo(posibilidad)
            } else if (ubicacion[0] == 7) {
                let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
                dar_clickeo(posibilidad)
                posibilidad = document.getElementById(Number(ubicacion[0]) - 2 + '-' + ubicacion[1])
                dar_clickeo(posibilidad)
            } else {
                if (data.classList.contains('blancas')) {
                    let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
                    dar_clickeo(posibilidad)
                } else if (data.classList.contains('negras')) {
                    let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
                    dar_clickeo(posibilidad)
                }
            }
            break;
        case '♜': 
            let cuatro = []
            for (let i = 1; i <= 8; i++) {
                if (i != ubicacion[0]) {
                    let nuevo = i + '-' + ubicacion[1]
                    let este = document.getElementById(nuevo)
                    dar_clickeo(este)
                    cuatro.push(nuevo)
                }
                if (i != ubicacion[1]) {
                    let nuevo = ubicacion[0] + '-' + i
                    let este = document.getElementById(nuevo)
                    dar_clickeo(este)
                    cuatro.push(nuevo)
                }
            }
            break
        case '♝': 
            let nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            break
        case '♞': 
            let Ele = []
            Ele.push((Number(ubicacion[0]) + 2) + '-' + (Number(ubicacion[1]) + 1))
            Ele.push((Number(ubicacion[0]) + 2) + '-' + (Number(ubicacion[1]) - 1))
            Ele.push((Number(ubicacion[0]) - 2) + '-' + (Number(ubicacion[1]) + 1))
            Ele.push((Number(ubicacion[0]) - 2) + '-' + (Number(ubicacion[1]) - 1))
            Ele.push((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) + 2))
            Ele.push((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 2))
            Ele.push((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 2))
            Ele.push((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 2))
            for (const nuevo of Ele) {
                let este = document.getElementById(nuevo)
                if (este) {
                    dar_clickeo(este)
                }
            }
            break
        case '♛': 
            for (let i = 1; i <= 8; i++) {
                if (i != ubicacion[0]) {
                    let variable = i + '-' + ubicacion[1]
                    let este = document.getElementById(variable)
                    dar_clickeo(este)
                }
                if (i != ubicacion[1]) {
                    let variable = ubicacion[0] + '-' + i
                    let este = document.getElementById(variable)
                    dar_clickeo(este)
                }
            }
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) + diagonales) + '-' + (Number(ubicacion[1]) + diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) - diagonales) + '-' + (Number(ubicacion[1]) - diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) - diagonales) + '-' + (Number(ubicacion[1]) + diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) + diagonales) + '-' + (Number(ubicacion[1]) - diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    dar_clickeo(este)
                } else break
            } while (true);
            break
        case '♚': 
            let este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + ubicacion[1])
            if (este) dar_clickeo(este)
            este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + ubicacion[1])
            if (este) dar_clickeo(este)
            este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))
            if (este) dar_clickeo(este)
            este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))
            if (este) dar_clickeo(este)
            este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) + 1))
            if (este) dar_clickeo(este)
            este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))
            if (este) dar_clickeo(este)
            este = document.getElementById(ubicacion[0] + '-' + (Number(ubicacion[1]) + 1))
            if (este) dar_clickeo(este)
            este = document.getElementById(ubicacion[0] + '-' + (Number(ubicacion[1]) - 1))
            if (este) dar_clickeo(este)
            break
        default:
            break;
    }
    // data.removeAttribute('onclick')
    if (data.classList.contains('negras')) {
        tipo['color'] = 'negras'
        // data.classList.remove('negras')
    } else if (data.classList.contains('blancas')) {
        tipo['color'] = 'blancas'
        // data.classList.remove('blancas')
    }
    ws.send(JSON.stringify(tipo))
}

function movimiento(data) {
    let original = document.getElementById(tipo['original'])
    original.classList.remove('negras', 'blancas')
    tipo['nuevo'] = data.id
    if (data.classList.contains('negras')) {
        data.classList.remove('negras')
    } else if (data.classList.contains('blancas')) {
        data.classList.remove('blancas')
    }
    ws.send(JSON.stringify(tipo))
}

llenar_datos()