from models.configuracion import ConfiguracionGeneral, ConfiguracionUpdate
from sqlmodel import Session, select


class ConfiguracionService:

    def obtener_configuracion(self, session: Session) -> ConfiguracionGeneral:
        configuracion = session.get(ConfiguracionGeneral, 1)
        if not configuracion:
            configuracion = ConfiguracionGeneral(id=1)
            session.add(configuracion)
            session.commit()
            session.refresh(configuracion)
        return configuracion

    def actualizar_configuracion(self, session: Session, datos: ConfiguracionUpdate) -> ConfiguracionGeneral:
        configuracion = self.obtener_configuracion(session=session)

        for key, value in datos.model_dump(exclude_unset=True).items():
            setattr(configuracion, key, value)

        session.add(configuracion)
        session.commit()
        session.refresh(configuracion)
        return configuracion

    def establecer_logo(self, session: Session, logo_url: str) -> ConfiguracionGeneral:
        configuracion = self.obtener_configuracion(session=session)
        configuracion.logo_url = logo_url
        session.add(configuracion)
        session.commit()
        session.refresh(configuracion)
        return configuracion
