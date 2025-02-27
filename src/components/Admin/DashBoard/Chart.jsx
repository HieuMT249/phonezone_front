import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF6361",
  "#58508D",
  "#FFA600",
  "#BC5090",
  "#003F5C",
];

export default function Chart() {
  const [brandData, setBrandData] = useState([]);

  // Hàm fetch dữ liệu từ API
  const fetchBrandData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminProduct/brand-product-count"
      );
      setBrandData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };

  useEffect(() => {
    fetchBrandData();
  }, []);

  return (
    <div className="bg-white p-8 shadow-md rounded-xl w-full flex justify-center">
      <div className="max-w-screen-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Tổng Số Lượng Sản Phẩm Theo Hãng
        </h2>
        <PieChart width={1000} height={800}>
          <Pie
            data={brandData}
            cx="50%"
            cy="50%"
            outerRadius={300}
            fill="#8884d8"
            dataKey="productCount"
            nameKey="brandName"
            label
          >
            {brandData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} sản phẩm`} />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
