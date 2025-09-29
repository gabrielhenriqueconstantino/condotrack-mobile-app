from werkzeug.security import generate_password_hash

senha = "admin"  # a senha que você quer para o usuário admin
hash_valido = generate_password_hash(senha)
print(hash_valido)
