from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from ..api.auth import get_current_user
from ..schemas.schemas_user import UserResponse
from ..schemas.schemas_order import OrderResponse, OrderStatusUpdate
from ..crud.crud_order import create_order_from_cart, get_user_orders, get_order, update_order_status

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать заказ из текущей корзины (имитация оплаты + отправка в iiko)"""
    try:
        order = create_order_from_cart(db, current_user.id)
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить историю заказов текущего пользователя"""
    return get_user_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_my_order(
    order_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = get_order(db, order_id, current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден или не принадлежит вам")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def change_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Изменить статус заказа (для демонстрации, в реальности — только админ/официант)"""
    updated = update_order_status(db, order_id, status_update.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if updated.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return updated