from fastapi import APIRouter, Depends
from database.engine import SessionDep
from models.metricas import MetricasPublic
from services.MetricasService import MetricasService
from utils.permisos import permisos


router = APIRouter()

metricas_service = MetricasService()


@router.get('/admin/metricas', response_model=MetricasPublic, dependencies=[Depends(permisos.require_permission("pedidos:read:admin"))])
async def get_metricas(session: SessionDep):
    return metricas_service.calcular(session)