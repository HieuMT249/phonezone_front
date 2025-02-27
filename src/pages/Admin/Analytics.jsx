import { useState, useRef } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminStatistics() {
  const toast = useRef(null); // Thêm useRef cho Toast
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1,
  }));
  const years = [2023, 2024, 2025].map((year) => ({
    label: `${year}`,
    value: year,
  }));

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.current.show({
        severity: "warn",
        summary: "Lỗi nhập liệu",
        detail: "Vui lòng chọn tháng và năm.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://localhost:7274/api/admin/AdminOrder/statistics`,
        {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        }
      );

      setFilteredData(response.data);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Dữ liệu đã được tải thành công!",
        life: 3000,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi lấy dữ liệu.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
      <Toast ref={toast} /> {/* Thêm Toast vào UI */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
        📊 Thống Kê Doanh Thu
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="font-medium text-gray-600">Chọn Tháng</label>
          <Dropdown
            value={selectedMonth}
            options={months}
            onChange={(e) => setSelectedMonth(e.value)}
            placeholder="Chọn tháng"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-600">Chọn Năm</label>
          <Dropdown
            value={selectedYear}
            options={years}
            onChange={(e) => setSelectedYear(e.value)}
            placeholder="Chọn năm"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <Button
            label="Thống Kê"
            icon="pi pi-chart-line"
            iconPos="left"
            className="w-auto p-button-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg py-4 px-8 min-w-[150px]"
            onClick={handleFilter}
            disabled={loading}
          />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      ) : filteredData.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Doanh Thu Trong Tháng {selectedMonth}/{selectedYear}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <LineChart
              width={800}
              height={400}
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              className="mx-auto"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </div>
        </>
      ) : (
        <p className="text-gray-600">
          Chưa có dữ liệu cho tháng {selectedMonth}/{selectedYear}
        </p>
      )}
    </div>
  );
}
