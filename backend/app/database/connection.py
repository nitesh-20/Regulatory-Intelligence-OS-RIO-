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

# Remove SQLite fallback to ensure strict production environment
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
    print(f"[Database] FATAL: PostgreSQL connection failed: {e}. Ensure docker-compose is running.")
    sys.exit(1)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
