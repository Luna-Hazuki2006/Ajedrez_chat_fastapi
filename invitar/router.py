from typing import List
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter, Form, Depends, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
from usuarios.service import AuthHandler
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
# from reportlab.lib.pagesizes import LETTER
# from reportlab.lib.units import cm
# from reportlab.pdfgen.canvas import Canvas


# https://www.geeksforgeeks.org/sending-email-using-fastapi-framework-in-python/
# https://www.hostinger.es/tutoriales/como-usar-el-servidor-smtp-gmail-gratuito/

auth_handler = AuthHandler()

router = APIRouter()

templates = Jinja2Templates(directory="../templates")

class EmailSchema(BaseModel):
    email: List[EmailStr]

conf = ConnectionConfig(
    MAIL_USERNAME = "empresamariamoonlit72@gmail.com",
    MAIL_PASSWORD = "qmoz cnct ebek jnkn",
    MAIL_FROM = "empresamariamoonlit72@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="Chajedrez",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

router = APIRouter()

@router.post("")
async def mandar_simple(
        request: Request, 
        correo: EmailStr = Form(...)):
    emailFinal = EmailSchema(
        email= [
            correo
        ]
    )
    html = f"""
    <h1>Invitación cordial a Chajedrez</h1>
    <p>
        Hoy has sido cordialmente invitado a nuestra aplicación 'Chajedrez' <br>
        una aplicación web para para poder jugar ajedrez multijugador con chat incluído en tiempo real. <br>
        https://ajedrez-chat-fastapi.onrender.com/
    </p>
    """
    message = MessageSchema(
        subject="Invitación cordial a Chajedrez",
        recipients=emailFinal.model_dump().get('email'),
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    print("Fast mail: ", fm)
    await fm.send_message(message)
    # return JSONResponse(status_code=200, content={"message": "email has been sent"})
    return RedirectResponse(url='/', status_code=status.HTTP_303_SEE_OTHER)