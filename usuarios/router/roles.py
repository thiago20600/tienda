from fastapi import APIRouter, HTTPException, Depends
from database.engine import SessionDep
from auth.auth import require_permission
from services.RolService import RolService
from exceptions.rol import (
    RolNoEncontradoError,
    RolNombreDuplicadoError,
    PermisoNoEncontradoError,
    RolProtegidoError,
)
from models.rol import RolCreate, RolUpdate, RolResponse
from models.permisos import PermisosAsignacion, PermisoResponse

router = APIRouter(prefix="/admin", tags=["admin"])
rol_service = RolService()


@router.get("/roles", response_model=list[RolResponse])
async def get_roles(session: SessionDep, _=Depends(require_permission("roles:read:admin"))):
    roles = rol_service.listar_roles(session=session)
    return [RolResponse.from_rol(rol) for rol in roles]


@router.get("/permisos", response_model=list[PermisoResponse])
async def get_permisos(session: SessionDep, _=Depends(require_permission("permisos:read:admin"))):
    permisos = rol_service.listar_permisos(session=session)
    return [PermisoResponse(id=p.id, nombre=p.nombre) for p in permisos]


@router.post("/roles", response_model=RolResponse)
async def create_rol(rol_data: RolCreate, session: SessionDep, _=Depends(require_permission("roles:create:admin"))):
    try:
        rol = rol_service.crear_rol(session=session, nombre=rol_data.nombre, activo=rol_data.activo)
        return RolResponse.from_rol(rol)
    except RolNombreDuplicadoError as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.put("/roles/{rol_id}", response_model=RolResponse)
async def update_rol(rol_id: int, rol_data: RolUpdate, session: SessionDep, _=Depends(require_permission("roles:update:admin"))):
    try:
        rol = rol_service.actualizar_rol(
            session=session, rol_id=rol_id, nombre=rol_data.nombre, activo=rol_data.activo
        )
        return RolResponse.from_rol(rol)
    except RolNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except RolNombreDuplicadoError as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.put("/roles/{rol_id}/permisos", response_model=RolResponse)
async def asignar_permisos(
    rol_id: int, asignacion: PermisosAsignacion, session: SessionDep, _=Depends(require_permission("roles:update:admin"))
):
    try:
        rol = rol_service.asignar_permisos(session=session, rol_id=rol_id, permiso_ids=asignacion.permiso_ids)
        return RolResponse.from_rol(rol)
    except RolNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except PermisoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.delete("/roles/{rol_id}")
async def delete_rol(rol_id: int, session: SessionDep, _=Depends(require_permission("roles:delete:admin"))):
    try:
        return rol_service.eliminar_rol(session=session, rol_id=rol_id)
    except RolNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except RolProtegidoError as e:
        raise HTTPException(status_code=400, detail=e.message)
