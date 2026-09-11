import { useState, useEffect } from 'react'
import useConfiguracion from '../../../hooks/configuracion/useConfiguracion'
import {
    ConfiguracionContainer,
    ConfiguracionHeader,
    ConfiguracionTitulo,
    ConfiguracionSubtitulo,
    Card,
    CardTitulo,
    FormGroup,
    Label,
    Input,
    ListaItems,
    ItemRow,
    ItemInput,
    BotonIcono,
    BotonAgregar,
    LogoPreview,
    LogoUpload,
    InputFile,
    BotonesContainer,
    MensajeError,
    MensajeExito,
    ColorSection,
    ColorRow,
    ColorPreview,
    ColorInfo,
    ColorLabel,
    ColorHex,
    PaletaContainer,
    ColorSwatch,
    ColorPickerRow,
    ColorInputNative,
    ColorInputHex
} from './configuracionAdmin.styles'
import AdminButton from '../../../componentes/adminpanel/ui/AdminButton/AdminButton'

const COLORES_PREDEFINIDOS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#009ee3', // Cyan (proyecto)
    '#06b6d4', // Teal
    '#22c55e', // Green
    '#84cc16', // Lime
    '#eab308', // Yellow
    '#f97316', // Orange
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#6b7280', // Gray
    '#1a1a2e', // Dark
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#0ea5e9'  // Sky
]

