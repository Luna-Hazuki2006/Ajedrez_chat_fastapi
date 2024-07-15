import pymongo

cliente = pymongo.MongoClient('mongodb+srv://lunahazuki2006:cXU0lYhSncWZ12FM@cluster0.owjghpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

db = cliente.Ajedrez

Movimientos = db.Movimientos
Piezas = db.Piezas
Posibilidades = db.Posibilidades
Partidas = db.Partidas