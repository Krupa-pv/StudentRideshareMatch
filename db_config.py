import mysql.connector
from mysql.connector import Error

# database connection function
# TODO: change these credentials before running!!
def get_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            database='travel_match',
            user='root',
            password=''  # No password for fresh MySQL install
        )
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# test if connection works
def test_connection():
    conn = get_connection()
    if conn:
        print("Database connected successfully!")
        conn.close()
        return True
    else:
        print("Failed to connect to database")
        return False
