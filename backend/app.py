from flask import Flask
from Auth.routes import auth_bp

app = Flask(__name__)

# Registrando o blueprint
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)


# Exemplo de saída (o seu hash será diferente por causa do sal aleatório):
# Hash para salvar no DB: $2b$12$EAG.P3k3aJgjalHEVCHcFOaGjDIaY2IooM9aC8dGgpbFvOnCslp6C