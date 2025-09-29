import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    conn = psycopg2.connect(
        host="dpg-d3cmd6t6ubrc73eu9ln0-a.virginia-postgres.render.com",
        database="condotrack_development",
        user="condotrack_development_user",
        password="v2GBkZ8WkXDp27eeJ79yvNKtgwcgBivQ",
        port="5432"
    )
    return conn
