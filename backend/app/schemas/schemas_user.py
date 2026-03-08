from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
# Pydantic схемы используются для валидации данных
# и определения структуры запросов/ответов API

# Базовая схема пользователя (общие поля)
class UserBase(BaseModel):
    # phone : str
    email: EmailStr  # Валидация email
    name: str
    is_admin: bool = False


# Схема для создания пользователя (наследуется от UserBase)
class UserCreate(UserBase):
    password: str  # Пароль (не хешированный)

    # Конфигурация для Pydantic v2
    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "secretpassword"
            }
        }
    }


# Схема для обновления пользователя (все поля опциональны)
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None


# Схема для ответа (то, что возвращаем клиенту)
class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    # Включаем поддержку ORM (преобразование SQLAlchemy модели в Pydantic)
    model_config = ConfigDict(from_attributes=True)


# Схема для отображения в списке (без чувствительных данных)
class UserInDB(UserResponse):
    hashed_password: str  # Только для внутреннего использования
