# точка входа FastAPI
from fastapi import FastAPI
from app.db import engine, Base # проблема с импортом из-за ошибки в файле db.py
from app.routers import routers_user
from app.api.auth import router as api_router
from app.routers import routers_menu

# Создаем все таблицы в базе данных
# В продакшене лучше использовать Alembic для миграций
Base.metadata.create_all(bind=engine)

# Создаем экземпляр FastAPI
app = FastAPI(
    title="User Management API",
    description="Простой API для управления пользователями",
    version="1.0.0"
)

# Подключаем роутеры
app.include_router(routers_user.router)
app.include_router(api_router)
app.include_router(routers_menu.router)

@app.get("/")
def root():
    return {"message": "Добро пожаловать в API управления пользователями"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}