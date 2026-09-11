from fastapi import Depends, HTTPException, Request, Header, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from config import settings
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)
http_bearer = HTTPBearer(auto_error=False)

CREDENCIALES_INVALIDAS = HTTPException(
    status_code=401,
    detail="Token inválido o expirado",
    headers={"WWW-Authenticate": "Bearer"},
)


async def extraer_token(
    request: Request,
    credenciales: HTTPAuthorizationCredentials | None = Depends(http_bearer),
) -> str:
    if credenciales:
        return credenciales.credentials
    token_cookie = request.cookies.get('access_token')
    if token_cookie:
        return token_cookie
    raise CREDENCIALES_INVALIDAS

PERMISOS_REGISTRADOS: set[str] = set()

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


async def get_current_user(token: str = Depends(extraer_token)):
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
            raise CREDENCIALES_INVALIDAS
            
        return {"email": email, "rol": rol, "permisos": permisos}
        
    except JWTError:
        raise CREDENCIALES_INVALIDAS


async def require_admin(current_user = Depends(get_current_user)):
    if current_user['rol'] != 'admin':
        raise HTTPException(status_code=403, detail='Sin permisos')
    return current_user




def require_permission(required_permission: str):
    """Dependency factory that returns a function to check specific permissions"""
    PERMISOS_REGISTRADOS.add(required_permission)
    async def check_permission(token: str = Depends(extraer_token)):
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
                raise CREDENCIALES_INVALIDAS
            
            # Check if user has the required permission
            if required_permission not in permisos:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Permiso requerido: {required_permission}"
                )
            
            return {"email": email, "rol": rol, "permisos": permisos}
            
        except JWTError:
            raise CREDENCIALES_INVALIDAS
    
    return check_permission



def servicio_interno(x_internal_key: str = Header(...)):
    if x_internal_key != settings.TOKEN_SERVICIO_INTERNO_API:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado: Firma de servicio a servicio inválida"
        )
    return True