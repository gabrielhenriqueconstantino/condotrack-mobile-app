import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    conn = psycopg2.connect(
    //apagando as credenciais do database pra ninguém ver
    )
    return conn
