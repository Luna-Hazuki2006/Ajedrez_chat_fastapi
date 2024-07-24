let gran_lista = document.getElementById('salas')
// var ws = new WebSocket(`wss://ajedrez-chat-fastapi.onrender.com/ws/${client_id}`);
// var ws = new WebSocket(`ws://localhost:8000/ws_salas`);
// ws.onmessage()
// ws.onmessage = function(event) {
//     data = JSON.parse(event.data)
//     console.log(data);
//     gran_lista.innerHTML = ''
//     for (const esto of data) {
//         let li = document.createElement('li')
//         let a = document.createElement('a')
//         a.href = '/partidas/' + esto['id']
//         a.innerText = esto['creacion']
//         li.appendChild(a)
//         gran_lista.appendChild(li)
//     }
// };

function recargar() {
    location.reload()
}