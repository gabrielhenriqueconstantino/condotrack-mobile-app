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

    cur.execute("""
        SELECT u.id, u.nome_completo, u.email, u.senha_hash, c.nome AS condominio_nome
        FROM usuarios u
        LEFT JOIN condominios c ON u.condominio_id = c.id
        WHERE u.email = %s
    """, (email,))
    user = cur.fetchone()
    conn.close()

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    user_id, nome_completo, email_db, senha_hash, condominio_nome = user

    if not check_password_hash(senha_hash, senha):
        return jsonify({'error': 'Senha incorreta'}), 401

    return jsonify({
        'message': 'Login realizado com sucesso',
        'user': {
            'id': user_id,
            'nome': nome_completo,
            'email': email_db,
            'condominio': condominio_nome
        }
    })
