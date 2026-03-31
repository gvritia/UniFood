from sqlalchemy.orm import Session, selectinload
from datetime import datetime, timezone
from app.models.models_order import Order, OrderItem, OrderStatus
from app.models.models_cart import CartItem
from app.models.models_user import User
from app.services.iiko_stub import iiko_stub
from app.exceptions import CartEmptyException, InsufficientBalanceException


def create_order_from_cart(db: Session, user_id: int) -> Order:
    """Создать заказ из корзины авторизованного пользователя"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("Пользователь не найден")

    # Получаем корзину с полными данными блюд
    cart_items = (
        db.query(CartItem)
        .filter(CartItem.user_id == user_id)
        .options(selectinload(CartItem.menu_item))
        .all()
    )

    if not cart_items:
        raise CartEmptyException()

    total_price = sum(
        ci.quantity * (ci.menu_item.price if ci.menu_item else 0)
        for ci in cart_items
    )

    if user.balance < total_price:
        raise InsufficientBalanceException(balance=user.balance, required=total_price)

    user.balance -= total_price

    # Данные для iiko stub
    items_data = [
        {
            "menu_item_id": ci.menu_item_id,
            "name": ci.menu_item.food_name if ci.menu_item else "Unknown",
            "quantity": ci.quantity,
            "price": ci.menu_item.price if ci.menu_item else 0
        }
        for ci in cart_items
    ]

    order_number = iiko_stub.send_order({
        "user_id": user_id,
        "total": total_price,
        "items": items_data,
        "created_at": datetime.now(timezone.utc).isoformat()
    })

    # Создаём заказ
    new_order = Order(
        user_id=user_id,
        total_price=total_price,
        status=OrderStatus.NEW,
        order_number=order_number
    )
    db.add(new_order)
    db.flush()

    # Позиции заказа
    for ci in cart_items:
        db.add(OrderItem(
            order_id=new_order.id,
            menu_item_id=ci.menu_item_id,
            quantity=ci.quantity,
            price_at_order=ci.menu_item.price if ci.menu_item else 0.0
        ))

    # Очистка корзины
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    db.commit()
    db.refresh(new_order)

    # Подгружаем связи для полного ответа
    db.refresh(new_order, attribute_names=["items"])
    for item in new_order.items:
        db.refresh(item, attribute_names=["menu_item"])

    return new_order


def get_user_orders(db: Session, user_id: int):
    """История заказов пользователя"""
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(db: Session, order_id: int, user_id: int) -> Order | None:
    """Получить один заказ с полными данными"""
    return (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .options(selectinload(Order.items).selectinload(OrderItem.menu_item))
        .first()
    )


def update_order_status(db: Session, order_id: int, new_status: OrderStatus) -> Order | None:
    """Изменить статус заказа"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None

    order.status = new_status
    db.commit()
    db.refresh(order)
    return order
