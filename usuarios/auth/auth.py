from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from config import settings
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

def create_access_token(subject: str, rol: str = "cliente", permisos: list[str] = None):
    if permisos is None:
        permisos = []
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    token = jwt.encode(
        {'sub': subject, 'rol': rol, 'permisos': permisos, 'exp': expire},
        settings.SECRET_KEY_JWT,
        algorithm=settings.ALGORITHM
    )
    return token


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY_JWT, 
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        rol: str = payload.get('rol')
        permisos: list[str] = payload.get('permisos', [])
        if email is None or rol is None:
            raise credentials_exception
            
        return {"email": email, "rol": rol, "permisos": permisos}
        
    except JWTError:
        raise credentials_exception


async def require_admin(current_user = Depends(get_current_user)):
    if current_user['rol'] != 'admin':
        raise HTTPException(status_code=403, detail='Sin permisos')
    return current_user


def require_permission(required_permission: str):
    """Dependency factory that returns a function to check specific permissions"""
    async def check_permission(token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=401,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY_JWT, 
                algorithms=[settings.ALGORITHM]
            )
            email: str = payload.get("sub")
            rol: str = payload.get('rol')
            permisos: list[str] = payload.get('permisos', [])
            
            if email is None or rol is None:
                raise credentials_exception
            
            # Check if user has the required permission
            if required_permission not in permisos:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Permiso requerido: {required_permission}"
                )
            
            return {"email": email, "rol": rol, "permisos": permisos}
            
        except JWTError:
            raise credentials_exception
    
    return check_permission