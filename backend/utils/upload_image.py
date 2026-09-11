from . import cloud_images
import cloudinary
import cloudinary.uploader


def upload_image(url_imagen):
    return cloudinary.uploader.upload(
        url_imagen,
        folder='sistema_1',
        transformation=[{
            'width': 800,
            'height': 800,
            'crop': 'scale',
            'quality': 'auto'
        }]
    )