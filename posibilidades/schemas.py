from pydantic import BaseModel

class Posibilidad(BaseModel):
    id: int
    X: bool
    Y: bool
    X_continuo: bool
    Y_continuo: bool
    Fusion: bool
    Separacion: bool
    Pasos: int