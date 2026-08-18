from fastapi import UploadFile, HTTPException
from typing import List
from utils.upload_image import upload_image


class ImagenService:
    MAX_IMAGENES = 5

    def validar_cantidad(self, archivos: List[UploadFile], imagenes_actuales: List[str]) -> None:
        if len(archivos) > self.MAX_IMAGENES:
            raise HTTPException(400, f"No se pueden cargar más de {self.MAX_IMAGENES} imágenes por lote")
        if len(imagenes_actuales) + len(archivos) > self.MAX_IMAGENES:
            raise HTTPException(
                400,
                f"El producto ya tiene {len(imagenes_actuales)} imágenes. No puedes superar un total de {self.MAX_IMAGENES}."
            )

    def subir_imagenes(self, archivos: List[UploadFile]) -> List[str]:
        urls = []
        for archivo in archivos:
            try:
                resultado = upload_image(archivo.file)
                urls.append(resultado['secure_url'])
            except Exception as e:
                raise HTTPException(400, f"No se pudo cargar una imagen: {str(e)}")
        return urls