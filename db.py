import pymongo
import os

cliente = pymongo.MongoClient(os.environ.get('URL'))

db = cliente.Ajedrez

Movimientos = db.Movimientos
Piezas = db.Piezas
Posibilidades = db.Posibilidades
Partidas = db.Partidas
Usuarios = db.Usuarios

# https://manhwaweb.com/leer/los_diarios_de_la_boticaria_1703655104309-66