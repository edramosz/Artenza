# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import firebase_admin
from firebase_admin import credentials, db

# Inicializa o Flask e permite CORS
app = Flask(__name__)
CORS(app)

# Inicializa o Firebase
cred = credentials.Certificate("seu-arquivo-firebase.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://trabalhofinalloja-default-rtdb.firebaseio.com/"
})

# Carrega o modelo de embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

# Rota para receber a string de busca
@app.route("/buscar", methods=["POST"])
def buscar():
    data = request.get_json()
    termo = data.get("termo")

    if not termo:
        return jsonify({"erro": "Termo de busca não fornecido"}), 400

    # Exemplo: busca no Firebase
    ref = db.reference("produtos")  # substitua pelo seu caminho no Firebase
    dados = ref.get()

    if not dados:
        return jsonify([])

    resultados = []

    emb_busca = model.encode([termo])[0]

    for chave, item in dados.items():
        nome = item.get("nome", "")
        emb_nome = model.encode([nome])[0]
        similaridade = cosine_similarity([emb_busca], [emb_nome])[0][0]

        resultados.append({
            "id": chave,
            "nome": nome,
            "similaridade": round(float(similaridade), 4)
        })

    # Ordena por maior similaridade
    resultados.sort(key=lambda x: x["similaridade"], reverse=True)

    return jsonify(resultados)

if __name__ == "__main__":
    app.run(debug=True)