const ConfiguracionAdmin = () => {
    const { configuracion, cargando, actualizando, actualizarConfiguracion, subirLogo } = useConfiguracion()

    const [nombreTienda, setNombreTienda] = useState('')
    const [emails, setEmails] = useState([''])
    const [numeros, setNumeros] = useState([''])
    const [colorPrimario, setColorPrimario] = useState('#009ee3')
    const [colorSecundario, setColorSecundario] = useState('#0081b8')
    const [logoPreview, setLogoPreview] = useState(null)
    const [nuevoLogo, setNuevoLogo] = useState(null)
    const [mensaje, setMensaje] = useState(null)
    const [hayCambios, setHayCambios] = useState(false)

    useEffect(() => {
        if (configuracion) {
            setNombreTienda(configuracion.nombre_tienda || '')
            setEmails(configuracion.emails_contacto?.length ? configuracion.emails_contacto : [''])
            setNumeros(configuracion.numeros_contacto?.length ? configuracion.numeros_contacto : [''])
            setColorPrimario(configuracion.color_primario || '#009ee3')
            setColorSecundario(configuracion.color_secundario || '#0081b8')
            setLogoPreview(configuracion.logo_url || null)
        }
    }, [configuracion])

    const handleEmailChange = (index, valor) => {
        const nuevos = [...emails]
        nuevos[index] = valor
        setEmails(nuevos)
        setHayCambios(true)
    }

    const agregarEmail = () => {
        setEmails([...emails, ''])
        setHayCambios(true)
    }

    const eliminarEmail = (index) => {
        if (emails.length === 1) return
        setEmails(emails.filter((_, i) => i !== index))
        setHayCambios(true)
    }

    const handleNumeroChange = (index, valor) => {
        const nuevos = [...numeros]
        nuevos[index] = valor
        setNumeros(nuevos)
        setHayCambios(true)
    }

    const agregarNumero = () => {
        setNumeros([...numeros, ''])
        setHayCambios(true)
    }

    const eliminarNumero = (index) => {
        if (numeros.length === 1) return
        setNumeros(numeros.filter((_, i) => i !== index))
        setHayCambios(true)
    }

    const handleLogoChange = (e) => {
        const archivo = e.target.files[0]
        if (archivo) {
            setNuevoLogo(archivo)
            setLogoPreview(URL.createObjectURL(archivo))
            setHayCambios(true)
        }
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        setMensaje(null)

        let logoUrl = configuracion?.logo_url
        if (nuevoLogo) {
            const resultado = await subirLogo(nuevoLogo)
            if (resultado) {
                logoUrl = resultado.logo_url
            } else {
                setMensaje({ error: 'No se pudo subir el logo. Intentá de nuevo.' })
                return
            }
        }

        const datos = {
            nombre_tienda: nombreTienda.trim(),
            emails_contacto: emails.filter(e => e.trim() !== ''),
            numeros_contacto: numeros.filter(n => n.trim() !== ''),
            color_primario: colorPrimario,
            color_secundario: colorSecundario,
            logo_url: logoUrl
        }

        const resultado = await actualizarConfiguracion(datos)
        if (resultado) {
            setMensaje({ exito: 'Configuración guardada correctamente.' })
            setNuevoLogo(null)
            setHayCambios(false)
        } else {
            setMensaje({ error: 'No se pudo guardar la configuración.' })
        }
    }

    const handleCancelar = () => {
        if (configuracion) {
            setNombreTienda(configuracion.nombre_tienda || '')
            setEmails(configuracion.emails_contacto?.length ? configuracion.emails_contacto : [''])
            setNumeros(configuracion.numeros_contacto?.length ? configuracion.numeros_contacto : [''])
            setColorPrimario(configuracion.color_primario || '#009ee3')
            setColorSecundario(configuracion.color_secundario || '#0081b8')
            setLogoPreview(configuracion.logo_url || null)
        }
        setNuevoLogo(null)
        setMensaje(null)
        setHayCambios(false)
    }

    if (cargando) return <ConfiguracionContainer><p>Cargando configuración...</p></ConfiguracionContainer>

    return (
        <ConfiguracionContainer>
            <ConfiguracionHeader>
                <ConfiguracionTitulo>Configuración General</ConfiguracionTitulo>
                <ConfiguracionSubtitulo>Personalizá los datos y la apariencia de tu tienda</ConfiguracionSubtitulo>
            </ConfiguracionHeader>

            <form onSubmit={handleGuardar}>
                <Card>
                    <CardTitulo>Datos de la tienda</CardTitulo>

                    <FormGroup>
                        <Label htmlFor="nombre-tienda">Nombre de la tienda</Label>
                        <Input
                            id="nombre-tienda"
                            type="text"
                            value={nombreTienda}
                            onChange={(e) => { setNombreTienda(e.target.value); setHayCambios(true) }}
                            placeholder="Ej: Mi Tienda Online"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Logo</Label>
                        <LogoPreview>
                            {logoPreview ? <img src={logoPreview} alt="Logo" /> : <span>Sin logo</span>}
                        </LogoPreview>
                        <LogoUpload>
                            <InputFile
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                        </LogoUpload>
                    </FormGroup>
                </Card>

                <Card>
                    <CardTitulo>Contacto</CardTitulo>

                    <FormGroup>
                        <Label>Emails de contacto</Label>
                        <ListaItems>
                            {emails.map((email, index) => (
                                <ItemRow key={index}>
                                    <ItemInput
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        placeholder="email@ejemplo.com"
                                    />
                                    <BotonIcono
                                        type="button"
                                        $variant="eliminar"
                                        onClick={() => eliminarEmail(index)}
                                        disabled={emails.length === 1}
                                    >
                                        ×
                                    </BotonIcono>
                                </ItemRow>
                            ))}
                        </ListaItems>
                        <BotonAgregar type="button" onClick={agregarEmail}>+ Agregar email</BotonAgregar>
                    </FormGroup>

                    <FormGroup>
                        <Label>Números de contacto</Label>
                        <ListaItems>
                            {numeros.map((numero, index) => (
                                <ItemRow key={index}>
                                    <ItemInput
                                        type="tel"
                                        value={numero}
                                        onChange={(e) => handleNumeroChange(index, e.target.value)}
                                        placeholder="+54 11 1234-5678"
                                    />
                                    <BotonIcono
                                        type="button"
                                        $variant="eliminar"
                                        onClick={() => eliminarNumero(index)}
                                        disabled={numeros.length === 1}
                                    >
                                        ×
                                    </BotonIcono>
                                </ItemRow>
                            ))}
                        </ListaItems>
                        <BotonAgregar type="button" onClick={agregarNumero}>+ Agregar número</BotonAgregar>
                    </FormGroup>
                </Card>

                <Card>
                    <CardTitulo>Apariencia del panel</CardTitulo>

                    <ColorSection>
                        <Label>Color principal</Label>
                        <ColorRow>
                            <ColorPreview $color={colorPrimario} />
                            <ColorInfo>
                                <ColorLabel>Primario</ColorLabel>
                                <ColorHex>{colorPrimario}</ColorHex>
                            </ColorInfo>
                            <ColorPickerRow>
                                <ColorInputNative
                                    type="color"
                                    value={colorPrimario}
                                    onChange={(e) => { setColorPrimario(e.target.value); setHayCambios(true) }}
                                />
                                <ColorInputHex
                                    type="text"
                                    value={colorPrimario}
                                    onChange={(e) => { setColorPrimario(e.target.value); setHayCambios(true) }}
                                    maxLength={7}
                                />
                            </ColorPickerRow>
                        </ColorRow>
                        <PaletaContainer>
                            {COLORES_PREDEFINIDOS.map((color) => (
                                <ColorSwatch
                                    key={color}
                                    $color={color}
                                    $selected={colorPrimario === color}
                                    onClick={() => { setColorPrimario(color); setHayCambios(true) }}
                                    title={color}
                                />
                            ))}
                        </PaletaContainer>

                        <Label>Color secundario</Label>
                        <ColorRow>
                            <ColorPreview $color={colorSecundario} />
                            <ColorInfo>
                                <ColorLabel>Secundario</ColorLabel>
                                <ColorHex>{colorSecundario}</ColorHex>
                            </ColorInfo>
                            <ColorPickerRow>
                                <ColorInputNative
                                    type="color"
                                    value={colorSecundario}
                                    onChange={(e) => { setColorSecundario(e.target.value); setHayCambios(true) }}
                                />
                                <ColorInputHex
                                    type="text"
                                    value={colorSecundario}
                                    onChange={(e) => { setColorSecundario(e.target.value); setHayCambios(true) }}
                                    maxLength={7}
                                />
                            </ColorPickerRow>
                        </ColorRow>
                        <PaletaContainer>
                            {COLORES_PREDEFINIDOS.map((color) => (
                                <ColorSwatch
                                    key={color}
                                    $color={color}
                                    $selected={colorSecundario === color}
                                    onClick={() => { setColorSecundario(color); setHayCambios(true) }}
                                    title={color}
                                />
                            ))}
                        </PaletaContainer>
                    </ColorSection>
                </Card>

                {mensaje?.error && <MensajeError>{mensaje.error}</MensajeError>}
                {mensaje?.exito && <MensajeExito>{mensaje.exito}</MensajeExito>}

                <BotonesContainer>
                    <AdminButton type="submit" disabled={actualizando || !hayCambios}>
                        {actualizando ? 'Guardando...' : 'Guardar cambios'}
                    </AdminButton>
                    <AdminButton type="button" $variant="secondary" onClick={handleCancelar} disabled={!hayCambios}>
                        Cancelar
                    </AdminButton>
                </BotonesContainer>
            </form>
        </ConfiguracionContainer>
    )
}

export default ConfiguracionAdmin

