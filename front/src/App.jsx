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
import RutaProtegida from "./auth/RutaProtegida"
import AgregarProductoNuevo from "./componentes/adminpanel/productos/AgregarProductoNuevo/AgregarProductoNuevo"
import ModificarProducto from "./componentes/adminpanel/productos/ModificarProducto/ModificarProducto"

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
      </Route>

      <Route element={<BaseLayout/>}>
        <Route path='/carrito' element={<Carrito/>}/>
      </Route>

      <Route element={<CheckoutLayout/>}>
        <Route path='/checkout' element={<Checkout/>}/>
      </Route>

      {/* cambiar */}
      <Route element={<RutaProtegida rolRequerido="admin" />}>
        <Route element={<BaseLayoutAdmin/>}>
          <Route path='/admin' element={<AdminPage/>} />
          <Route path='/admin/productos' element={<ProductosAdmin/>}></Route>
            <Route path='/admin/productos/nuevo' element={<AgregarProductoNuevo/>}></Route>
            <Route path='/admin/productos/:id' element={<ModificarProducto/>}/>
          <Route path='/admin/categorias' element={<CategoriasAdmin/>} />
          <Route path='/admin/configuracion' element={<ConfiguracionAdmin/>} />
          <Route path='/admin/pedidos' element={<PedidosAdmin/>} />
        </Route>
      </Route>

    </Routes>

  )
}

export default App