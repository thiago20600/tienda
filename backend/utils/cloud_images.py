import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import os
from dotenv import load_dotenv
from config import settings

#configuro el almacenamiento de las imagenes a travez de cloudinary

load_dotenv()

cloudinary.config(
    cloud_name= settings.CLOUDINARY_CLOUD_NAME,
    api_key = settings.API_KEY_CLOUDINARY,
    api_secret = settings.API_SECRET_CLOUDINARY,
    secure = True
)

#upload_result = cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
#                                           public_id="shoes")

#print(upload_result['secure_url'])