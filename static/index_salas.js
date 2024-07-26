let gran_lista = document.getElementById('salas')
let saludos = document.getElementById('saludos')

function revisar() {
    if (localStorage.getItem('nombre_personal')) {
        let nombre = localStorage.getItem('nombre_personal')
        saludos.innerText = 'Partidas para ti, ' + nombre
        let crear = document.getElementById('crear')
        crear.innerText = '¡Crea una partida ' + nombre + '!'
        let cambiar = document.getElementById('cambiar')
        cambiar.innerText = '¡Cambia de nombre!'
    }
}

function recargar() {
    location.reload()
}

function personalizar() {
    let personal = document.getElementById('nombre')
    localStorage.setItem('nombre_personal', personal.value)
    recargar()
}

revisar()