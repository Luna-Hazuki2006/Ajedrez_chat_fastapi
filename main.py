from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
# from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from posibilidades import router as posibilidades
from piezas import router as piezas
from partidas import router as partidas
import json

app = FastAPI()

app.mount("/static", StaticFiles(directory="./static"), name="static")

templates = Jinja2Templates(directory="./templates")

app.include_router(posibilidades.router, prefix='/posibilidades', tags=['Posibilidades'])
app.include_router(piezas.router, prefix='/piezas', tags=['Piezas'])
app.include_router(partidas.router, prefix='/partidas', tags=['Partidas'])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.get("/")
async def get(request : Request):
    return templates.TemplateResponse('inicio.html', {'request':request})


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            real = json.loads(data)
            if real['tipo'] == 'mensaje': 
                valor = real['valor']
                real['valor'] = f"You wrote: {valor}"
                await manager.send_personal_message(json.dumps(real), websocket)
                real['valor'] = f"Client #{client_id} says: {valor}"
                await manager.broadcast(json.dumps(real))
            if real['tipo'] == 'movimiento': 
                # nuevo = str(real['original'])
                # lista = nuevo.split('-')
                # if real['color'] == 'blancas':
                #     nuevo = f'{int(lista[0]) + 2}-{lista[1]}'
                # elif real['color'] == 'negras': 
                #     nuevo = f'{int(lista[0]) - 2}-{lista[1]}'
                # real['nuevo'] = nuevo
                await manager.send_personal_message(json.dumps(real), websocket)
                await manager.broadcast(json.dumps(real))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        data = {
            'tipo': 'mensaje', 
            'valor': f"Client #{client_id} left the chat"
        }
        await manager.broadcast(json.dumps(data))