from fastapi import UploadFile, HTTPException
from typing import List
from utils.upload_image import upload_image


class ImagenService:
    MAX_IMAGENES = 5


    def validar_cantidad(self, archivos: List[UploadFile], imagenes_actuales: List[str]) -> None:
        if len(archivos) > self.MAX_IMAGENES:
            raise HTTPException(400, f"No se pueden cargar más de {self.MAX_IMAGENES} imágenes por lote")
        if len(imagenes_actuales) + len(archivos) > self.MAX_IMAGENES:
            raise HTTPException(400, f"El producto ya tiene {len(imagenes_actuales)} imágenes. No puedes superar un total de {self.MAX_IMAGENES}.")


    def subir_imagenes(self, archivos: List[UploadFile]) -> List[str]:
        return [self._subir_una_imagen(archivo) for archivo in archivos]


    def _subir_una_imagen(self, archivo: UploadFile) -> str:
        try:
            resultado = upload_image(archivo.file)
            return resultado['secure_url']
        except Exception as e:
            raise HTTPException(400, f"No se pudo cargar una imagen: {str(e)}")