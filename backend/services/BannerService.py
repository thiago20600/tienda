import datetime
from fastapi import HTTPException, UploadFile
from sqlmodel import Session, select
from models.banner import Banner, BannerUpdate
from services import ImagenService


class BannerService:
    def __init__(self):
        self.imagen_service = ImagenService()


    def listar_activos(self, session: Session) -> list[Banner]:
        return session.exec(
            select(Banner).where(Banner.activo == True)
        ).all()


    def listar_todos(self, session: Session) -> list[Banner]:
        return session.exec(select(Banner).order_by(Banner.id)).all()


    def obtener_por_id(self, session: Session, banner_id: int) -> Banner:
        banner = session.get(Banner, banner_id)
        if not banner:
            raise HTTPException(status_code=404, detail="Banner no encontrado")
        return banner


    def crear(self, session: Session, imagen: UploadFile, titulo: str, enlace: str, titulo_boton: str = "Ver más", boton_color: str = "#2563eb", activo: bool = True) -> Banner:

        imagen_url = self.imagen_service._subir_una_imagen(imagen)

        banner = Banner(
            imagen=imagen_url,
            titulo=titulo,
            enlace=enlace,
            titulo_boton=titulo_boton,
            boton_color=boton_color,
            activo=activo
        )
        session.add(banner)
        session.commit()
        session.refresh(banner)
        return banner


    def actualizar(self, session: Session, banner_id: int, data: BannerUpdate, imagen: UploadFile | None = None) -> Banner:
        banner = self.obtener_por_id(session, banner_id)


        if imagen:
            nueva_imagen_url = self.imagen_service._subir_una_imagen(imagen)
            banner.imagen = nueva_imagen_url


        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(banner, key, value)

        banner.updated_at = datetime.now(datetime.timezone.utc)
        session.add(banner)
        session.commit()
        session.refresh(banner)
        return banner


    def eliminar(self, session: Session, banner_id: int) -> dict:
        banner = self.obtener_por_id(session, banner_id)
        session.delete(banner)
        session.commit()
        return {"message": "Banner eliminado correctamente"}