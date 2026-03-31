from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from ..dependencies import get_current_admin
from ..schemas.schemas_user import UserResponse
from ..schemas.schemas_menu import (
    MenuItemCreate, MenuItemResponse, MenuItemUpdate
)
from ..crud.crud_menu import menu_crud

router = APIRouter(prefix="/menu", tags=["menu"])


@router.get("/", response_model=List[MenuItemResponse])
def get_menu(
    skip: int = 0,
    limit: int = 100,
    category: str | None = None,
    q: str | None = Query(None, description="Поиск по названию блюда"),
    db: Session = Depends(get_db)
):
    return menu_crud.get_menu_items(db, skip=skip, limit=limit, category=category, q=q)


@router.get("/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = menu_crud.get_menu_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")
    return item


@router.post("/", response_model=MenuItemResponse, status_code=201)
def create_menu_item(
    item: MenuItemCreate,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin),
):
    """Создать новое блюдо (только админ)"""
    return menu_crud.create_menu_item(db, item)


@router.put("/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_update: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin),
):
    """Обновить блюдо (только админ)"""
    updated = menu_crud.update_menu_item(db, item_id, item_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")
    return updated


@router.delete("/{item_id}", status_code=204)
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin),
):
    """Удалить блюдо (только админ)"""
    deleted = menu_crud.delete_menu_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")
    return None