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
    for esto in Partidas.find({'completo': False}): 
        lista.append(esto)
    return lista

async def buscar_partida(id : int): 
    esto = Partidas.find_one({'id': id})
    return Partida(id=esto['id'], 
                   creacion=esto['creacion'],  
                   participantes=esto['participantes'], 
                   estado=esto['estado'], 
                   completo=esto['completo'])

async def Borrar_Partida(id : int): 
    Partidas.delete_one({'id': id})