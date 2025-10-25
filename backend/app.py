from flask import Flask
from Auth.routes import auth_bp

app = Flask(__name__)

# Registrando o blueprint
app.register_blueprint(auth_bp)

if __name__ == '__main__':
     app.run(host="192.168.1.200", port=5000, debug=True)


