from fastapi import APIRouter

router = APIRouter()

@router.get('')
async def listar_piezas(): 
    return []

@router.get('/{id}')
async def listar_piezas(id : int): 
    return []

