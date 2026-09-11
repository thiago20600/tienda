import { useState } from 'react';
import useImportarProductos from '../../../../hooks/productos/useImportarProductos';
import AdminButton from '../../../../componentes/adminpanel/ui/AdminButton/AdminButton';
import { ImportarContainer, DropzoneLabel, FileInputHidden, ResultadoBox, ListaErrores, ColumnasInfo } from './ImportarProductos.styles';

const ImportarProductos = () => {
    const { importar, cargando } = useImportarProductos();
    const [archivo, setArchivo] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);

    const handleArchivo = (e) => {
        setArchivo(e.target.files[0] || null);
        setResultado(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!archivo) {
            setError('Seleccioná un archivo CSV primero.');
            return;
        }

        const respuesta = await importar(archivo);
        if (!respuesta.ok) {
            setError(respuesta.detalle || 'No se pudo importar el archivo.');
            setResultado(null);
            return;
        }

        setResultado(respuesta);
    };

    return (
        <ImportarContainer>
            <h2>Importar productos desde CSV</h2>

            <ColumnasInfo>
                <p>El archivo debe tener estas columnas en la primera fila:</p>
                <code>nombre, precio, stock, sku, precio_descuento, descripcion, categorias</code>
                <p>
                    Solo <strong>nombre, precio y stock</strong> son obligatorios. Las categorías van
                    separadas por <strong>;</strong> y deben existir previamente (ej: <code>Remeras;Ofertas</code>).
                </p>
            </ColumnasInfo>

            <form onSubmit={handleSubmit}>
                <DropzoneLabel htmlFor="csv-input">
                    <strong>{archivo ? archivo.name : 'Hacé clic para elegir un archivo CSV'}</strong>
                    <FileInputHidden
                        id="csv-input"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleArchivo}
                    />
                </DropzoneLabel>

                <AdminButton type="submit" disabled={cargando || !archivo}>
                    {cargando ? 'Importando...' : 'Importar'}
                </AdminButton>
            </form>

            {error && <ResultadoBox $esError>{error}</ResultadoBox>}

            {resultado && (
                <ResultadoBox>
                    <h3>Resultado de la importación</h3>
                    <p><strong>Creados:</strong> {resultado.creados?.length || 0}</p>
                    {resultado.creados?.length > 0 && <p>{resultado.creados.join(', ')}</p>}
                    <p><strong>Con errores:</strong> {resultado.errores?.length || 0}</p>
                    {resultado.errores?.length > 0 && (
                        <ListaErrores>
                            {resultado.errores.map((e) => (
                                <li key={e.fila}>Fila {e.fila}: {e.error}</li>
                            ))}
                        </ListaErrores>
                    )}
                </ResultadoBox>
            )}
        </ImportarContainer>
    );
};

export default ImportarProductos;
