from models.categorias import CategoriaPublic
from models.productos import ProductoPublic


class CategoriaConProductos(CategoriaPublic):
    productos: list[ProductoPublic] = []