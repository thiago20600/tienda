class UsuarioNoEncontradoError(Exception):
    def __init__(self, usuario_id: int):
        self.message = f"No se encontro el usuario con id: {usuario_id}"
        super().__init__(self.message)