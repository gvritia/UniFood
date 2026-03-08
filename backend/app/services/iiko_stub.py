import random
import string
from datetime import datetime


class IikoStub:
    @staticmethod
    def send_order(order_data: dict) -> str:
        """
        Имитация отправки заказа в iiko.
        Возвращает уникальный номер заказа.
        """
        # Генерируем фейковый номер (как в реальной системе: префикс + цифры/буквы)
        prefix = "ORD-" + datetime.now().strftime("%y%m%d")
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        order_number = f"{prefix}-{random_part}"

        # Здесь можно добавить print или лог, чтобы видеть, что "отправили"
        print(f"[IIKO STUB] Заказ отправлен: {order_number}, данные: {order_data}")

        return order_number


iiko_stub = IikoStub()