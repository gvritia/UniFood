from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from sqlalchemy.orm import selectinload
from app.models.models_order import Order, OrderItem, OrderStatus
from app.models.models_cart import CartItem
from app.models.models_user import User
from app.services.iiko_stub import iiko_stub
from app.services.payment_stub import payment_stub


def create_order_from_cart(db: Session, user_id: int) -> Order:
    # Получаем пользователя
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("Пользователь не найден")

    # Получаем товары в корзине
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise ValueError("Корзина пуста")

    # Считаем общую сумму
    total_price = sum(ci.quantity * (ci.menu_item.price if ci.menu_item else 0) for ci in cart_items)

    # Проверяем баланс пользователя
    if user.balance < total_price:
        raise ValueError(
            f"Недостаточно средств на балансе. Текущий баланс: {user.balance:.2f} ₽, требуется: {total_price:.2f} ₽")

    # Списываем средства с баланса
    user.balance -= total_price

    # Формируем данные для отправки в iiko
    items_data = [
        {
            "menu_item_id": ci.menu_item_id,
            "name": ci.menu_item.food_name if ci.menu_item else "Unknown",
            "quantity": ci.quantity,
            "price": ci.menu_item.price if ci.menu_item else 0
        }
        for ci in cart_items
    ]

    # Имитация отправки в iiko
    order_data_for_stub = {
        "user_id": user_id,
        "total": total_price,
        "items": items_data,
        "created_at": datetime.utcnow().isoformat()
    }
    order_number = iiko_stub.send_order(order_data_for_stub)

    # Создаём заказ
    new_order = Order(
        user_id=user_id,
        total_price=total_price,
        status=OrderStatus.NEW,
        order_number=order_number
    )
    db.add(new_order)
    db.flush()  # получаем id заказа

    # Создаём позиции заказа (с фиксацией цены на момент заказа)
    for ci in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=ci.menu_item_id,
            quantity=ci.quantity,
            price_at_order=ci.menu_item.price if ci.menu_item else 0.0
        )
        db.add(order_item)

    # Очищаем корзину
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    db.commit()
    db.refresh(new_order)

    # Подгружаем items для ответа
    db.refresh(new_order, attribute_names=["items"])

    return new_order


def get_user_orders(db: Session, user_id: int):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(db: Session, order_id: int, user_id: int) -> Order | None:
    return (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )


def update_order_status(db: Session, order_id: int, new_status: OrderStatus) -> Order | None:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order