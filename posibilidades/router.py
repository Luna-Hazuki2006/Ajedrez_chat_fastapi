from fastapi import APIRouter

router = APIRouter()

@router.get('')
async def listar_posibilidades(): 
    return []

@router.get('/pieza/{id}')
async def listar_posibilidades_pieza(id : int): 
    return []

