from fastapi import APIRouter, Depends
from sqlmodel import select
from database.engine import SessionDep
from auth.auth import servicio_interno
from models.permisos import Permiso


router = APIRouter(tags=['Permisos'], prefix='/permisos')


@router.post(path='/', dependencies=[Depends(servicio_interno)])
def crear_permisos(permisos: list[str], session: SessionDep):
    permisos_unicos = set(permisos)
    
    if not permisos_unicos:
        return {"message": "Sin permisos para procesar"}

    permisos_existentes = set(
        session.exec(select(Permiso.nombre).where(Permiso.nombre.in_(permisos_unicos))).all()
    )

    nuevos = [Permiso(nombre=nombre) for nombre in permisos_unicos if nombre not in permisos_existentes]
    
    if nuevos:
        session.add_all(nuevos)
        session.commit()

    return {
        "message": "Permisos procesados correctamente",
        "creados": len(nuevos)
    }

