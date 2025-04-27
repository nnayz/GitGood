import psycopg2
from sqlalchemy import create_engine as create_engine_sqlalchemy
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager


def connect_to_db():
    """
    Connect to the database.
    """
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="gitsum",
            user="nayz",
            port="5432"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        return None
    
def run_sql_file(sql_file_path: str):
    """
    Run a .sql file to initialize the database.
    """
    conn = connect_to_db()
    if conn is None:
        print("Failed to connect to the database. Cannot run the SQL file.")
        return
    try:
        with conn, conn.cursor() as cur:
            with open(sql_file_path, "r") as f:
                sql = f.read()
                cur.execute(sql)
            print(f"SQL file {sql_file_path} executed successfully.")
    except Exception as e:
        print(f"Error executing SQL file {sql_file_path}: {str(e)}")
    finally:
        conn.close()


def create_engine():
    """
    Create an SQLAlchemy engine to connect to the database.
    """
    engine = create_engine_sqlalchemy("postgresql://nayz@localhost:5432/gitsum")
    return engine

engine = create_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

run_sql_file("database/sql_tables.sql")

# Database session management
@contextmanager
def get_session():
    """
    Get a database session.
    """
    session = SessionLocal()
    try:
        yield session
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

