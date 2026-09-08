class UsuarioNoEncontradoError(Exception):
    def __init__(self, usuario_id: int):
        self.message = f"No se encontro el usuario con id: {usuario_id}"
        super().__init__(self.message)


class CambioDeRolNoPermitido(Exception):
    def __init__(self):
        self.message = f'No se puede modificar el rol de este usuario'
        super().__init__(self.message)