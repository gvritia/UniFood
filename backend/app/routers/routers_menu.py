from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..crud.crud_menu import menu_crud
from ..db import get_db
from ..schemas.schemas_menu import (
    MenuItemCreate, MenuItemResponse, MenuItemUpdate
)
# Если защитить админ-эндпоинты — добавить позже
# from ..api.auth import get_current_user, UserResponse

router = APIRouter(prefix="/menu", tags=["menu"])


@router.get("/", response_model=List[MenuItemResponse])
def get_menu(
    skip: int = 0,
    limit: int = 100,
    category: str | None = None,
    db: Session = Depends(get_db)
):
    """Получить список блюд (с фильтром по категории)"""
    return menu_crud.get_menu_items(db, skip=skip, limit=limit, category=category)


@router.get("/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = menu_crud.get_menu_item(db, item_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Блюдо не найдено")
    return item


@router.post("/", response_model=MenuItemResponse, status_code=201)
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    # Здесь можно позже добавить проверку прав (только админ)
    return menu_crud.create_menu_item(db, item)


@router.put("/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int, item_update: MenuItemUpdate, db: Session = Depends(get_db)
):
    updated = menu_crud.update_menu_item(db, item_id, item_update)
    if not updated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Блюдо не найдено")
    return updated


@router.delete("/{item_id}", status_code=204)
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    deleted = menu_crud.delete_menu_item(db, item_id)
    if not deleted:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Блюдо не найдено")
    return None