import { useState } from "react"
import useRoles from "../../../hooks/roles/useRoles"
import usePermisos from "../../../hooks/roles/usePermisos"
import useCrearRol from "../../../hooks/roles/useCrearRol"
import RolCardItem from "./RolCardItem"
import {RolesContainer,RolesHeader,CrearRolForm,CrearRolInput,MensajeRoles
} from "./RolesAdmin.styles"
import AdminButton from "../../../componentes/adminpanel/ui/AdminButton/AdminButton"

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
                <AdminButton type="submit">Crear rol</AdminButton>
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