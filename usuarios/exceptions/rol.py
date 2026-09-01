class RolNoEncontradoError(Exception):
    def __init__(self, rol_id: int):
        self.message = f"No se encontro el rol con id: {rol_id}"
        super().__init__(self.message)


class RolNombreDuplicadoError(Exception):
    def __init__(self, nombre: str):
        self.message = f"El rol '{nombre}' ya existe"
        super().__init__(self.message)


class PermisoNoEncontradoError(Exception):
    def __init__(self, permiso_id: int):
        self.message = f"No se encontro el permiso con id: {permiso_id}"
        super().__init__(self.message)


class RolProtegidoError(Exception):
    def __init__(self, nombre: str):
        self.message = f"No se puede eliminar el rol protegido '{nombre}'"
        super().__init__(self.message)
