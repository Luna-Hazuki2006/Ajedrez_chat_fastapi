from db import Partidas
from partidas.schemas import Partida

async def Crear_Partida(pieza : Partida): 
    cantidad = Partidas.count_documents({})
    pieza.id = cantidad + 1
    if Partidas.insert_one(dict(pieza)).inserted_id: 
        return pieza
    else: return 'No se pudo crear la partida'

async def Listar_Partidas(): 
    lista = []
    [lista.append(dict(Partida(
        id=esto['id'], 
        creacion=esto['creacion']))) 
        for esto in Partidas.find({})]
    return lista

async def Borrar_Partida(id : int): 
    Partidas.delete_one({'id': id})