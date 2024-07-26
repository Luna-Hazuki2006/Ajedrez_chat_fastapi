from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, status, Response
# from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from posibilidades import router as posibilidades
from piezas import router as piezas
from partidas import router as partidas
from usuarios import router as usuarios
from usuarios.exceptions import LoginExpired, RequiresLoginException
import json
import time

app = FastAPI()

app.mount("/static", StaticFiles(directory="./static"), name="static")

templates = Jinja2Templates(directory="./templates")

app.include_router(posibilidades.router, prefix='/posibilidades', tags=['Posibilidades'])
app.include_router(piezas.router, prefix='/piezas', tags=['Piezas'])
app.include_router(partidas.router, prefix='/partidas', tags=['Partidas'])
app.include_router(usuarios.router, tags=['usuarios'])

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
async def obtener(request : Request):
    return RedirectResponse(url='/partidas', status_code=status.HTTP_303_SEE_OTHER)

@app.get('/juego')
async def obtener(request : Request): 
    return templates.TemplateResponse('juego.html', {'request': request})


@app.exception_handler(RequiresLoginException)
async def exception_handler(request: Request, exc: RequiresLoginException) -> Response:
    return templates.TemplateResponse("message-redirection.html", {
        "request": request, "message": exc.message, 
        "path_route": exc.path_route, "path_message": exc.path_message})

@app.exception_handler(LoginExpired)
async def exception_handler(request: Request, exc: RequiresLoginException) -> Response:
    return templates.TemplateResponse("message-redirection.html", {
        "request": request, "message": exc.message, 
        "path_route": exc.path_route, "path_message": exc.path_message})


@app.middleware("http")
async def create_auth_header(request: Request, call_next,):
    '''
    Check if there are cookies set for authorization. If so, construct the
    Authorization header and modify the request (unless the header already
    exists!)
    '''
    if ("Authorization" not in request.headers 
        and "Authorization" in request.cookies
        ):
        access_token = request.cookies["Authorization"]
        
        request.headers.__dict__["_list"].append(
            (
                "authorization".encode(),
                 f"Bearer {access_token}".encode(),
            )
        )
    elif ("Authorization" not in request.headers 
        and "Authorization" not in request.cookies
        ): 
        request.headers.__dict__["_list"].append(
            (
                "authorization".encode(),
                 f"Bearer 12345".encode(),
            )
        )
        
    response = await call_next(request)
    return response    

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    data = {
        'tipo': 'mensaje', 
        'valor': f"Client #{client_id} has entered the chat"
    }
    await manager.broadcast(json.dumps(data))
    try:
        while True:
            data = await websocket.receive_text()
            real = json.loads(data)
            if real['tipo'] == 'mensaje': 
                valor = real['valor']
                real['valor'] = f"You wrote: {valor}"
                await manager.send_personal_message(json.dumps(real), websocket)
                real['valor'] = f"Client #{client_id} says: {valor}"
                await partidas.servicio.mandar_mensaje(id=real['id'], mensaje=real['valor'])
                await manager.broadcast(json.dumps(real))
            if real['tipo'] == 'movimiento': 
                await partidas.servicio.mover_pieza(id=real['id'], 
                                                       original=real['original'], 
                                                       nueva=real['nuevo'], 
                                                       pieza=real['valor'])
                # await manager.send_personal_message(json.dumps(real), websocket)
                await manager.broadcast(json.dumps(real))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        data = {
            'tipo': 'mensaje', 
            'valor': f"Client #{client_id} left the chat"
        }
        await manager.broadcast(json.dumps(data))