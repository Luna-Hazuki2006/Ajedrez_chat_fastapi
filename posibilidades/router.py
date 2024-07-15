from fastapi import APIRouter
from posibilidades.schemas import Posibilidad

router = APIRouter()

@router.get('')
async def listar_posibilidades(): 
    return []

@router.get('/pieza/{id}')
async def listar_posibilidades_pieza(id : int): 
    return []

@router.get('/{id}')
async def obtener_posibilidad(id : int): 
    return []

@router.post('')
async def crear_posibilidad(posibilidad : Posibilidad): 
    return []

@router.put('/{id}')
async def modificar_posibilidad(id : int, posibilidad : Posibilidad): 
    return []

@router.delete('/{id}')
async def eliminar_posibilidad(id : int): 
    return []