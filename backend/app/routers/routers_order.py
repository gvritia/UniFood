from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from datetime import datetime, timezone

from ..db import get_db
from ..api.auth import get_current_user
from ..schemas.schemas_user import UserResponse
from ..schemas.schemas_order import OrderResponse, OrderStatusUpdate
from ..crud.crud_order import create_order_from_cart, get_user_orders, get_order, update_order_status
from ..crud.crud_menu import menu_crud
from ..services.payment_stub import payment_stub
from ..services.iiko_stub import iiko_stub
from ..models.models_order import Order, OrderItem, OrderStatus

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


@router.post("/guest", response_model=OrderResponse)
def create_guest_order(
    order_data: Dict[str, Any],   # ожидаем {"items": [...], "total": float}
    db: Session = Depends(get_db)
):
    """Создание заказа для гостя (без авторизации)"""
    if "items" not in order_data or "total" not in order_data:
        raise HTTPException(status_code=400, detail="Требуются поля 'items' и 'total'")

    items = order_data["items"]
    if not isinstance(items, list) or not items:
        raise HTTPException(status_code=400, detail="Поле 'items' должно быть непустым списком")

    total = 0.0
    items_data = []

    for it in items:
        if "menu_item_id" not in it or "quantity" not in it:
            raise HTTPException(status_code=400, detail="Каждый item должен содержать menu_item_id и quantity")

        menu_item = menu_crud.get_menu_item(db, it["menu_item_id"])
        if not menu_item:
            raise HTTPException(status_code=400, detail=f"Товар с id {it['menu_item_id']} не найден")

        item_total = menu_item.price * it["quantity"]
        total += item_total

        items_data.append({
            "menu_item_id": it["menu_item_id"],
            "name": menu_item.food_name,
            "quantity": it["quantity"],
            "price": menu_item.price
        })

    # Проверяем, что фронт не подделал сумму
    if abs(total - float(order_data["total"])) > 0.01:
        raise HTTPException(status_code=400, detail="Сумма не совпадает с расчётом на сервере")

    # Имитация оплаты
    payment_stub.process_payment({"total": total})

    # Имитация отправки в iiko
    stub_data = {
        "user_id": None,  # гость
        "total": total,
        "items": items_data,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    order_number = iiko_stub.send_order(stub_data)

    # Создаём заказ (user_id = None для гостя)
    new_order = Order(
        user_id=None,
        total_price=total,
        status=OrderStatus.NEW,
        order_number=order_number
    )
    db.add(new_order)
    db.flush()  # получаем id

    # Сохраняем позиции
    for it in items:
        menu_item = menu_crud.get_menu_item(db, it["menu_item_id"])  # уже проверяли, но для безопасности
        db.add(OrderItem(
            order_id=new_order.id,
            menu_item_id=it["menu_item_id"],
            quantity=it["quantity"],
            price_at_order=menu_item.price
        ))

    db.commit()
    db.refresh(new_order, attribute_names=["items"])

    return new_order