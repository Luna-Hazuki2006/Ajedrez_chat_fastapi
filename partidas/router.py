from fastapi import APIRouter, Request
from partidas.schemas import Partida
import partidas.service as servicio
from fastapi.templating import Jinja2Templates
from datetime import datetime

router = APIRouter()

templates = Jinja2Templates(directory="./templates")

@router.get('')
async def listar_partidas(request : Request): 
    lista = await servicio.Listar_Partidas()
    return templates.TemplateResponse('principal.html', {
        'request': request, 'lista': lista
    })

@router.get('/{id}')
async def obtener_partida(request : Request, id : int): 
    este = await servicio.buscar_partida(id)
    return templates.TemplateResponse('juego.html', {
        'request': request, 'creada': este
    })

@router.post('/anonimo')
async def crear_partida(request : Request): 
    hoy = datetime.today()
    partida = Partida(id=0, creacion=hoy, estado='creado', completo=False, 
                      tablero=[
                          ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'], 
                          ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], 
                          ['', '', '', '', '', '', '', ''], 
                          ['', '', '', '', '', '', '', ''], 
                          ['', '', '', '', '', '', '', ''], 
                          ['', '', '', '', '', '', '', ''], 
                          ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], 
                          ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜']
                      ])
    print(partida)
    creada = await servicio.Crear_Partida(partida)
    return templates.TemplateResponse('juego.html', {
        'request': request, 'creada': creada
    })

@router.put('/{id}')
async def modificar_partida(id : int, parida : Partida): 
    return []

@router.delete('/{id}')
async def borrar_partida(id : int): 
    return await servicio.Borrar_Pieza(id)
