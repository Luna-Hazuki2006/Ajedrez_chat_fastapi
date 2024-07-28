var client_id = Date.now()
let real = document.getElementById('real')
let tabla = document.getElementById('tablero')
let actualidad = document.getElementById('actualidad')
let comidas_blancas = document.getElementById('comidas_blancas')
let comidas_negras = document.getElementById('comidas_negras')
let poder = document.getElementById('poder')
let tipo = {}
document.querySelector("#ws-id").textContent = client_id;
let cambio = new Audio("https://ajedrez-chat-fastapi.onrender.com/static/audio/mover.ogg")
// var ws = new WebSocket(`wss://ajedrez-chat-fastapi.onrender.com/ws/${client_id}`);
var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
console.log(ws);
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
        if (data['turno'] == 'blancas') poder.value = 'negras'
        else if (data['turno'] == 'negras') poder.value = 'blancas'
        comer(nueva)
        pausar()
        recordar()
        if (nueva) {
            cambio.play()
            nueva.classList.remove('negras')
            nueva.classList.remove('blancas')
            if (data['color'] == 'negras') {
                nueva.classList.add('negras')
            } else if (data['color'] == 'blancas') {
                nueva.classList.add('blancas')
            }
            borrar.innerText = '+'
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
        console.log(nueva);
        confirmar()
    }
};
function sendMessage(event) {
    var input = document.getElementById("messageText")
    let tipo = {
        'tipo': 'mensaje', 
        'valor': input.value, 
        'id': real.value
    } 
    if (localStorage.getItem('nombre_personal')) {
        let nombre = localStorage.getItem('nombre_personal')
        tipo['nombre_real'] = nombre
    } else tipo['nombre_real'] = ''
    ws.send(JSON.stringify(tipo))
    input.value = ''
    event.preventDefault()
}

function confirmar() {
    console.log('confirmar');
    let lista = document.getElementsByTagName('td')
    if (lista) {
        for (const esto of lista) {
            reasignar(esto)
            esto.classList.remove('jaque')
        }
    }
    lista = document.getElementsByTagName('td')
    conseguir(lista)
}

function conseguir(lista) {
    for (const esto of lista) {
        let ubicacion = esto.id.split('-')
        if (esto.innerText == '+') {
            continue
        }
        if (esto.innerText == '♟' || esto.innerText == '♙') {
            movimiento_peon(ubicacion, esto, true)
        } else if (esto.innerText == '♕' || esto.innerText == '♛') {
            movimiento_alfil(ubicacion, true)
            movimiento_torre(ubicacion, true)
        } else if (esto.innerText == '♖' || esto.innerText == '♜') {
            movimiento_torre(ubicacion, true)
        } else if (esto.innerText == '♘' || esto.innerText == '♞') {
            movimiento_caballo(ubicacion, true)
        } else if (esto.innerText == '♗' || esto.innerText == '♝') {
            movimiento_alfil(ubicacion, true)
        }
    }
}

function comer(nueva) {
    if (nueva.innerText == '|' || nueva.innerText == '+') return
    if (nueva.innerText == '♙' || nueva.innerText == '♕' || nueva.innerText == '♔' || 
        nueva.innerText == '♖' || nueva.innerText == '♘' || nueva.innerText == '♗'
    ) {
        comidas_negras.innerText += nueva.innerText
    } else if (nueva.innerText == '♟' || nueva.innerText == '♛' || nueva.innerText == '♚' || 
                nueva.innerText == '♜' || nueva.innerText == '♞' || nueva.innerText == '♝'
    ) {
        comidas_blancas.innerText += nueva.innerText
    }
}

function llenar_datos() {
    if (localStorage.getItem('nombre_personal')) {
        let nombre = localStorage.getItem('nombre_personal')
        let id = document.getElementById('ws-id')
        id.classList.add('invisible')
        let mayor = id.parentElement
        mayor.innerText = '¿Listo para jugar ' + nombre + '?'
    }
    let verdad = false
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) { 
            verdad = !verdad
            let td = document.getElementById(i + '-' + j)
            if (i == 2 || i == 7) {
                if (i == 2) {
                    td.classList.add('blancas')
                } else if (i == 7) {
                    td.classList.add('negras')
                }
            } else if (i == 1 || i == 8) {
                if (i == 1) {
                    td.classList.add('blancas')
                } else if (i == 8) {
                    td.classList.add('negras')
                }
            }
            if (verdad) td.classList.add('blanca')
            else td.classList.add('negra')
        }
        verdad = !verdad
    }
    if (actualidad.value === 'True') {
        pausar()
    }
    confirmar()
    recordar()
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

