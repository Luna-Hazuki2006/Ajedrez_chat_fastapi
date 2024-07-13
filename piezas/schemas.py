from pydantic import BaseModel
from typing import Union

class Pieza(BaseModel):
    id: int
    nombre: str
    valor: float
    imagen: Union[str, bytes]