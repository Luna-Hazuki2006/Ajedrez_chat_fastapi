from pydantic import BaseModel
from typing import Union, Optional
from datetime import datetime

class Partida(BaseModel):
    id: Optional[int] = None
    creacion: Union[datetime, int]
    participantes: list = []
    jugadores: list = []
    mensajes: list[str] = []
    comidas: list[str] = []
    movimientos: list[str] = []
    tablero: list[list]
    estado: str
    completo: bool