function reasignar(esto) {
    esto.classList.remove('negras')
    esto.classList.remove('blancas')
    switch (esto.innerText) {
        case '♝':
            esto.classList.add('negras')
            break;
        case '♗': 
            esto.classList.add('blancas')
            break;
        case '♞':
            esto.classList.add('negras')
            break;
        case '♘': 
            esto.classList.add('blancas')
            break;
        case '♜':
            esto.classList.add('negras')
            break;
        case '♖': 
            esto.classList.add('blancas')
            break; 
        case '♟':
            esto.classList.add('negras')
            break;
        case '♙': 
            esto.classList.add('blancas')
            break; 
        case '♛':
            esto.classList.add('negras')
            break;
        case '♕': 
            esto.classList.add('blancas')
            break; 
        case '♚':
            esto.classList.add('negras')
            break;
        case '♔': 
            esto.classList.add('blancas')
            break; 
        default:
            break;
    }
}

function recordar() {
    let todos = document.getElementsByTagName('td')
    let turno = poder.value
    for (const esto of todos) {
        if (esto.innerText != '|' && esto.innerText != '+') {
            if (esto.classList.contains(turno)) {
                esto.setAttribute('onclick', 'mover(this);')
                esto.setAttribute('ondblclick', 'eliminar();')
                reasignar(esto)
            }
        }
    }
}

function pausar() {
    let todos = document.getElementsByTagName('td')
    for (const esto of todos) {
        if (esto.innerText != '|' && esto.innerText != '+') {
            esto.removeAttribute('onclick')
            esto.removeAttribute('ondblclick')
            reasignar(esto)
        } else {
            esto.removeAttribute('onclick')
        }
    }
}

function dar_clickeo(nuevo, ubicacion, prueba = false) { 
    console.log(prueba);
    let este = document.getElementById(ubicacion[0] + '-' + ubicacion[1])
    let color = (este.classList.contains('negras')) ? 'negras' : 'blancas'
    if (nuevo.classList.contains(color) && nuevo.innerText != '+' || este.innerText == '+') {
        return false
    } 
    if (prueba) {
        if (nuevo.innerText == '♚' || nuevo.innerText == '♔') {
            nuevo.classList.add('jaque')
        }
    } else {
        nuevo.classList.add('oportunidad')
        nuevo.setAttribute('onclick', 'movimiento(this);')
        nuevo.removeAttribute('ondblclick')
    }
    if ((nuevo.classList.contains('blancas') || nuevo.classList.contains('negras')) && 
        (nuevo.innerText != '+' && nuevo.innerText != '|')) {
        return false
    }
    return true
}

function movimiento_peon(ubicacion, data, prueba = false) {
    if (ubicacion[0] == 2 && data.innerText == '♙') {
        let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
        if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
            posibilidad = document.getElementById(Number(ubicacion[0]) + 2 + '-' + ubicacion[1])
            if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            } 
        } 
        posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))
        if (posibilidad?.classList.contains('negras')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
        }
        posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))
        if (posibilidad?.classList.contains('negras')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
        }
    } else if (ubicacion[0] == 7 && data.innerText == '♟') {
        let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
        if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
            posibilidad = document.getElementById(Number(ubicacion[0]) - 2 + '-' + ubicacion[1])
            if (posibilidad && !posibilidad?.classList.contains('blancas') && !posibilidad?.classList.contains('negras')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
        }
        posibilidad = document.getElementById((Number(ubicacion[0])) - 1 + '-' + (Number(ubicacion[1]) + 1))
        if (posibilidad?.classList.contains('blancas')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
        }
        posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))
        if (posibilidad?.classList.contains('blancas')) {
            dar_clickeo(posibilidad, ubicacion, prueba)
        }
    } else {
        if (data.innerText == '♙') {
            let posibilidad = document.getElementById(Number(ubicacion[0]) + 1 + '-' + ubicacion[1])
            if (posibilidad && (posibilidad?.innerText == '|' || posibilidad?.innerText == '+')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            } 
            posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))

            if (posibilidad?.classList.contains('negras')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
            posibilidad = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))

            if (posibilidad?.classList.contains('negras')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
        } else if (data.innerText == '♟') {
            let posibilidad = document.getElementById(Number(ubicacion[0]) - 1 + '-' + ubicacion[1])
            if (posibilidad && (posibilidad?.innerText == '|' || posibilidad?.innerText == '+')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
            posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) + 1))

            if (posibilidad?.classList.contains('blancas')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
            posibilidad = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))

            if (posibilidad?.classList.contains('blancas')) {
                dar_clickeo(posibilidad, ubicacion, prueba)
            }
        }
    }
}

