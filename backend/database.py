import os
from sqlmodel import SQLModel, create_engine, Session

# En producción (Render) define DATABASE_URL con la cadena de conexión de Supabase
# (Postgres). En desarrollo local, si no está definida, se usa SQLite.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./observatorio.db")

# Supabase entrega URLs con el esquema "postgres://"; SQLAlchemy 2.x requiere "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
