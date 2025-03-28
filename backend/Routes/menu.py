from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from Models.menu import MenuItemOut
from Database.menu import create_menu_item, get_menu_items, delete_menu_item
from Utils.gcp import upload_image_to_gcp, download_image_and_encode_base64_from_url
from Dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/", response_model=MenuItemOut)
async def add_menu_item(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(None),
    current_user: str = Depends(get_current_user)
):
    image_url = None
    if image:
        image_url = upload_image_to_gcp(image, current_user)
    data = {
        "name": name,
        "description": description,
        "price": price,
        "image_url": image_url,
    }
    menu_item = create_menu_item(current_user, data)
    menu_item["id"] = str(menu_item["_id"])
    del menu_item["_id"]
    return menu_item

@router.get("/", response_model=list[MenuItemOut])
def list_menu_items(current_user: str = Depends(get_current_user)):
    items = get_menu_items(current_user)
    for item in items:
        item["id"] = str(item["_id"])
        del item["_id"]
        # If there is an image_url, download and encode it
        if item.get("image_url"):
            try:
                base64_str = download_image_and_encode_base64_from_url(item["image_url"])
                item["image_base64"] = base64_str
            except Exception as e:
                # You might want to log or handle errors here
                item["image_base64"] = None
    return items

@router.delete("/{menu_id}", response_model=dict)
def remove_menu_item(menu_id: str, current_user: str = Depends(get_current_user)):
    deleted_count = delete_menu_item(menu_id, current_user)
    if deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    return {"message": "Menu item deleted"}
