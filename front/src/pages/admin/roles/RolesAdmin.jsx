import { useState, useEffect } from "react"
import useRoles from "../../../hooks/roles/useRoles"
import usePermisos from "../../../hooks/roles/usePermisos"
import useCrearRol from "../../../hooks/roles/useCrearRol"
import useActualizarRol from "../../../hooks/roles/useActualizarRol"
import useAsignarPermisos from "../../../hooks/roles/useAsignarPermisos"
import useEliminarRol from "../../../hooks/roles/useEliminarRol"
import {
    RolesContainer,
    RolesHeader,
    CrearRolForm,
    CrearRolInput,
    CrearRolBoton,
    RolCard,
    RolCardHeader,
    RolNombre,
    RolEstadoBadge,
    RolAcciones,
    BotonSecundario,
    BotonEliminar,
    PermisosGrid,
    PermisoCheckboxLabel,
    MensajeRoles
} from "./RolesAdmin.styles"

const RolCardItem = ({ rol, permisosDisponibles, onRolActualizado, onRolEliminado }) => {
    const { actualizarRol } = useActualizarRol()
    const { asignarPermisos, statusError: errorAsignar } = useAsignarPermisos()
    const { eliminarRol, statusError: errorEliminar } = useEliminarRol()

    const [permisosSeleccionados, setPermisosSeleccionados] = useState(
        new Set(rol.permisos.map((p) => p.id))
    )
    const [guardando, setGuardando] = useState(false)
    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setPermisosSeleccionados(new Set(rol.permisos.map((p) => p.id)))
    }, [rol.permisos])

    const togglePermiso = (permisoId) => {
        setPermisosSeleccionados((actuales) => {
            const nuevos = new Set(actuales)
            if (nuevos.has(permisoId)) {
                nuevos.delete(permisoId)
            } else {
                nuevos.add(permisoId)
            }
            return nuevos
        })
    }

    const guardarPermisos = async () => {
        setGuardando(true)
        setMensaje(null)
        const resultado = await asignarPermisos(rol.id, Array.from(permisosSeleccionados))
        if (resultado.ok) {
            setMensaje({ texto: 'Permisos actualizados correctamente.' })
            onRolActualizado()
        } else {
            setMensaje({ error: resultado.data?.detail || `Error al guardar (código: ${errorAsignar})` })
        }
        setGuardando(false)
    }

    const toggleActivo = async () => {
        const resultado = await actualizarRol(rol.id, { activo: !rol.activo })
        if (resultado.ok) {
            onRolActualizado()
        } else {
            setMensaje({ error: resultado.data?.detail || 'Error al cambiar el estado.' })
        }
    }

    const handleEliminar = async () => {
        if (!window.confirm(`¿Eliminar el rol "${rol.nombre}"?`)) return
        const resultado = await eliminarRol(rol.id)
        if (resultado.ok) {
            onRolEliminado()
        } else {
            setMensaje({ error: resultado.data?.detail || `No se pudo eliminar (código: ${errorEliminar})` })
        }
    }

    return (
        <RolCard>
            <RolCardHeader>
                <RolNombre>
                    {rol.nombre}
                    <RolEstadoBadge $activo={rol.activo}>{rol.activo ? 'Activo' : 'Inactivo'}</RolEstadoBadge>
                </RolNombre>
                <RolAcciones>
                    <BotonSecundario type="button" onClick={toggleActivo}>
                        {rol.activo ? 'Desactivar' : 'Activar'}
                    </BotonSecundario>
                    <BotonEliminar type="button" onClick={handleEliminar}>Eliminar rol</BotonEliminar>
                </RolAcciones>
            </RolCardHeader>

            <PermisosGrid>
                {permisosDisponibles.map((permiso) => (
                    <PermisoCheckboxLabel key={permiso.id}>
                        <input
                            type="checkbox"
                            checked={permisosSeleccionados.has(permiso.id)}
                            onChange={() => togglePermiso(permiso.id)}
                        />
                        {permiso.nombre}
                    </PermisoCheckboxLabel>
                ))}
            </PermisosGrid>

            <BotonSecundario type="button" disabled={guardando} onClick={guardarPermisos}>
                {guardando ? 'Guardando...' : 'Guardar permisos'}
            </BotonSecundario>

            {mensaje && <MensajeRoles $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</MensajeRoles>}
        </RolCard>
    )
}

const RolesAdmin = () => {
    const { roles, cargando, statusError, recargarRoles } = useRoles()
    const { permisos: permisosDisponibles, cargando: cargandoPermisos } = usePermisos()
    const { crearRol, statusError: errorCrear } = useCrearRol()

    const [nombreNuevoRol, setNombreNuevoRol] = useState('')
    const [mensajeCrear, setMensajeCrear] = useState(null)

    const handleCrearRol = async (event) => {
        event.preventDefault()
        if (!nombreNuevoRol.trim()) return

        const resultado = await crearRol({ nombre: nombreNuevoRol.trim(), activo: true })
        if (resultado.ok) {
            setNombreNuevoRol('')
            setMensajeCrear({ texto: 'Rol creado correctamente.' })
            recargarRoles()
        } else {
            setMensajeCrear({ error: resultado.data?.detail || `Error al crear (código: ${errorCrear})` })
        }
    }

    if (cargando || cargandoPermisos) {
        return <RolesContainer><p>Cargando roles y permisos...</p></RolesContainer>
    }

    if (statusError) {
        return <RolesContainer><MensajeRoles $error>Error al cargar roles (código: {statusError})</MensajeRoles></RolesContainer>
    }

    return (
        <RolesContainer>
            <RolesHeader>
                <h1>Roles y permisos</h1>
            </RolesHeader>

            <CrearRolForm onSubmit={handleCrearRol}>
                <CrearRolInput
                    type="text"
                    placeholder="Nombre del nuevo rol"
                    value={nombreNuevoRol}
                    onChange={(event) => setNombreNuevoRol(event.target.value)}
                />
                <CrearRolBoton type="submit">Crear rol</CrearRolBoton>
            </CrearRolForm>

            {mensajeCrear && <MensajeRoles $error={Boolean(mensajeCrear.error)}>{mensajeCrear.error || mensajeCrear.texto}</MensajeRoles>}

            {roles.map((rol) => (
                <RolCardItem
                    key={rol.id}
                    rol={rol}
                    permisosDisponibles={permisosDisponibles}
                    onRolActualizado={recargarRoles}
                    onRolEliminado={recargarRoles}
                />
            ))}
        </RolesContainer>
    )
}

export default RolesAdmin
