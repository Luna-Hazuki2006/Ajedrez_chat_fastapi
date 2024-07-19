from fastapi import APIRouter
from partidas.schemas import Partida
import partidas.service as servicio

router = APIRouter()

@router.get('', response_model=list[Partida])
async def listar_partidas(): 
    lista = await servicio.Listar_Partidas()
    return lista

@router.get('/{id}')
async def obtener_parida(id : int): 
    return []

@router.post('')
async def crear_parida(parida : Partida): 
    creada = await servicio.Crear_Partida(parida)
    return creada

@router.put('/{id}')
async def modificar_parida(id : int, parida : Partida): 
    return []

@router.delete('/{id}')
async def borrar_partida(id : int): 
    return await servicio.Borrar_Pieza(id)