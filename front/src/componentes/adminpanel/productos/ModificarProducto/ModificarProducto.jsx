import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModificarProductoContainer, ModificarProductoForm, FormTitle, FormGroup, Label, Input, Select,TextArea, ModificarProductoBoton, CargarImagenContainer, DropzoneLabel,FileInputHidden,PrevisualizacionInfo,ImagenesGrid,ImagenCard,AccionesGrupo,BotonAccion,EstadoMensaje,ImagenesExistentesGrid,ImagenExistenteCard,ImagenExistenteImg,ImagenExistenteInfo} from "./ModificarProducto.styles";
import useCategorias from "../../../../hooks/categorias/useCategorias";
import { tiendaRequest } from "../../../../services/api/apiClient";

const CAMPOS_FORMULARIO = [
  { name: 'nombre', label: 'Nombre *', type: 'text', required: true, placeholder: 'Ej: Remera Oversize' },
  { name: 'sku', label: 'SKU (Opcional)', type: 'number', required: false, placeholder: '10024' },
  { name: 'precio', label: 'Precio ($) *', type: 'number', step: '0.01', required: true, placeholder: '1500.50' },
  { name: 'precio_descuento', label: 'Precio promocional ($)', type: 'number', step: '0.01', required: false, placeholder: 'Dejá vacío para quitarlo' },
  { name: 'stock', label: 'Stock *', type: 'number', required: true, placeholder: '10' },
];

