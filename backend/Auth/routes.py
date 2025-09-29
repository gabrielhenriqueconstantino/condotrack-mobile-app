from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from database import get_db_connection

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, nome_completo, email, senha_hash FROM usuarios WHERE email = %s", (email,))
    user = cur.fetchone()
    conn.close()

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    user_id, nome_completo, email_db, senha_hash = user

    if not check_password_hash(senha_hash, senha):
        return jsonify({'error': 'Senha incorreta'}), 401

    # Aqui você pode gerar um token JWT se quiser
    return jsonify({'message': 'Login realizado com sucesso', 'user': {'id': user_id, 'nome': nome_completo, 'email': email_db}})
