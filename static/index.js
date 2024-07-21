var client_id = Date.now()
let tabla = document.getElementById('tablero')
let tipo = {}
document.querySelector("#ws-id").textContent = client_id;
let cambio = new Audio("https://ajedrez-chat-fastapi.onrender.com/static/mover.ogg")
var ws = new WebSocket(`wss://ajedrez-chat-fastapi.onrender.com/ws/${client_id}`);
// var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
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
            cambio.play()
            nueva.classList.remove('negras')
            nueva.classList.remove('blancas')
            if (data['color'] == 'negras') {
                nueva.classList.add('negras')
            } else if (data['color'] == 'blancas') {
                nueva.classList.add('blancas')
            }
            nueva.setAttribute('onclick', 'mover(this);')
            nueva.setAttribute('ondblclick', 'eliminar();')
            borrar.innerText = '|'
            nueva.innerText = data['valor']
        } else {
            borrar.classList.add(data['color'])
        }
        if (data['usuario'] == client_id) {
            pausar()
        } else {
            recordar()
        }
        if (data['ganado']) {
            let final = 'Ganaron las ' + data['color']
            alert(final)
            pausar()
            var messages = document.getElementById('messages')
            var message = document.createElement('li')
            var content = document.createTextNode(final)
            message.appendChild(content)
            messages.appendChild(message)   
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
                td.setAttribute('ondblclick', 'eliminar();')
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
                td.setAttribute('ondblclick', 'eliminar();')
            } else {
                td.innerText = '+'
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
        if (esto.classList.contains('oportunidad') || esto.getAttribute('onclick') == 'movimiento(this);') {
            esto.classList.remove('oportunidad')
            esto.removeAttribute('onclick')
            esto.removeAttribute('ondblclick')
        }
    }
    recordar()
}

function recordar() {
    let todos = document.getElementsByTagName('td')
    for (const esto of todos) {
        if (esto.innerText != '|' && esto.innerText != '+') {
            esto.setAttribute('onclick', 'mover(this);')
            esto.setAttribute('ondblclick', 'eliminar();')
        }
    }
}

function pausar() {
    let todos = document.getElementsByTagName('td')
    for (const esto of todos) {
        if (esto.innerText != '|' && esto.innerText != '+') {
            esto.removeAttribute('onclick')
            esto.removeAttribute('ondblclick')
        } else {
            esto.removeAttribute('onclick')
        }
    }
}

function dar_clickeo(nuevo) {
    if (nuevo.classList.contains(tipo['color']) && nuevo.innerText != '|' && nuevo.innerText != '+') {
        return false
    } 
    nuevo.classList.add('oportunidad')
    nuevo.setAttribute('onclick', 'movimiento(this);')
    nuevo.removeAttribute('ondblclick')
    if ((nuevo.classList.contains('blancas') || nuevo.classList.contains('negras')) && 
        (nuevo.innerText != '+' && nuevo.innerText != '|')) {
        return false
    }
    return true
}

function mover(data) {
    eliminar()
    let pieza = data.innerText
    tipo = {
        'tipo': 'movimiento', 
        'valor': pieza, 
        'original': data.id
    }
    if (data.classList.contains('negras')) {
        tipo['color'] = 'negras'
    } else if (data.classList.contains('blancas')) {
        tipo['color'] = 'blancas'
    }
    let esto = '' + data.id
    let ubicacion = esto.split('-')

    switch (tipo.valor) {
        case '♟':
            if (ubicacion[0] == 2 && tipo['color'] == 'blancas') {
                let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
                if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                    dar_clickeo(posibilidad)
                    posibilidad = document.getElementById(Number(ubicacion[0]) + 2 + '-' + ubicacion[1])
                    if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    } 
                } 
                posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))
                if (posibilidad?.classList.contains('negras')) {
                    dar_clickeo(posibilidad)
                }
                posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))
                if (posibilidad?.classList.contains('negras')) {
                    dar_clickeo(posibilidad)
                }
            } else if (ubicacion[0] == 7 && tipo['color'] == 'negras') {
                let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
                if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                    dar_clickeo(posibilidad)
                    posibilidad = document.getElementById(Number(ubicacion[0]) - 2 + '-' + ubicacion[1])
                    if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    }
                }
                posibilidad = document.getElementById((Number(ubicacion[0])) - 1 + '-' + (Number(ubicacion[1]) + 1))
                if (posibilidad?.classList.contains('blancas')) {
                    dar_clickeo(posibilidad)
                }
                posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))
                if (posibilidad?.classList.contains('blancas')) {
                    dar_clickeo(posibilidad)
                }
            } else {
                if (data.classList.contains('blancas')) {
                    let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
                    if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    } 
                    posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))

                    if (posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    }
                    posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))

                    if (posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    }
                } else if (data.classList.contains('negras')) {
                    let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
                    if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                        dar_clickeo(posibilidad)
                    }
                    posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) + 1))

                    if (posibilidad?.classList.contains('blancas')) {
                        dar_clickeo(posibilidad)
                    }
                    posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))

                    if (posibilidad?.classList.contains('blancas')) {
                        dar_clickeo(posibilidad)
                    }
                }
            }
            break;
        case '♜': 
            let cuatro = []
            let i = ubicacion[0]
            do {
                i++
                let nuevo = i + '-' + ubicacion[1]
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (i < 8);
            i = ubicacion[1]
            do {
                i++
                let nuevo = ubicacion[0] + '-' + i
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (i < 8);
            i = ubicacion[0]
            do {
                i--
                let nuevo = i + '-' + ubicacion[1]
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (i > 1);
            i = ubicacion[1]
            do {
                i--
                let nuevo = ubicacion[0] + '-' + i
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (i > 1);
            break
        case '♝': 
            let nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            nuevo = 0
            do {
                nuevo++
                let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
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
                    if (!dar_clickeo(este)) continue
                }
            }
            break
        case '♛': 
            let j = ubicacion[0]
            do {
                j++
                let nuevo = j + '-' + ubicacion[1]
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (j < 8);
            j = ubicacion[1]
            do {
                j++
                let nuevo = ubicacion[0] + '-' + j
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (j < 8);
            j = ubicacion[0]
            do {
                j--
                let nuevo = j + '-' + ubicacion[1]
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (j > 1);
            j = ubicacion[1]
            do {
                j--
                let nuevo = ubicacion[0] + '-' + j
                let este = document.getElementById(nuevo)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (j > 1);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) + diagonales) + '-' + (Number(ubicacion[1]) + diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) - diagonales) + '-' + (Number(ubicacion[1]) - diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) - diagonales) + '-' + (Number(ubicacion[1]) + diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
                } else break
            } while (true);
            diagonales = 0
            do {
                diagonales++
                let lugar = (Number(ubicacion[0]) + diagonales) + '-' + (Number(ubicacion[1]) - diagonales)
                let este = document.getElementById(lugar)
                if (este) {
                    if (!dar_clickeo(este)) break
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
    // ws.send(JSON.stringify(tipo))
}

function movimiento(data) {
    let original = document.getElementById(tipo['original'])
    original.classList.remove('negras', 'blancas')
    tipo['nuevo'] = data.id
    tipo['usuario'] = client_id
    if (data.classList.contains('negras')) {
        data.classList.remove('negras')
    } else if (data.classList.contains('blancas')) {
        data.classList.remove('blancas')
    }
    if (data.innerText == '♚') {
        tipo['ganado'] = true
    } else tipo['ganado'] = false
    eliminar()
    ws.send(JSON.stringify(tipo))
}

llenar_datos()