from pydantic import BaseModel
from typing import Union, Optional

class Pieza(BaseModel):
    id: Optional[int] = None
    nombre: str
    valor: Union[bool, float]
    imagen: Union[bytes, str]
    posibilidades: Optional[list] = None