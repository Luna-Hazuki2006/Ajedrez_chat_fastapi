from pydantic import BaseModel
from typing import Union, Optional
from datetime import datetime

class Partida(BaseModel):
    id: Optional[int] = None
    creacion: Union[datetime, int]
    participantes: Optional[list] = None
    jugadores: Optional[list] = None
    tablero: list[list]
    estado: str
    completo: bool