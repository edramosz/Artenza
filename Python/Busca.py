from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Inicializa Firebase
cred = credentials.Certificate(".json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def buscar_produtos_semelhantes(texto):
    vetor_consulta = model.encode([texto])

    docs = db.collection("produtos").stream()
    produtos = []
    vetores = []

    for doc in docs:
        data = doc.to_dict()
        produtos.append(data)
        vetores.append(data["vetor"])

    similares = cosine_similarity(vetor_consulta, vetores)[0]
    indices = np.argsort(similares)[::-1][:5]
    return [produtos[i] for i in indices]
