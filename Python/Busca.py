from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from firebase_admin import credentials, db
import firebase_admin
import numpy as np

# Carrega modelo de embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

# Inicializa o Firebase com Realtime Database
cred = credentials.Certificate("seu-arquivo-firebase.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://trabalhofinalloja-default-rtdb.firebaseio.com/"
})

def buscar_produtos_semelhantes(texto):
    # Vetor da consulta
    vetor_consulta = model.encode([texto])

    # Referência ao caminho 'produtos' no Realtime Database
    ref = db.reference("produtos")
    produtos_dict = ref.get()

    produtos = []
    vetores = []

    for produto_id, data in produtos_dict.items():
        if "vetor" in data:
            produtos.append({**data, "id": produto_id})  # adiciona o ID ao dict
            vetores.append(data["vetor"])

    if not vetores:
        return []

    # Converte vetores para array numpy
    vetores = np.array(vetores)
    similares = cosine_similarity(vetor_consulta, vetores)[0]

    # Ordena os índices pela similaridade (maior primeiro)
    indices = np.argsort(similares)[::-1][:5]

    # Retorna os 5 produtos mais semelhantes
    return [produtos[i] for i in indices]
