import { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";
import logo from "../../../assets/images/logo.png";
import avatar from "../../../assets/images/admin-avatar.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminName = "Admin";
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang chủ
  };
  const menuItems = [
    { label: "Dashboard", icon: "pi pi-home", to: "/admin/" },
    { label: "Quản lý điện thoại", icon: "pi pi-mobile", to: "/admin/phones" },
    { label: "Quản lý hãng", icon: "pi pi-briefcase", to: "/admin/brands" },
    { label: "Quản lý người dùng", icon: "pi pi-users", to: "/admin/users" },
    {
      label: "Quản lý đơn hàng",
      icon: "pi pi-shopping-cart",
      to: "/admin/orders",
    },
    { label: "Quản lý coupon", icon: "pi pi-tag", to: "/admin/coupons" },

    // Mục thống kê mới
    {
      label: "Thống kê doanh thu",
      icon: "pi pi-chart-bar",
      to: "/admin/analytics",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar cố định khi màn hình lớn */}
      <div className="hidden md:flex flex-col w-64 bg-blue-500 p-4">
        <div className="flex flex-col items-center text-center">
          <Avatar image={avatar} size="xlarge" shape="circle" />
          <h2 className="text-lg font-semibold">{adminName}</h2>
        </div>
        <h3 className="mt-8 text-lg font-semibold border-b-2 border-gray-300 pb-1">
          MAIN NAVIGATION
        </h3>
        <nav className="mt-4 flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.to}>
              <Button
                label={item.label}
                icon={item.icon}
                className="w-full p-button-text flex items-center gap-2 justify-start text-left"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar di động chỉ hiển thị khi nhỏ hơn md */}
      <Sidebar
        visible={isSidebarOpen}
        onHide={() => setIsSidebarOpen(false)}
        className="p-4 w-64 bg-blue-500"
      >
        <div className="flex flex-col items-center text-center">
          <Avatar image={avatar} size="xlarge" shape="circle" />
          <h3 className="text-lg font-semibold">{adminName}</h3>
        </div>
        <h3 className="mt-8 text-lg font-semibold border-b-2 border-gray-300 pb-1">
          MAIN NAVIGATION
        </h3>
        <nav className="mt-4 flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.to}>
              <Button
                label={item.label}
                icon={item.icon}
                className="w-full p-button-text flex items-center gap-2 justify-start text-left"
              />
            </Link>
          ))}
        </nav>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Menubar
          className="bg-blue-300 text-white border-none shadow-md rounded-none"
          model={[]}
          start={
            <div className="flex items-center space-x-4">
              <Button
                icon="pi pi-bars"
                className="p-button-text md:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              />
              <Image
                src={logo}
                alt="Shop Logo"
                className="h-12 w-auto max-w-[150px] cursor-pointer"
                onClick={() => navigate("/admin")}
              />
            </div>
          }
          end={
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{adminName}</span>
              <Button
                icon="pi pi-sign-out"
                label="Đăng xuất"
                onClick={handleLogout} // Gọi hàm handleLogout khi nhấn nút
                className="p-button-text text-white"
              />
            </div>
          }
        />

        {/* Content Area */}
        <main className="p-4 flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
