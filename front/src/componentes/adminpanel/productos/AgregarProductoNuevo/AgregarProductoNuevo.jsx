import { useState } from 'react';
import { AgregarProductoContainer, FormTitle, AgregarProductoForm, FormGroup, Label, Input, Select, TextArea, AgregarProductoBoton, CargarImagenContainer, DropzoneLabel, FileInputHidden, PrevisualizacionInfo, ImagenesGrid, ImagenCard, AccionesGrupo, BotonAccion, EstadoMensaje } from './AgregarProductoNuevo.styles';
import useCategorias from '../../../../hooks/categorias/useCategorias';
import { useNavigate } from 'react-router-dom';

const CAMPOS_FORMULARIO = [
  { name: 'nombre', label: 'Nombre *', type: 'text', required: true, placeholder: 'Ej: Remera Oversize' },
  { name: 'sku', label: 'SKU (Opcional)', type: 'number', required: false, placeholder: '10024' },
  { name: 'precio', label: 'Precio ($) *', type: 'number', step: '0.01', required: true, placeholder: '1500.50' },
  { name: 'stock', label: 'Stock *', type: 'number', required: true, placeholder: '10' },
];



const AgregarProductoNuevo = ({ onSubmit }) => {
  
  const navigate = useNavigate()
  const { categorias } = useCategorias()
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [exitoMessage, setExitoMessage] = useState(null)
  const UrlApiBaseProductos = import.meta.env.VITE_API_URL
  const accessToken = localStorage.getItem('token')
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: [], // Guardará solo un array de IDs numericos: [1, 2]
    sku: '',
    precio: '',
    stock: '',
    descripcion: ''
  });
  const [productoCargado, setProductoCargado] = useState(false)
  const [imagenes, setImagenes] = useState([])
  const [cargandoImagenes, setCargandoImagenes] = useState(null)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Extrae directamente los IDs de las opciones seleccionadas
  const handleCategoriasChange = (e) => {
    const idsSeleccionados = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setFormData((prev) => ({ ...prev, categoria: idsSeleccionados }));
  };

  const cargarProductoNuevo = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      categoria: formData.categoria, // Array de enteros: [1, 3]
      sku: formData.sku ? Number(formData.sku) : null,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      descripcion: formData.descripcion || null
    };

    const response = await fetch(`${UrlApiBaseProductos}/productos`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(!response.ok){
      setMessage(typeof data.detail === 'string' ? data.detail : 'Error al cargar el producto');
    }else{
      setMessage('PRODUCTO CARGADO CON EXITO')
      setProductoCargado(true)
      localStorage.setItem('productoId', data.id);
    }


    if (onSubmit) onSubmit(payload);

  };

  const handleImagenesSeleccionadas = (e) => {
    const archivos = Array.from(e.target.files);
    setImagenes(archivos);
  };


  const cargarImagenes = async () => {

    if (imagenes.length === 0) {
      setErrorMessage('Selecciona al menos una imagen');
      return;
    }

    const id = localStorage.getItem('productoId');
    if (!id) {
      setErrorMessage('No se encontró el ID del producto');
      return;
    }

    setCargandoImagenes(true);
    const payloadImagenes = new FormData();
    imagenes.forEach((imagen) => {
      payloadImagenes.append('archivos', imagen);
    });

    try {
      const response = await fetch(`${UrlApiBaseProductos}/productos/${id}/imagenes`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${accessToken}`
        },
        body: payloadImagenes
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Error al cargar las imágenes');
        return;
      }

      const data = await response.json();
      setExitoMessage(`${data.mensaje || 'Imágenes cargadas con éxito'}`);
      setImagenes([]);
      

    } catch (error) {
      console.error('Error cargando imágenes:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setCargandoImagenes(false);
    }
  };





  return (
    <AgregarProductoContainer>
      {!productoCargado ? 
      <>
        <FormTitle>Agregar Nuevo Producto</FormTitle>
        
        <AgregarProductoForm onSubmit={cargarProductoNuevo}>
          {CAMPOS_FORMULARIO.map(({ name, label, ...inputProps }) => (
            <FormGroup key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} {...inputProps} onChange={handleChange} />
            </FormGroup>
          ))}

          <FormGroup>
            <Label htmlFor="categoria">Categorías * (Mantené Ctrl/Cmd para elegir varias)</Label>
            <Select id="categoria" name="categoria" multiple required onChange={handleCategoriasChange}>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup className="full-width">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <TextArea id="descripcion" name="descripcion" rows="3" placeholder="Detalles sobre el producto..." value={formData.descripcion} onChange={handleChange} />
          </FormGroup>

          <AgregarProductoBoton type="submit">Guardar Producto</AgregarProductoBoton>
          {message && <div>{message}</div>}
        </AgregarProductoForm>
      </> : (
      <CargarImagenContainer>
        <h3>Cargar imágenes del producto</h3>

        <DropzoneLabel htmlFor="input-archivos">
          <span className="dropzone-icon"></span>
          <span className="dropzone-text">
            <strong>Hacé clic acá</strong> para seleccionar las fotos
          </span>
          <span className="dropzone-subtext">Podés elegir varios archivos PNG, JPG o WEBP</span>
          
          <FileInputHidden id="input-archivos" type="file" accept="image/*" multiple onChange={handleImagenesSeleccionadas}
          />
        </DropzoneLabel>

        {imagenes.length > 0 && (
          <div>
            <PrevisualizacionInfo>
              Imágenes seleccionadas: <strong>{imagenes.length}</strong>
            </PrevisualizacionInfo>

            <ImagenesGrid>
              {imagenes.map((img, index) => (<ImagenCard key={index}>
                  <img src={URL.createObjectURL(img)} alt={img.name}/>
                  <span title={img.name}>
                    {img.name}
                  </span>
                </ImagenCard>
              ))}
            </ImagenesGrid>
          </div>
        )}

        <AccionesGrupo>
          <BotonAccion type="button" onClick={cargarImagenes} disabled={cargandoImagenes || imagenes.length === 0}>
            {cargandoImagenes ? 'Subiendo...' : 'Subir Imágenes'}
          </BotonAccion>
          
          <BotonAccion type="button" onClick={() => navigate('/admin/productos')}>
            Finalizar
          </BotonAccion>
        </AccionesGrupo>

        {errorMessage && (
          <EstadoMensaje $esError>
            {errorMessage}
          </EstadoMensaje>
        )}
        {exitoMessage && (
          <EstadoMensaje $esError={false}>
            {exitoMessage}
          </EstadoMensaje>
        )}
      </CargarImagenContainer>

      )} 
    </AgregarProductoContainer>
  );
};

export default AgregarProductoNuevo;