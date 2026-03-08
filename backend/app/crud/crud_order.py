from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from sqlalchemy.orm import selectinload
from app.models.models_order import Order, OrderItem, OrderStatus
from app.models.models_cart import CartItem
from app.services.iiko_stub import iiko_stub
from app.services.payment_stub import payment_stub

def create_order_from_cart(db: Session, user_id: int) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise ValueError("Корзина пуста")

    total_price = sum(ci.quantity * (ci.menu_item.price if ci.menu_item else 0) for ci in cart_items)
    items_data = [...]  # твой код остаётся

    # === ИМИТАЦИЯ ОПЛАТЫ ===
    payment_result = payment_stub.process_payment({
        "total": total_price,
        "user_id": user_id,
        "card_last4": "4242"  # можно передавать из фронта в будущем
    })

    if payment_result["status"] != "success":
        raise ValueError("Оплата не прошла")

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
    stmt = (
        select(Order)
        .where(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .options(selectinload(Order.items).selectinload(OrderItem.menu_item))
    )
    return db.scalars(stmt).all()


def get_order(db: Session, order_id: int, user_id: int) -> Order | None:
    return (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .options(selectinload(Order.items).selectinload(OrderItem.menu_item))
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