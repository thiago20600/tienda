import { Routes, Route } from "react-router-dom"
import './App.css'
import BaseLayout from "./layouts/BaseLayout/BaseLayout"
import Home from "./pages/home/home"
import ProductDetail from "./pages/productDetail/ProductDetail"
import AuthLayout from "./layouts/AuthLayout/AuthLayout"
import { LoginPage } from "./pages/auth/login/Login"
import { RegisterPage } from "./pages/auth/register/Register"
import Carrito from "./pages/cart/carrito"
import Checkout from "./pages/checkout/checkout"
import CheckoutLayout from "./layouts/CheckoutLayout/CheckoutLayout"
import AdminPage from './pages/admin/inicio/admin'
import BaseLayoutAdmin from "./layouts/BaseLayoutAdmin/BaseLayoutAdmin"
import ProductosAdmin from "./pages/admin/productos/productosAdmin"
import CategoriasAdmin from "./pages/admin/categorias/categoriasAdmin"
import ConfiguracionAdmin from "./pages/admin/configuracion/configuracionAdmin"
import PedidosAdmin from "./pages/admin/pedidos/pedidosAdmin"
import PedidoDetalleAdmin from "./componentes/adminpanel/pedidos/PedidoDetalleAdmin"
import RutaProtegida from "./auth/RutaProtegida"
import AgregarProductoNuevo from "./componentes/adminpanel/productos/AgregarProductoNuevo/AgregarProductoNuevo"
import ModificarProducto from "./componentes/adminpanel/productos/ModificarProducto/ModificarProducto"
import NoEncontrado from "./componentes/estado/NoEncontrado"
import Configuracion from "./pages/configuracion/Configuracion"
import ModificarCategoria from "./componentes/adminpanel/categorias/ModificarCategoria/ModificarCategoria"
import ActivateAccount from "./pages/auth/activate/ActivateAccount"
import UsuariosAdmin from './pages/admin/usuarios/UsuariosAdmin'
import RolesAdmin from './pages/admin/roles/RolesAdmin'

function App() {

  return (

    <Routes>

      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />}/>
        <Route path="/productos/:id" element={<ProductDetail />}/>
      </Route>

      <Route element={<AuthLayout/>}>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/activate_account/:token' element={<ActivateAccount/>}/>
      </Route>

      <Route element={<BaseLayout/>}>
        <Route path='/carrito' element={<Carrito/>}/>
        <Route element={<RutaProtegida />}>
          <Route path='/configuracion' element={<Configuracion />} />
        </Route>
      </Route>

      <Route element={<CheckoutLayout/>}>
        <Route path='/checkout' element={<Checkout/>}/>
      </Route>

      {/* cambiar */}
      {/*<Route element={<RutaProtegida rolRequerido="admin" />}>*/}
        <Route element={<BaseLayoutAdmin/>}>
          <Route path='/admin' element={<AdminPage/>} />
          <Route path='/admin/productos' element={<ProductosAdmin/>}></Route>
            <Route path='/admin/productos/nuevo' element={<AgregarProductoNuevo/>}></Route>
            <Route path='/admin/productos/:id' element={<ModificarProducto/>}/>
          <Route path='/admin/categorias' element={<CategoriasAdmin/>} />
          <Route path='/admin/categorias/:id' element={<ModificarCategoria/>} />
          <Route path='/admin/configuracion' element={<ConfiguracionAdmin/>} />
          <Route path='/admin/usuarios' element={<UsuariosAdmin/>} />
          <Route path='/admin/roles' element={<RolesAdmin/>} />
          <Route path='/admin/pedidos' element={<PedidosAdmin/>} />
          <Route path='/admin/pedidos/:id' element={<PedidoDetalleAdmin/>} />
        </Route>
      {/*</Route>*/}

      <Route path="*" element={<NoEncontrado />} />

    </Routes>

  )
}

export default App