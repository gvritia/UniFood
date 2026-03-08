from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from ..db import Base

# Модель SQLAlchemy - это описание таблицы в базе данных
class User(Base):
    # Имя таблицы в базе данных
    __tablename__ = "users"

    # Колонки таблицы
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    # phone = Column(String, unique=True, index=True)
    is_admin: bool = Column(Boolean, default=False, nullable=False)  # ← новое поле
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"