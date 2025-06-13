from fastapi import FastAPI
from pydantic import BaseModel
from busca import buscar_produtos_semelhantes

app = FastAPI()

class Consulta(BaseModel):
    texto: str

@app.post("/buscar")
def buscar(consulta: Consulta):
    return buscar_produtos_semelhantes(consulta.texto)