const ModificarProducto = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { categorias } = useCategorias();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: [],
    sku: '',
    precio: '',
    precio_descuento: '',
    stock: '',
    descripcion: ''
  });

  // Estados para carga de imágenes
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [cargandoImagenes, setCargandoImagenes] = useState(false);
  const [productoCargado, setProductoCargado] = useState(false);
  const [productoActualizado, setProductoActualizado] = useState(false);

  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState(null);
  const [exitoMessage, setExitoMessage] = useState(null);

  // ✅ 1. Cargar los datos del producto al montar el componente
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await tiendaRequest(`/productos/${id}`, { auth: true });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.detail || 'Error al cargar el producto');
          return;
        }

        const data = await response.json();
        // ✅ Precargar el formulario con los datos del producto
        setFormData({
          nombre: data.nombre || '',
          categoria: data.categoria?.map(cat => cat.id) || [],
          sku: data.sku || '',
          precio: data.precio || '',
          precio_descuento: data.precio_descuento || '',
          stock: data.stock || '',
          descripcion: data.descripcion || ''
        });

        setImagenesExistentes(data.imagen_url || []);
        setProductoCargado(true);
      } catch (error) {
        console.error('Error cargando producto:', error);
        setErrorMessage('Error al conectar con el servidor');
      }
    };

    if (id) {
      cargarProducto();
    }
  }, [id]);

  // Handlers para el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriasChange = (e) => {
    const idsSeleccionados = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setFormData((prev) => ({ ...prev, categoria: idsSeleccionados }));
  };

  const actualizarProducto = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      sku: formData.sku ? Number(formData.sku) : null,
      precio: parseFloat(formData.precio),
      precio_descuento: formData.precio_descuento ? parseFloat(formData.precio_descuento) : null,
      stock: parseInt(formData.stock, 10),
      descripcion: formData.descripcion || null
    };

    try {
      const response = await tiendaRequest(`/productos/${id}`, {
        method: 'PATCH',
        auth: true,
        body: payload
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(typeof data.detail === 'string' ? data.detail : 'Error al actualizar el producto');
        return;
      }

      setExitoMessage('✅ Producto actualizado con éxito');
      setProductoActualizado(true);
      if (data.imagen_url) {
        setImagenesExistentes(data.imagen_url);
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
      setErrorMessage('Error al conectar con el servidor');
    }
  };


  const handleImagenesSeleccionadas = (e) => {
    const archivos = Array.from(e.target.files);
    setImagenesNuevas(archivos);
  };

  const cargarImagenes = async () => {
    if (imagenesNuevas.length === 0) {
      setErrorMessage('Selecciona al menos una imagen');
      return;
    }

    const productoId = id;
    if (!productoId) {
      setErrorMessage('No se encontró el ID del producto');
      return;
    }

    setCargandoImagenes(true);
    const payloadImagenes = new FormData();
    imagenesNuevas.forEach((imagen) => {
      payloadImagenes.append('archivos', imagen);
    });

    try {
      const response = await tiendaRequest(`/productos/${productoId}/imagenes`, {
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
      setExitoMessage(data.mensaje || '✅ Imágenes cargadas con éxito');
      // Actualizar la lista de imágenes existentes
      setImagenesExistentes(data.imagen_url || []);
      setImagenesNuevas([]);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      setErrorMessage('Error al conectar con el servidor');
    } finally {
      setCargandoImagenes(false);
    }
  };

  // ✅ 4. Renderizado condicional
  if (!productoCargado) {
    return <div>Cargando producto...</div>;
  }

  return (
    <ModificarProductoContainer>
      {!productoActualizado ? (

        <>
          <FormTitle>Editar Producto</FormTitle>
          <ModificarProductoForm onSubmit={actualizarProducto}>
            {CAMPOS_FORMULARIO.map(({ name, label, ...inputProps }) => (
              <FormGroup key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  value={formData[name] || ''}
                  {...inputProps}
                  onChange={handleChange}
                />
              </FormGroup>
            ))}

            <FormGroup>
              <Label htmlFor="categoria">Categorías * (Mantené Ctrl/Cmd para elegir varias)</Label>
              <Select
                id="categoria"
                name="categoria"
                multiple
                required
                value={formData.categoria.map(String)}
                onChange={handleCategoriasChange}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup className="full-width">
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <TextArea
                id="descripcion"
                name="descripcion"
                rows="3"
                placeholder="Detalles sobre el producto..."
                value={formData.descripcion || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <ModificarProductoBoton type="submit">Actualizar Producto</ModificarProductoBoton>

            {errorMessage && <EstadoMensaje $esError>{errorMessage}</EstadoMensaje>}
            {exitoMessage && <EstadoMensaje $esError={false}>{exitoMessage}</EstadoMensaje>}
          </ModificarProductoForm>
        </>
      ) : (
      
        <CargarImagenContainer>
          <h3>Gestionar imágenes del producto</h3>

          {/* Mostrar imágenes existentes */}
          {imagenesExistentes.length > 0 && (
            <>
              <p><strong>Imágenes actuales ({imagenesExistentes.length}/5):</strong></p>
              <ImagenesExistentesGrid>
                {imagenesExistentes.map((url, index) => (
                  <ImagenExistenteCard key={index}>
                    <ImagenExistenteImg src={url} alt={`Imagen ${index + 1}`} />
                    <ImagenExistenteInfo>
                      <span>Imagen {index + 1}</span>
                      {/* Aquí podrías agregar un botón para eliminar si tu backend lo soporta */}
                    </ImagenExistenteInfo>
                  </ImagenExistenteCard>
                ))}
              </ImagenesExistentesGrid>
            </>
          )}

          {/* Zona de drop para nuevas imágenes */}
          <DropzoneLabel htmlFor="input-archivos">
            <span className="dropzone-icon">📸</span>
            <span className="dropzone-text">
              <strong>Hacé clic acá</strong> para seleccionar nuevas fotos
            </span>
            <span className="dropzone-subtext">Podés elegir varios archivos PNG, JPG o WEBP (máx. 5 en total)</span>
            <FileInputHidden
              id="input-archivos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagenesSeleccionadas}
            />
          </DropzoneLabel>

          {imagenesNuevas.length > 0 && (
            <div>
              <PrevisualizacionInfo>
                Imágenes nuevas seleccionadas: <strong>{imagenesNuevas.length}</strong>
              </PrevisualizacionInfo>
              <ImagenesGrid>
                {imagenesNuevas.map((img, index) => (
                  <ImagenCard key={index}>
                    <img src={URL.createObjectURL(img)} alt={img.name} />
                    <span title={img.name}>{img.name}</span>
                  </ImagenCard>
                ))}
              </ImagenesGrid>
            </div>
          )}

          <AccionesGrupo>
            <BotonAccion
              type="button"
              onClick={cargarImagenes}
              disabled={cargandoImagenes || imagenesNuevas.length === 0}
            >
              {cargandoImagenes ? 'Subiendo...' : 'Subir Imágenes'}
            </BotonAccion>
            <BotonAccion type="button" onClick={() => navigate('/admin/productos')}>
              Finalizar
            </BotonAccion>
          </AccionesGrupo>

          {errorMessage && <EstadoMensaje $esError>{errorMessage}</EstadoMensaje>}
          {exitoMessage && <EstadoMensaje $esError={false}>{exitoMessage}</EstadoMensaje>}
        </CargarImagenContainer>
      )}
    </ModificarProductoContainer>
  );
};

export default ModificarProducto;