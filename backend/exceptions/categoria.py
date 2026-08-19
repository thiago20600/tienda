from exceptions.base import BusinessError


class CategoriaNoEncontradaError(BusinessError):
    def __init__(self, id: int):
        super().__init__(
            message=f'No se encontro la categoria con id: {id}',
            code="CATEGORIA_NOT_FOUND"
        )

