import { useState } from "react"
import useRoles from "../../../hooks/roles/useRoles"
import useAsignarRol from "../../../hooks/usuarios/useAsignarRol"
import { ContenedorRol, BotonRol, ItemRol,ListaRoles,MensajeError,OpcionRol } from "./RolUsuario.styles"
import { useRef, useEffect } from "react"

const RolUsuario = ({ usuario, onRolUpdated, roles }) => {
    const { asignarRol, statusError } = useAsignarRol()

    const [mostrarMenu, setMostrarMenu] = useState(false)
    // Nos aseguramos de guardar siempre la cadena de texto (string)
    const [rolActual, setRolActual] = useState(usuario.rol || "Sin Rol")
    const [cargando, setCargando] = useState(false)

    const contenedorRef = useRef(null)


    useEffect(() => {
        if (usuario.rol) {
            setRolActual(usuario.rol)
        }
    }, [usuario.rol])

    // Cerrar el menú desplegable al hacer clic fuera
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
            // El backend retorna { id, username, email, active, rol: "string" }
            const nuevoRolString = data.rol || rolNombre
            setRolActual(nuevoRolString)
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
                {cargando ? "Cargando..." : rolActual}
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