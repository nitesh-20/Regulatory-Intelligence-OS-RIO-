import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_URL: str = os.getenv("POSTGRES_URL", "postgresql://rio_user:rio_password@localhost:5432/rio_db")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Fallback database location (local sqlite inside workspace or tmp in Vercel)
if os.getenv("VERCEL") or os.getenv("NOW_REGION"):
    SQLITE_URL = "sqlite:////tmp/rio_db.sqlite"
else:
    db_dir = os.path.dirname(os.path.abspath(__file__))
    SQLITE_URL = f"sqlite:///{os.path.join(db_dir, 'rio_db.sqlite')}"

engine = None
try:
    print(f"[Database] Connecting to PostgreSQL at {settings.POSTGRES_URL}...")
    engine = create_engine(
        settings.POSTGRES_URL,
        pool_size=20,
        max_overflow=0,
        pool_pre_ping=True
    )
    # Validate connection
    with engine.connect() as conn:
        print("[Database] PostgreSQL connection established.")
except Exception as e:
    print(f"[Database] PostgreSQL connection failed: {e}. Falling back to SQLite.")
    engine = create_engine(
        SQLITE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