function movimiento_torre(ubicacion, prueba = false) {
    let cuatro = []
    let i = ubicacion[0]
    do {
        i++
        let nuevo = i + '-' + ubicacion[1]
        let este = document.getElementById(nuevo)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (i < 8);
    i = ubicacion[1]
    do {
        i++
        let nuevo = ubicacion[0] + '-' + i
        let este = document.getElementById(nuevo)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (i < 8);
    i = ubicacion[0]
    do {
        i--
        let nuevo = i + '-' + ubicacion[1]
        let este = document.getElementById(nuevo)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (i > 1);
    i = ubicacion[1]
    do {
        i--
        let nuevo = ubicacion[0] + '-' + i
        let este = document.getElementById(nuevo)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (i > 1);
}

function movimiento_alfil(ubicacion, prueba = false) {
    let nuevo = 0
    do {
        nuevo++
        let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
        let este = document.getElementById(lugar)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (true);
    nuevo = 0
    do {
        nuevo++
        let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
        let este = document.getElementById(lugar)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (true);
    nuevo = 0
    do {
        nuevo++
        let lugar = (Number(ubicacion[0]) - nuevo) + '-' + (Number(ubicacion[1]) + nuevo)
        let este = document.getElementById(lugar)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (true);
    nuevo = 0
    do {
        nuevo++
        let lugar = (Number(ubicacion[0]) + nuevo) + '-' + (Number(ubicacion[1]) - nuevo)
        let este = document.getElementById(lugar)
        if (este) {
            if (!dar_clickeo(este, ubicacion, prueba)) break
        } else break
    } while (true);
}

function movimiento_caballo(ubicacion, prueba = false) {
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
            if (!dar_clickeo(este, ubicacion, prueba)) continue
        }
    }
}

function movimiento_rey(ubicacion, prueba = false) {
    let este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + ubicacion[1])
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + ubicacion[1])
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) + 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById((Number(ubicacion[0]) + 1) + '-' + (Number(ubicacion[1]) - 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) + 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById((Number(ubicacion[0]) - 1) + '-' + (Number(ubicacion[1]) - 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById(ubicacion[0] + '-' + (Number(ubicacion[1]) + 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
    este = document.getElementById(ubicacion[0] + '-' + (Number(ubicacion[1]) - 1))
    if (este) dar_clickeo(este, ubicacion, prueba)
}

function mover(data) {
    eliminar()
    let pieza = data.innerText
    tipo = {
        'tipo': 'movimiento', 
        'valor': pieza, 
        'original': data.id, 
        'id': real.value
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
            movimiento_peon(ubicacion, data)
            break;
        case '♙': 
            movimiento_peon(ubicacion, data)
            break;
        case '♜': 
            movimiento_torre(ubicacion)
            break;
        case '♖': 
            movimiento_torre(ubicacion)
            break;
        case '♝': 
            movimiento_alfil(ubicacion)
            break
        case '♗':
            movimiento_alfil(ubicacion) 
            break
        case '♞': 
            movimiento_caballo(ubicacion)
            break
        case '♘':
            movimiento_caballo(ubicacion) 
            break
        case '♛': 
            movimiento_alfil(ubicacion)
            movimiento_torre(ubicacion)
            break
        case '♕': 
            movimiento_alfil(ubicacion)
            movimiento_torre(ubicacion)
            break
        case '♚': 
            movimiento_rey(ubicacion)
            break
        case '♔':
            movimiento_rey(ubicacion) 
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
    tipo['turno'] = poder.value
    if (data.classList.contains('negras')) {
        data.classList.remove('negras')
    } else if (data.classList.contains('blancas')) {
        data.classList.remove('blancas')
    }
    if (data.innerText == '♚' || data.innerText == '♔') {
        tipo['ganado'] = true
    } else tipo['ganado'] = false
    eliminar()
    console.log(tipo);
    if (localStorage.getItem('nombre_personal')) {
        let nombre = localStorage.getItem('nombre_personal')
        tipo['nombre_real'] = nombre
    } else tipo['nombre_real'] = ''
    ws.send(JSON.stringify(tipo))
}

llenar_datos()