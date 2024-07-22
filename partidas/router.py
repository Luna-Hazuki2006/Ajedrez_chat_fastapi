from fastapi import APIRouter, Request
from partidas.schemas import Partida
import partidas.service as servicio
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="./templates")

@router.get('')
async def listar_partidas(request : Request): 
    lista = await servicio.Listar_Partidas()
    return templates.TemplateResponse('principal.html', {
        'request': request, 'lista': lista
    })

@router.get('/{id}')
async def obtener_partida(id : int): 
    return []

@router.post('/crear_partida')
async def crear_partida(parida : Partida): 
    creada = await servicio.Crear_Partida(parida)
    return creada

@router.put('/{id}')
async def modificar_partida(id : int, parida : Partida): 
    return []

@router.delete('/{id}')
async def borrar_partida(id : int): 
    return await servicio.Borrar_Pieza(id)