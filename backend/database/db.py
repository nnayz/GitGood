import psycopg2
from sqlalchemy import create_engine as create_engine_sqlalchemy
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

def connect_to_db():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="gitsum",
            user="postgres",
            password="postgres",
            port="5432"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        return None

def create_engine():
    engine = create_engine_sqlalchemy("postgresql://postgres:postgres@localhost:5432/gitsum")
    return engine

engine = create_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Database session management
@contextmanager
def get_session():
    session = SessionLocal()
    try:
        yield session
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

