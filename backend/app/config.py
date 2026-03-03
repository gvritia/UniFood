from dotenv import load_dotenv
import os

# загружает .env
try:
    load_dotenv(encoding='utf-8')
except UnicodeDecodeError:
    try:
        load_dotenv(encoding='cp1251')  # для Windows
    except UnicodeDecodeError:
        load_dotenv(encoding='latin-1')  # запасной вариант

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
except (TypeError, ValueError):
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    print("Предупреждение: Используется значение по умолчанию для ACCESS_TOKEN_EXPIRE_MINUTES = 30")