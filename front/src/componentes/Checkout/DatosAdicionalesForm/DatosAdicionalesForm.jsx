import { useState } from "react"
import { FormContainer, FormTitle, GridContainer, InputGroup, StyledInput, Label } from './DatosAdicionalesForm.styles'


const camposMP = [
    { name: 'nombre', placeholder: 'Nombre', type: 'text', span: 6, label: 'Nombre', required: true },
    { name: 'apellido', placeholder: 'Apellido', type: 'text', span: 6, label: 'Apellido', required: true },
    { name: 'telefonoArea', placeholder: 'Cod. área', type: 'number', span: 4, label: 'Codigo de area telefono', required: true },
    { name: 'telefonoNumero', placeholder: 'Teléfono', type: 'number', span: 8, label: 'Numero de Telefono', required: true },
    { name: 'codigoPostal', placeholder: 'Código postal', type: 'text', span: 3, label: 'Codigo postal', required: true },
    { name: 'nombreCalle', placeholder: 'Calle', type: 'text', span: 6, label: 'Calle', required: true },
    { name: 'numeroCalle', placeholder: 'Número', type: 'number', span: 3, label: 'Numero de calle', required: true },
    { name: 'provincia', placeholder: 'Provincia', type: 'text', span: 4, label: 'Provincia', required: true },
    { name: 'localidad', placeholder: 'Localidad', type: 'text', span: 4, label: 'Localidad', required: true },
    { name: 'detalleDireccion', placeholder: 'Piso, depto, etc. (opcional)', type: 'text', span: 4, label: 'Piso / Depto (opcional)', required: false },
]

const DatosAdicionalesForm = ({ onChangeFormData }) => {
    const [formDataMP, setFormDataMP] = useState({
        nombre: '',
        apellido: '',
        telefonoArea: '',
        telefonoNumero: '',
        codigoPostal: '',
        nombreCalle: '',
        numeroCalle: '',
        provincia: '',
        localidad: '',
        detalleDireccion: '',
    })

    const handleChangeMP = (e) => {
        const { name, value } = e.target
        const nuevo = { ...formDataMP, [name]: value }
        setFormDataMP(nuevo)
        onChangeFormData(nuevo)
    }

    return (
    <FormContainer>
      <FormTitle>Datos adicionales para el pago</FormTitle>
      <GridContainer>
        {camposMP.map((campo) => (
          <InputGroup key={campo.name} $span={`span ${campo.span}`}>
            <Label>{campo.label}</Label>
            <StyledInput
              type={campo.type}
              name={campo.name}
              placeholder={campo.placeholder || ''}
              value={formDataMP[campo.name]}
              required={campo.required}
              onChange={handleChangeMP}
            />
          </InputGroup>
        ))}
      </GridContainer>
    </FormContainer>
  )
}

export default DatosAdicionalesForm