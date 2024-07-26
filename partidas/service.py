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
                   jugadores=esto['jugadores'], 
                   movimientos=esto['movimientos'], 
                   mensajes=esto['mensajes'], 
                   comidas=esto['comidas'], 
                   tablero=esto['tablero'], 
                   estado=esto['estado'], 
                   completo=esto['completo'])

async def Borrar_Partida(id : int): 
    Partidas.delete_one({'id': id})

async def mover_pieza(id : int, pieza : str, original : str, nueva : str): 
    print(id)
    esto = await buscar_partida(int(id))
    nueva_original = original.split('-')
    nueva_original = [int(nueva_original[0]) - 1, int(nueva_original[1]) - 1]
    nueva_nueva = nueva.split('-')
    nueva_nueva = [int(nueva_nueva[0]) - 1, int(nueva_nueva[1]) - 1]
    esto.tablero[nueva_original[0]][nueva_original[1]] = '' 
    if esto.tablero[nueva_nueva[0]][nueva_nueva[1]] != '': 
        esto.comidas.append(esto.tablero[nueva_nueva[0]][nueva_nueva[1]])
        if (esto.tablero[nueva_nueva[0]][nueva_nueva[1]] == '♔' or 
            esto.tablero[nueva_nueva[0]][nueva_nueva[1]] == '♚'):
            esto.completo = True
    esto.tablero[nueva_nueva[0]][nueva_nueva[1]] = pieza
    tamaño = len(esto.movimientos)
    esto.movimientos.insert(tamaño + 1, f'({pieza}){original}/{nueva}')
    Partidas.replace_one({'id': int(id)}, dict(esto))
    return {'id': id, 'pieza': pieza, 'original': original, 'nueva': nueva, 'tablero': esto.tablero, 'ganado': esto.completo}

async def mandar_mensaje(id : int, mensaje : str): 
    esto = await buscar_partida(int(id))
    esto.mensajes.append(mensaje)
    Partidas.replace_one({'id': int(id)}, dict(esto))