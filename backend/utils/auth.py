from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
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


def get_current_user(token: str = Depends(extraer_token)):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY_JWT,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        rol = payload.get("rol")
        permisos: list[str] = payload.get("permisos", [])
        if email is None or rol is None:
            raise CREDENCIALES_INVALIDAS
        return {"email": email, "rol": rol, "permisos": permisos}
    except JWTError:
        raise CREDENCIALES_INVALIDAS
    

def require_admin(current_user = Depends(get_current_user)):
    if current_user["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Sin permisos")
    return current_user


def require_permission(required_permission: str):
    """Dependency factory that returns a function to check specific permissions"""
    async def check_permission(current_user = Depends(get_current_user)):
        # Check if user has the required permission
        if required_permission not in current_user.get("permisos", []):
            raise HTTPException(
                status_code=403, 
                detail=f"Permiso requerido: {required_permission}"
            )
        return current_user
    
    return check_permission
