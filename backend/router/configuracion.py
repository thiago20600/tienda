from fastapi import APIRouter, Depends, File, UploadFile
from services.ConfiguracionService import ConfiguracionService
from services.ImagenService import ImagenService
from database.engine import SessionDep
from models.configuracion import ConfiguracionPublic, ConfiguracionUpdate
from utils.permisos import permisos

router = APIRouter()

configuracion_service = ConfiguracionService()
imagen_service = ImagenService()


@router.get('/configuracion', response_model=ConfiguracionPublic)
async def obtener_configuracion(session: SessionDep):
    return configuracion_service.obtener_configuracion(session=session)


@router.patch('/configuracion', response_model=ConfiguracionPublic, dependencies=[Depends(permisos.require_permission("configuracion:update:admin"))])
async def actualizar_configuracion(session: SessionDep, datos: ConfiguracionUpdate):
    return configuracion_service.actualizar_configuracion(session=session, datos=datos)


@router.post('/configuracion/logo', response_model=ConfiguracionPublic, dependencies=[Depends(permisos.require_permission("configuracion:update:admin"))])
async def subir_logo(session: SessionDep, imagen: UploadFile = File(...)):
    url = imagen_service._subir_una_imagen(imagen)
    return configuracion_service.establecer_logo(session=session, logo_url=url)
