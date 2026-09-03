import { useState } from "react"
import useRoles from "../../../hooks/roles/useRoles"
import useAsignarRol from "../../../hooks/usuarios/useAsignarRol"
import { ContenedorRol, BotonRol, ItemRol,ListaRoles,MensajeError,OpcionRol } from "./RolUsuario.styles"
import { useRef, useEffect } from "react"

const RolUsuario = ({ usuario, onRolUpdated }) => {
    const { roles } = useRoles()
    const { asignarRol, statusError } = useAsignarRol()

    const [mostrarMenu, setMostrarMenu] = useState(false)
    const [rolActual, setRolActual] = useState(usuario.rol || usuario.rol_obj)
    const [cargando, setCargando] = useState(false)

    // 1. Creamos la referencia al contenedor principal
    const contenedorRef = useRef(null)

    // 2. Efecto para detectar clics fuera del componente
    useEffect(() => {
        const handleClickAfuera = (event) => {
            if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
                setMostrarMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickAfuera)


        return () => {
            document.removeEventListener('mousedown', handleClickAfuera)
        }
    }, [])

    const handleSeleccionarRol = async (rolId, rolNombre) => {
        setCargando(true)
        const { ok, data } = await asignarRol(usuario.id, rolId)
        setCargando(false)

        if (ok) {
            setRolActual(data.rol_obj || rolNombre)
            setMostrarMenu(false)
            
            if (onRolUpdated) onRolUpdated(data)
        }
    }

    return (
        <ContenedorRol ref={contenedorRef} onClick={(e) => e.stopPropagation()}>
            <BotonRol 
                $admin={rolActual === 'admin'} 
                onClick={() => setMostrarMenu(!mostrarMenu)}
                disabled={cargando}
            >
                {cargando ? "Cargando..." : (rolActual || "Sin Rol")}
            </BotonRol>

            {mostrarMenu && (
                <ListaRoles>
                    {roles && roles.map((rol) => (
                        <ItemRol key={rol.id}>
                            <OpcionRol onClick={() => handleSeleccionarRol(rol.id, rol.nombre)}>
                                {rol.nombre}
                            </OpcionRol>
                        </ItemRol>
                    ))}
                </ListaRoles>
            )}

            {statusError !== null && (
                <MensajeError>
                    {statusError === 404 ? "No encontrado" : "Error al guardar"}
                </MensajeError>
            )}
        </ContenedorRol>
    )
}

export default RolUsuario