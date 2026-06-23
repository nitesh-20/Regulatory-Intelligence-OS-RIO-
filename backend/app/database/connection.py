import os
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

# SQLAlchemy Setup
engine = create_engine(
    settings.POSTGRES_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
