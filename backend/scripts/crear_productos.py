import random
from database.engine import engine
from models.productos import ProductCreate, Producto
from models.carrito import CarritoItem
from services.ProductoService import ProductoService
from sqlmodel import Session

def main():
    productos = ["Remera", "Camisa", "Pantalón", "Jean", "Short", "Bermuda", "Campera", "Buzo", "Sweater", "Chaleco", "Zapatillas", "Botines", "Sandalias", "Ojotas", "Botas", "Gorra", "Sombrero", "Bufanda", "Guantes", "Mochila", "Cartera", "Billetera", "Cinturón", "Reloj", "Lentes de sol", "Auriculares", "Parlante", "Teclado", "Mouse", "Monitor", "Celular", "Tablet", "Notebook", "Cargador", "Powerbank", "Botella", "Termo", "Taza", "Vaso", "Plato", "Sartén", "Olla", "Licuadora", "Cafetera", "Mate", "Almohada", "Manta", "Toalla", "Lámpara", "Mueble"]
    adjetivos = ["Premium", "Económico", "Elegante", "Moderno", "Clásico", "Resistente", "Compacto", "Ligero", "Potente", "Rápido", "Cómodo", "Práctico", "Versátil", "Duradero", "Innovador", "Profesional", "Básico", "Avanzado", "Exclusivo", "Natural", "Fresco", "Suave", "Intenso", "Delicioso", "Refrescante", "Seguro", "Confiable", "Eficiente", "Minimalista", "Sofisticado", "Deportivo", "Urbano", "Artesanal", "Original", "Creativo", "Sostenible", "Ecológico", "Flexible", "Multifuncional", "Portátil", "Personalizable", "Superior", "Ultra", "Cómodo", "Moderno", "Práctico", "Duradero", "Versátil", "Premium", "Resistente"]
    session = Session(engine)
    producto_service = ProductoService()


    for i in range(101):

        nombre_producto = f"{random.choice(productos)} {random.choice(adjetivos)}"
        precio = float(random.randint(10000, 100000))
        stock = random.randint(0, 30)
        sku = random.randint(100000, 200000)
        user_email = {'email': 'tavellathiagolautaro@gmail.com'}
        categoria = random.randint(1, 10)


        producto = ProductCreate(nombre=nombre_producto,categoria=[categoria], sku=sku, precio=precio, stock=stock, descripcion=None)

        producto_service.crear_producto(session=session, producto=producto, current_user=user_email)

        session.close()

        print('producto creado')





if __name__ == '__main__':
    main()