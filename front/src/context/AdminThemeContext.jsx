import { createContext, useContext } from 'react'

const AdminThemeContext = createContext({
    theme: {
        primary: '#009ee3',
        secondary: '#0081b8'
    }
})

export const useAdminTheme = () => useContext(AdminThemeContext)

export default AdminThemeContext
