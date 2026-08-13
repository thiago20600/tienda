from . import cloud_images
import cloudinary
import cloudinary.uploader


def upload_image(url_imagen):
    
    try:
        upload_result = cloudinary.uploader.upload(url_imagen, folder='sistema_1', transformation=[{'width': 800, 
                                                                                                    'height': 800, 
                                                                                                    'crop': 'scale', 
                                                                                                    'quality': 'auto'}])
        
        print(upload_result)
        return upload_result

    except Exception as e:
        return {'error': f'No se pudo cargar la imagen: {e}'}