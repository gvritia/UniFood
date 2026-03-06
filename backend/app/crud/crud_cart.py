from sqlalchemy.orm import selectinload
from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from app.models.models_cart import CartItem
from app.schemas.schemas_cart import CartItemCreate, CartItemUpdate


def get_cart_items(db: Session, user_id: int):
    stmt = (
        select(CartItem)
        .where(CartItem.user_id == user_id)
        .options(selectinload(CartItem.menu_item))  # подгружаем связанные блюда
    )
    return db.scalars(stmt).all()


def get_cart_item(db: Session, user_id: int, menu_item_id: int) -> CartItem | None:
    return (
        db.query(CartItem)
        .filter(CartItem.user_id == user_id, CartItem.menu_item_id == menu_item_id)
        .first()
    )


def add_to_cart(db: Session, user_id: int, item: CartItemCreate) -> CartItem:
    existing = get_cart_item(db, user_id, item.menu_item_id)
    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_item = CartItem(user_id=user_id, **item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item


def update_cart_item(db: Session, cart_item_id: int, update_data: CartItemUpdate):
    stmt = (
        update(CartItem)
        .where(CartItem.id == cart_item_id)
        .values(**update_data.model_dump(exclude_unset=True))
        .returning(CartItem)
    )
    result = db.execute(stmt)
    db.commit()
    return result.scalar_one_or_none()


def remove_from_cart(db: Session, cart_item_id: int):
    stmt = delete(CartItem).where(CartItem.id == cart_item_id)
    db.execute(stmt)
    db.commit()


def clear_cart(db: Session, user_id: int):
    stmt = delete(CartItem).where(CartItem.user_id == user_id)
    db.execute(stmt)
    db.commit()