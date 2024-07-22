from fastapi import APIRouter, Depends, Request, Form, status, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from usuarios.service import AuthHandler, Registrar
from usuarios.schemas import Usuario
from datetime import datetime

router = APIRouter()

auth_handler = AuthHandler()

templates = Jinja2Templates(directory="./templates")

@router.get('/registrar', response_class=HTMLResponse)
def registrar_usuario(request: Request):
    hoy = datetime.now()
    hoy = hoy.strftime('%Y-%m-%d')
    return templates.TemplateResponse("registrar_usuario.html", {
        'request': request, 'hoy': hoy})

@router.post('/registrar', response_class=HTMLResponse)
async def registrar_usuario(request: Request, 
                      nombre_usuario: str = Form(...), 
                      nombres: str = Form(...), 
                      apellidos: str = Form(...), 
                      imagen: bytes = Form(...), 
                      nacimiento: datetime = Form(...), 
                      correo: str = Form(...), 
                      contraseña: str = Form(...)):
    usuario = Usuario(
        nombre_usuario=nombre_usuario, 
        nombres=nombres, 
        apellidos=apellidos, 
        imagen=imagen, 
        nacimiento=nacimiento, 
        correo=correo, 
        contraseña=contraseña, 
    )
    respuesta = await Registrar(usuario=usuario)
    if type(respuesta) != str:
        return RedirectResponse(url='/iniciar_sesion', status_code=status.HTTP_303_SEE_OTHER)
    else: return respuesta

@router.get('/iniciar_sesion')
def registrar_usuario(request: Request):
    return templates.TemplateResponse("iniciar_sesion.html", {
        'request': request})

@router.post('/iniciar_sesion')
async def iniciar_sesion(request: Request, 
                         response: Response, 
                         nombre_usuario: str = Form(...), 
                         contraseña: str = Form(...)): 
    usuario = await auth_handler.authenticate_user(nombre_usuario, contraseña)
    try:
        if usuario: 
            nombre_completo = f'{usuario.nombres} {usuario.apellidos}'
            atoken = auth_handler.create_access_token(data={'nombre_usuario': usuario.nombre_usuario, 'nombre_completo': nombre_completo})
            response = templates.TemplateResponse("principal.html", 
                {"request": request, "nombre_completo": nombre_completo})
            response.set_cookie(key="Authorization", value= f"{atoken}", httponly=True)
            return response
        else: return 'No se pudo iniciar sesión'
            # return templates.TemplateResponse("error.html",
            # {"request": request, 'detail': 'Incorrect Username or Password', 'status_code': 404 })

    except Exception as err:
        return 'no se pudo iniciar sesión'
        # return templates.TemplateResponse("error.html",
        #     {"request": request, 'detail': 'Incorrect Username or Password', 'status_code': 401 })
    
@router.get('/logout')
async def logout(request: Request, response: Response):
    response = templates.TemplateResponse("success.html", 
                    {"request": request, "nombre_completo": "", "success_msg": "Hasta luego vuelve pronto",
                    "path_route": '/', "path_msg": "Inicio"})
    response.delete_cookie(key="Authorization")
    return response