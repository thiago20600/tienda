from sqlmodel import SQLModel
from models.pedido import MetodoPago

class CheckoutSchema(SQLModel):

    token_tarjeta: str
    payment_method_id: str     
    payment_method_type: str    
    cuotas: int                 
    
    
    nombre: str
    apellido: str
    tipo_identificacion: str    
    numero_identificacion: str  


    telefono_area: str        
    telefono_numero: str      

    
    codigo_postal: str      
    nombre_calle: str
    numero_calle: str      
    provincia: str
    localidad: str
    detalle_direccion: str | None = None