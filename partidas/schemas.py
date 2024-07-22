from pydantic import BaseModel
from typing import Union, Optional
from datetime import datetime

class Partida(BaseModel):
    id: Optional[int] 
    creacion: Union[datetime, int]
    participantes: Optional[list] = None
    estado: str
    completo: bool