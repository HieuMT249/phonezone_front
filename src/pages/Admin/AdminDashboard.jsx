import Chart from "../../components/Admin/DashBoard/Chart";
import DashboardCard from "../../components/Admin/DashBoard/DashboardCard";

export default function AdminDashboard() {
  return (
    <>
      <DashboardCard />
      <div className="mt-4 flex justify-center">
        <Chart />
      </div>
    </>
  );
}
