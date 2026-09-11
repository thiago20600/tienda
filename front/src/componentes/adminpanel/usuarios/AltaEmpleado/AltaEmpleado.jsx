import { useState } from "react";
import useCrearEmpleado from "../../../../hooks/usuarios/useCrearEmpleado";
import {
  AltaEmpleadoModal,
  AltaEmpleadoCerrar,
  AltaEmpleadoLabel,
  AltaEmpleadoInput,
  AltaEmpleadoSelect,
  AltaEmpleadoError,
  AltaEmpleadoMensaje,
} from "./AltaEmpleado.styles";
import AdminButton from "../../ui/AdminButton/AdminButton"

const AltaEmpleado = ({ roles = [], onEmpleadoCreado, onCerrar }) => {
  const { crearEmpleado, cargando } = useCrearEmpleado();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    telefono: '',
    domicilio: '',
    rolId: '',
  });
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.telefono ||
      !formData.domicilio.trim()
    ) {
      setError('Completá todos los campos obligatorios.');
      return;
    }

    const resultado = await crearEmpleado({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      telefono: formData.telefono.trim(),
      domicilio: formData.domicilio.trim(),
      rol_id: formData.rolId ? Number(formData.rolId) : null,
    });

    if (!resultado.ok) {
      const detalle = resultado.data?.detail;
      setError(typeof detalle === 'string' ? detalle : 'No se pudo dar de alta el empleado.');
      return;
    }

    setMensaje('Empleado creado correctamente.');
    if (onEmpleadoCreado) onEmpleadoCreado(resultado.data);
    setTimeout(() => {
      if (onCerrar) onCerrar();
    }, 1200);
  };

  return (
    <AltaEmpleadoModal>
      <div>
        <AltaEmpleadoCerrar type="button" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </AltaEmpleadoCerrar>
        <h2>Dar de alta empleado</h2>

        <form onSubmit={handleSubmit}>
          <AltaEmpleadoLabel>
            Nombre de usuario *
            <AltaEmpleadoInput
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="ej: jperez"
              required
            />
          </AltaEmpleadoLabel>

          <AltaEmpleadoLabel>
            Email *
            <AltaEmpleadoInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ej: jperez@tienda.com"
              required
            />
          </AltaEmpleadoLabel>

          <AltaEmpleadoLabel>
            Contraseña *
            <AltaEmpleadoInput
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </AltaEmpleadoLabel>

          <AltaEmpleadoLabel>
            Teléfono *
            <AltaEmpleadoInput
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="ej: 1122334455"
              pattern="[0-9+\-\s()]+"
              minLength={6}
              maxLength={20}
              required
            />
          </AltaEmpleadoLabel>

          <AltaEmpleadoLabel>
            Domicilio *
            <AltaEmpleadoInput
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              placeholder="ej: Av. Siempre Viva 123"
              required
            />
          </AltaEmpleadoLabel>

          <AltaEmpleadoLabel>
            Rol
            <AltaEmpleadoSelect name="rolId" value={formData.rolId} onChange={handleChange}>
              <option value="">Empleado (por defecto)</option>
              {roles.filter((rol) => rol.nombre !== 'cliente').map((rol) => (
                <option key={rol.id} value={rol.id}>{rol.nombre}</option>
              ))}
            </AltaEmpleadoSelect>
          </AltaEmpleadoLabel>

          {error && <AltaEmpleadoError>{error}</AltaEmpleadoError>}
          {mensaje && <AltaEmpleadoMensaje>{mensaje}</AltaEmpleadoMensaje>}

          <AdminButton type="submit" disabled={cargando}>
            {cargando ? 'Creando empleado...' : 'Crear empleado'}
          </AdminButton>
        </form>
      </div>
    </AltaEmpleadoModal>
  );
};

export default AltaEmpleado;