import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductoFormContainer, FormTitle, FormLayout, FormGroup, Label, Input, Select, TextArea, CargarImagenContainer, DropzoneLabel, FileInputHidden, PrevisualizacionInfo, ImagenesGrid, ImagenCard, AccionesGrupo, EstadoMensaje, CAMPOS_FORMULARIO } from '../ProductoForm.styles';
import AdminButton from '../../ui/AdminButton/AdminButton';
import useCategorias from '../../../../hooks/categorias/useCategorias';
import { tiendaRequest } from '../../../../services/api/apiClient';


const AgregarProductoNuevo = ({ onSubmit }) => {
  
  const navigate = useNavigate()
  const { categorias } = useCategorias()
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [exitoMessage, setExitoMessage] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: [], // Guardará solo un array de IDs numericos: [1, 2]
    sku: '',
    precio: '',
    precio_descuento: '',
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
      precio_descuento: formData.precio_descuento ? parseFloat(formData.precio_descuento) : null,
      stock: parseInt(formData.stock, 10),
      descripcion: formData.descripcion || null
    };

    const response = await tiendaRequest('/productos', {
      method: 'POST',
      auth: true,
      body: payload
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
      const response = await tiendaRequest(`/productos/${id}/imagenes`, {
        method: 'POST',
        auth: true,
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
    <ProductoFormContainer>
      {!productoCargado ?
      <>
        <FormTitle>Agregar Nuevo Producto</FormTitle>
        
        <FormLayout onSubmit={cargarProductoNuevo}>
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

          <AdminButton type="submit">Guardar Producto</AdminButton>
          {message && <div>{message}</div>}
        </FormLayout>
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
          <AdminButton type="button" onClick={cargarImagenes} disabled={cargandoImagenes || imagenes.length === 0}>
            {cargandoImagenes ? 'Subiendo...' : 'Subir Imágenes'}
          </AdminButton>
          
          <AdminButton type="button" $variant="secondary" onClick={() => navigate('/admin/productos')}>
            Finalizar
          </AdminButton>
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
    </ProductoFormContainer>
  );
};

export default AgregarProductoNuevo;