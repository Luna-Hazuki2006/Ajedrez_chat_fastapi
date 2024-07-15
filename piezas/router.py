from fastapi import APIRouter
from piezas.schemas import Pieza
import piezas.service as servicio

router = APIRouter()

@router.get('', response_model=list[Pieza])
async def listar_piezas(): 
    lista = await servicio.Listar_Piezas()
    return lista

@router.get('/{id}')
async def obtener_pieza(id : int): 
    return []

@router.post('')
async def crear_pieza(pieza : Pieza): 
    creada = await servicio.Crear_Pieza(pieza)
    return creada

@router.put('/{id}')
async def modificar_pieza(id : int, pieza : Pieza): 
    return []

@router.delete('/{id}')
async def borrar_pieza(id : int): 
    return []