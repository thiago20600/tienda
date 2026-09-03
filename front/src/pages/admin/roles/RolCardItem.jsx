import { useState, useEffect, useMemo } from "react"
import useActualizarRol from "../../../hooks/roles/useActualizarRol"
import useAsignarPermisos from "../../../hooks/roles/useAsignarPermisos"
import useEliminarRol from "../../../hooks/roles/useEliminarRol"
import { agruparPermisosPorModulo, obtenerEtiquetaPermiso } from "../../../../utils/permisos"
import {RolCard,RolCardHeader,RolNombre,RolEstadoBadge,RolAcciones,BotonSecundario,BotonEliminar,PermisoCheckboxLabel,MensajeRoles,BotonTexto,ModuloCard,ModuloHeader,ModulosContainer,PermisosLista
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

    const permisosPorModulo = useMemo(
        () => agruparPermisosPorModulo(permisosDisponibles),
        [permisosDisponibles]
    )

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

    const toggleModuloCompleto = (permisosModulo) => {
        const todosSeleccionados = permisosModulo.every((p) => permisosSeleccionados.has(p.id))
        setPermisosSeleccionados((actuales) => {
            const nuevos = new Set(actuales)
            permisosModulo.forEach((p) => {
                if (todosSeleccionados) {
                    nuevos.delete(p.id)
                } else {
                    nuevos.add(p.id)
                }
            })
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

            <ModulosContainer>
                {Object.entries(permisosPorModulo).map(([modulo, permisosModulo]) => {
                    const todosCheck = permisosModulo.every((p) => permisosSeleccionados.has(p.id))

                    return (
                        <ModuloCard key={modulo}>
                            <ModuloHeader>
                                <h4>{modulo.toUpperCase()}</h4>
                                <BotonTexto type="button" onClick={() => toggleModuloCompleto(permisosModulo)}>
                                    {todosCheck ? 'Desmarcar todos' : 'Seleccionar todos'}
                                </BotonTexto>
                            </ModuloHeader>

                            <PermisosLista>
                                {permisosModulo.map((permiso) => (
                                    <PermisoCheckboxLabel key={permiso.id}>
                                        <input
                                            type="checkbox"
                                            checked={permisosSeleccionados.has(permiso.id)}
                                            onChange={() => togglePermiso(permiso.id)}
                                        />
                                        <span>{obtenerEtiquetaPermiso(permiso.accion, permiso.alcance)}</span>
                                    </PermisoCheckboxLabel>
                                ))}
                            </PermisosLista>
                        </ModuloCard>
                    )
                })}
            </ModulosContainer>

            <BotonSecundario type="button" disabled={guardando} onClick={guardarPermisos}>
                {guardando ? 'Guardando...' : 'Guardar permisos'}
            </BotonSecundario>

            {mensaje && <MensajeRoles $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</MensajeRoles>}
        </RolCard>
    )
}

export default RolCardItem