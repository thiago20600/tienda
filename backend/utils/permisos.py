from fastapi import Depends, HTTPException, status
import httpx
from utils.auth import get_current_user
from config import settings

PERMISOS_REGISTRADOS: set[str] = set()

class Permisos:
    @staticmethod
    def require_permission(permission: str):
        PERMISOS_REGISTRADOS.add(permission)


        async def check(current_user = Depends(get_current_user)):
            permisos_usuario = set(current_user.get("permisos", []))

            if permission not in permisos_usuario:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail=f"No tienes el permiso necesario: {permission}"
                )
                
            return current_user

        return check


    async def enviar_permisos(self):
            if not PERMISOS_REGISTRADOS:
                return

            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f'{settings.API_USUARIOS_URL}/permisos/',
                        json=list(PERMISOS_REGISTRADOS),
                        headers={"X-Internal-Key": settings.TOKEN_SERVICIO_INTERNO_API},
                        timeout=5.0 
                    )
                    response.raise_for_status()
                    print(f"Sincronización de permisos exitosa: {response.status_code}")
            except Exception as e:
                print(f"Error al sincronizar permisos con el servicio central: {e}")


permisos = Permisos()

    