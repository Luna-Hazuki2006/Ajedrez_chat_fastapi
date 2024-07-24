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

async def mover_pieza(id : int, pieza : str, original : str, nueva : str): 
    print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    print(id)
    esto = []
    for todo in Partidas.find({}): 
        if int(todo['id']) == id: 
            print('////////////////////////////////////////////////////////////////////')
            break
    nueva_original = original.split('-')
    nueva_original = [int(nueva_original[0]) - 1, int(nueva_original[1]) - 1]
    nueva_nueva = nueva.split('-')
    nueva_nueva = [int(nueva_nueva[0]) - 1, int(nueva_nueva[1]) - 1]
    print('****************************************************************')
    print(esto)
    esto['tablero'][nueva_original[0]][nueva_original[1]] = ''
    esto['tablero'][nueva_nueva[0]][nueva_nueva[1]] = pieza
    Partidas.update_one({'id': id}, {'$set': {'tablero': esto['tablero']}})
    return {'id': id, 'pieza': pieza, 'original': original, 'nueva': nueva, 'tablero': esto['tablero']}