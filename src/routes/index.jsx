// Pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import Product from "../pages/Product";
import WishList from "../pages/WishList";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import ChangePassword from "../pages/ChangePassword";
import EditProfile from "../pages/EditProfile";
// Pages dành cho Admin
import AdminDashboard from "../pages/Admin/AdminDashboard";
import PhoneManagement from "../pages/Admin/PhoneManagement";
import BrandManageMent from "../pages/Admin/BrandManageMent";
import UserManagement from "../pages/Admin/UserManagement";
import OrderManagement from "../pages/Admin/OrderManagement";
import CouponManagement from "../pages/Admin/CouponManagement";
import AddNewPhone from "../pages/Admin/AddNewPhone";
import EditPhone from "../pages/Admin/EditPhone";
import UserDetail from "../pages/Admin/UserDetail";
import OrderDetail from "../pages/Admin/OrderDetail";
import Analytics from "../pages/Admin/Analytics";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Các trang không cần đăng nhập
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, layout: "login" },
  { path: "/register", component: Register, layout: "register" },
  { path: "/dienthoai", component: Product },
  { path: "/dienthoai/*", component: ProductList },
  { path: "/dienthoai/details/*", component: ProductDetail },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:token", component: ResetPassword },
];

// Các trang cần đăng nhập
const privateRoutes = [
  { path: "/order", component: Order },
  { path: "/cart", component: Cart },
  { path: "/editprofile", component: EditProfile },
  { path: "/changepassword", component: ChangePassword },
  { path: "/wishlist", component: WishList },
];

// Các trang dành riêng cho Admin
const adminRoutes = [
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/phones", component: PhoneManagement },
  { path: "/admin/brands", component: BrandManageMent },
  { path: "/admin/users", component: UserManagement },
  { path: "/admin/orders", component: OrderManagement },
  { path: "/admin/coupons", component: CouponManagement },
  { path: "/admin/addphone", component: AddNewPhone },
  { path: "/admin/editphone/:id", component: EditPhone },
  { path: "/admin/userdetail/:id", component: UserDetail },
  { path: "/admin/orderdetail/:orderId", component: OrderDetail },
  { path: "/admin/analytics", component: Analytics },
];

export { publicRoutes, privateRoutes, adminRoutes };
