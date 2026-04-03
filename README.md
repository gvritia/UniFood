# Инструкция администратора системы UniFood

**Версия документа:** 1.0 (апрель 2026)  
**Автор:** UniFood Team  
**Назначение:** Полное руководство для администратора сервера/хостинга проекта.  
**Цель проекта:** MVP-система онлайн-заказа еды в столовой вуза (FastAPI + React).

Данная инструкция содержит **абсолютно все необходимые шаги** — от установки системы с нуля до ежедневного обслуживания, резервного копирования и восстановления.  
Инструкция написана максимально подробно — даже если вы впервые работаете с сервером, вы сможете всё настроить.

---

# 1. Требования к системе

## Минимальные требования (для разработки/тестирования)
- Операционная система: Windows 10/11 (рекомендуется), Linux, macOS
- Python: 3.10+
- Node.js: 18+ (лучше 20+)
- npm: 9+
- RAM: минимум 4 ГБ
- Диск: минимум 2 ГБ свободного места

## Рекомендуемые требования (для продакшена)
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- 8 ГБ RAM
- SSD диск

---

# 2. Установка программ (ОЧЕНЬ ПОДРОБНО)

## 2.1 Установка Python

1. Откройте браузер  
2. Перейдите на сайт: https://www.python.org/downloads/  
3. Нажмите кнопку **Download Python 3.12**  
4. После скачивания откройте файл `.exe`  
5. ВАЖНО: поставьте галочку  
   ✅ `Add Python to PATH`  
6. Нажмите `Install Now`  
7. Дождитесь завершения установки  

---

## 2.2 Установка Node.js

1. Перейдите на сайт: https://nodejs.org/  
2. Скачайте версию **LTS**  
3. Запустите установщик  
4. Нажимайте `Next` → `Next` → `Install`  
5. Дождитесь окончания установки  

---

## 2.3 Установка Git (необязательно)

1. Перейдите: https://git-scm.com/downloads  
2. Скачайте установщик  
3. Установите (везде нажимайте `Next`)  

---

## 2.4 Проверка установки

Откройте терминал:

- Нажмите `Win + R`  
- Введите `cmd`  
- Нажмите Enter  

Введите:

```bash
python --version
node --version
npm --version
````

Если отображаются версии — всё установлено корректно.

---

# 3. Подготовка проекта

## 3.1 Распаковка проекта

1. Скопируйте архив проекта
2. Распакуйте его в папку:

```
C:\Projects\UniFood\
```

Структура должна быть:

```
UniFood/
 ├── backend/
 ├── frontend/
 └── README.md
```

---

## 3.2 Создание виртуального окружения

Откройте терминал и выполните:

```bash
cd C:\Projects\UniFood\backend
py -m venv venv
```

Активация:

```bash
venv\Scripts\activate
```

Если всё правильно — увидите `(venv)`.

---

## 3.3 Установка зависимостей Backend

```bash
cd C:\Projects\UniFood\backend
py -m pip install -r requirements.txt
```

### ВАЖНО: фиксированные версии библиотек

```
fastapi==0.135.3
uvicorn[standard]==0.34.0
sqlalchemy==2.0.38
psycopg2-binary==2.9.10
pydantic[email]==2.10.6
python-jose[cryptography]==3.4.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
email-validator==2.2.0
bcrypt==4.3.0
```

---

## 3.4 Установка зависимостей Frontend

Откройте новый терминал:

```bash
cd C:\Projects\UniFood\frontend\unifood-frontend
npm install
```

### Используемые зависимости:

```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.9",
    "@mui/material": "^7.3.9",
    "axios": "^1.13.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.1.0",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "vite": "^8.0.1"
  }
}
```

---

# 4. Настройка конфигурации

## 4.1 Backend (.env)

Создайте файл:

```
C:\Projects\UniFood\backend\.env
```

Содержимое:

```env
DATABASE_URL=sqlite:///./unifood.db
SECRET_KEY=ВАШ_СЕКРЕТНЫЙ_КЛЮЧ
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Генерация SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Скопируйте результат и вставьте в `.env`.

---

## 4.2 Frontend (.env)

Создайте файл:

```
C:\Projects\UniFood\frontend\unifood-frontend\.env
```

Содержимое:

```env
VITE_API_URL=http://localhost:8001
```

---

## 4.3 Миграция базы данных

```bash
cd C:\Projects\UniFood\backend
py -m app.migrate_add_balance
```

---

# 5. Запуск проекта

## 5.1 Запуск Backend

```bash
cd C:\Projects\UniFood\backend
venv\Scripts\activate
py -m uvicorn app.main:app --reload --port 8001
```

Проверка:

* [http://localhost:8001/docs](http://localhost:8001/docs)
* [http://localhost:8001/health](http://localhost:8001/health)

---

## 5.2 Запуск Frontend

```bash
cd C:\Projects\UniFood\frontend\unifood-frontend
npm run dev
```

Откройте:

```
http://localhost:5173
```

---

# 6. Создание тестовых данных

```bash
cd C:\Projects\UniFood\backend
py -m app.create_sample_data
```

Данные администратора:

```
admin@unifood.ru
admin123
```

---

# 7. Админ-панель

1. Откройте сайт
2. Перейдите `/auth/login`
3. Введите данные администратора

Возможности:

* управление заказами
* изменение статусов
* просмотр пользователей
* статистика

---

# 8. Ежедневное обслуживание

Каждый день:

1. Проверяйте, что backend запущен
2. Проверяйте доступность frontend
3. Следите за ошибками в терминале

---

# 9. Резервное копирование

## 9.1 Создание backup.bat

Создайте файл:

```
C:\Projects\UniFood\backup.bat
```

Содержимое:

```batch
@echo off
set DATE=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%
mkdir "C:\Backups\UniFood\%DATE%"
copy "C:\Projects\UniFood\backend\unifood.db" "C:\Backups\UniFood\%DATE%\unifood.db"
xcopy "C:\Projects\UniFood" "C:\Backups\UniFood\%DATE%\UniFood\" /E /H /C /I
echo Backup created: %DATE%
pause
```

---

## 9.2 Автоматизация

1. Откройте Планировщик задач
2. Создайте задачу
3. Установите время: 23:00
4. Дни: Пн / Чт / Вс
5. Укажите `backup.bat`

---

## 9.3 Восстановление

1. Остановите сервер (`Ctrl + C`)
2. Скопируйте файл базы из backup
3. Вставьте в `backend/`
4. Запустите сервер

---

# 10. Продакшен

Рекомендации:

* перейти на PostgreSQL
* использовать nginx
* включить HTTPS
* запуск без `--reload`

---

# 11. Обновление проекта

1. Сделайте backup
2. Обновите файлы
3. Выполните миграции
4. Перезапустите сервер

---

# 12. Частые ошибки

| Ошибка              | Решение               |
| ------------------- | --------------------- |
| ModuleNotFoundError | выполнить pip install |
| Порт занят          | завершить процесс     |
| API не отвечает     | проверить .env        |
| JWT ошибка          | проверить SECRET_KEY  |

---

# Итог

Вы полностью развернули систему UniFood:

* Backend работает
* Frontend работает
* База данных настроена
* Админ доступен
* Backup настроен

---
