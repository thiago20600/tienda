from fastapi import Depends, HTTPException, status
from utils.auth import get_current_user

class Permisos:
    @staticmethod
    def require_permission(permission: str):
        async def check(current_user = Depends(get_current_user)):
            if not current_user.rol_obj:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="El usuario no tiene un rol asignado"
                )
            

            permisos_usuario = {p.nombre for p in current_user.rol_obj.permisos}
            
            if permission not in permisos_usuario:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail=f"No tienes el permiso necesario: {permission}"
                )
                
            return current_user

        return check

    