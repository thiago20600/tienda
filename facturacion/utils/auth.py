from fastapi import Depends, Header, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from config import settings

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


def servicio_interno(x_internal_key: str | None = Header(default=None, alias="X-Internal-Key")):
    """Valida llamadas service-to-service (por ejemplo, el evento de pedido pagado de api_tienda).

    Se recibe el header opcional (y no `Header(...)`) para poder responder 403 en lugar de 422
    cuando el header falta.
    """
    if x_internal_key != settings.TOKEN_SERVICIO_INTERNO_API:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado: firma de servicio a servicio inválida",
        )
    return True
