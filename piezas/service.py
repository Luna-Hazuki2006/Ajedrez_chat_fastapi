from db import Piezas
from piezas.schemas import Pieza

async def Crear_Pieza(pieza : Pieza): 
    cantidad = Piezas.count_documents({})
    pieza.id = cantidad + 1
    if Piezas.insert_one(dict(pieza)).inserted_id: 
        return pieza
    else: return 'No se pudo crear la pieza'

async def Listar_Piezas(): 
    lista = []
    [lista.append(dict(Pieza(
        id=esto['id'], 
        nombre=esto['nombre'], 
        valor=esto['valor'], 
        imagen=esto['imagen']))) 
        for esto in Piezas.find({})]
    return lista

async def Borrar_Pieza(id : int): 
    Piezas.delete_one({'id': id})