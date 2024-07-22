from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Usuario(BaseModel):
    nombre_usuario: str 
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    imagen: Optional[bytes] = None
    nacimiento: Optional[datetime] = None
    contraseña: str