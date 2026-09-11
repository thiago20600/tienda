from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from database.engine import SessionDep
from models.banner import BannerPublic, BannerUpdate
from services.BannerService import BannerService
from utils.permisos import permisos


router = APIRouter()
banner_service = BannerService()



@router.get("/banners", response_model=list[BannerPublic])
async def get_banners(session: SessionDep):
    return banner_service.listar_activos(session)



@router.get("/admin/banners", response_model=list[BannerPublic], dependencies=[Depends(permisos.require_permission("banners:read:admin"))])
async def get_banners_admin(session: SessionDep):
    return banner_service.listar_todos(session)


@router.get("/admin/banners/{banner_id}", response_model=BannerPublic, dependencies=[Depends(permisos.require_permission("banners:read:admin"))])
async def get_banner_admin(session: SessionDep, banner_id: int):
    return banner_service.obtener_por_id(session, banner_id)


@router.post("/admin/banners", response_model=BannerPublic, dependencies=[Depends(permisos.require_permission("banners:create:admin"))])
async def create_banner(
    session: SessionDep,
    imagen: UploadFile = File(...),
    titulo: str = Form(...),
    enlace: str = Form(...),
    titulo_boton: str = Form("Ver más"),
    boton_color: str = Form("#2563eb"),
    activo: bool = Form(True),
    orden: int = Form(0),
):
    return banner_service.crear(
        session=session,
        imagen=imagen,
        titulo=titulo,
        enlace=enlace,
        titulo_boton=titulo_boton,
        boton_color=boton_color,
        activo=activo,
        orden=orden,
    )


@router.patch("/admin/banners/{banner_id}", response_model=BannerPublic, dependencies=[Depends(permisos.require_permission("banners:update:admin"))])
async def update_banner(
    session: SessionDep,
    banner_id: int,
    data: str = Form(...),
    imagen: UploadFile | None = File(None),
):
    try:
        banner_update = BannerUpdate.model_validate_json(data)
    except Exception:
        raise HTTPException(status_code=400, detail="El campo data debe ser un JSON válido")
    return banner_service.actualizar(session, banner_id, banner_update, imagen)


@router.delete("/admin/banners/{banner_id}", dependencies=[Depends(permisos.require_permission("banners:delete:admin"))])
async def delete_banner(session: SessionDep, banner_id: int):
    return banner_service.eliminar(session, banner_id)