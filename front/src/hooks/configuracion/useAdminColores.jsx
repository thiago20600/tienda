import useConfiguracion from './useConfiguracion'

export default function useAdminColores() {
    const { configuracion } = useConfiguracion()
    return { configuracion }
}
