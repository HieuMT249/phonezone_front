import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export default function DashboardCards() {
  // State để lưu dữ liệu thống kê
  const [stats, setStats] = useState([
    {
      label: "Người dùng",
      value: 0,
      icon: "pi pi-users",
      color: "bg-blue-500",
    },
    {
      label: "Sản phẩm",
      value: 0,
      icon: "pi pi-mobile",
      color: "bg-green-500",
    },
    {
      label: "Đơn hàng",
      value: 0,
      icon: "pi pi-shopping-cart",
      color: "bg-yellow-500",
    },
    { label: "Coupon", value: 0, icon: "pi pi-tag", color: "bg-red-500" },
  ]);

  // Hàm gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi các API để lấy dữ liệu
        const [usersRes, productsRes, ordersRes, couponsRes] =
          await Promise.all([
            axios.get("https://localhost:7274/api/admin/AdminUser/total"), // Thay localhost:5000 bằng URL thực tế của bạn
            axios.get("https://localhost:7274/api/admin/AdminProduct/total"),
            axios.get("https://localhost:7274/api/admin/AdminOrder/total"),
            axios.get("https://localhost:7274/api/admin/AdminCoupon/total"),
          ]);

        // Cập nhật dữ liệu thống kê
        setStats([
          {
            label: "Người dùng",
            value: usersRes.data,
            icon: "pi pi-users",
            color: "bg-blue-500",
          },
          {
            label: "Sản phẩm",
            value: productsRes.data,
            icon: "pi pi-mobile",
            color: "bg-green-500",
          },
          {
            label: "Đơn hàng",
            value: ordersRes.data,
            icon: "pi pi-shopping-cart",
            color: "bg-yellow-500",
          },
          {
            label: "Coupon",
            value: couponsRes.data,
            icon: "pi pi-tag",
            color: "bg-red-500",
          },
        ]);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`p-4 rounded-xl shadow-md text-white ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <Tag
              className="p-3 rounded-full bg-white text-black"
              icon={stat.icon}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
