from datetime import datetime
from bson import ObjectId
from Database.core import get_db

def create_menu_item(user_id: str, data: dict):
    db = get_db()
    menu_item = {
        "user_id": user_id,
        "name": data["name"],
        "description": data["description"],
        "price": data["price"],
        "image_url": data.get("image_url"),
        "created_at": datetime.utcnow()
    }
    result = db.menus.insert_one(menu_item)
    menu_item["_id"] = result.inserted_id
    return menu_item

def get_menu_items(user_id: str):
    db = get_db()
    items = list(db.menus.find({"user_id": user_id}))
    return items

def delete_menu_item(menu_id: str, user_id: str):
    db = get_db()
    result = db.menus.delete_one({"_id": ObjectId(menu_id), "user_id": user_id})
    return result.deleted_count
