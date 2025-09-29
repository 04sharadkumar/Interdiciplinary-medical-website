import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  FiClock,
  FiAlertTriangle,
  FiRefreshCw,
  FiPackage,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Dummy data
const expiryTrendData = [
  { month: "Jan", expiring: 5 },
  { month: "Feb", expiring: 9 },
  { month: "Mar", expiring: 7 },
  { month: "Apr", expiring: 12 },
  { month: "May", expiring: 4 },
  { month: "Jun", expiring: 10 },
];

const expiringSoon = [
  { id: 1, name: "Paracetamol 500mg", expiryDate: "2025-10-12", stock: 150 },
  { id: 2, name: "Amoxicillin 250mg", expiryDate: "2025-11-05", stock: 90 },
  { id: 3, name: "Cough Syrup 100ml", expiryDate: "2025-10-28", stock: 40 },
];

const lowStock = [
  { id: 1, name: "Insulin", stock: 12, unit: "vials" },
  { id: 2, name: "Digital Thermometer", stock: 5, unit: "pcs" },
  { id: 3, name: "Aspirin 100mg", stock: 8, unit: "strips" },
];

const suppliers = [
  { id: 1, name: "HealthTech Inc.", contact: "9876543210", status: "Active" },
  { id: 2, name: "MedSupply Co.", contact: "9123456780", status: "Active" },
  { id: 3, name: "PharmaLink", contact: "9991122334", status: "Inactive" },
];

const PharmacistDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Pharmacist Dashboard</h2>
        <p className="text-gray-600">
          Monitor expiry alerts, manage stock, and coordinate with suppliers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiClock className="text-orange-500" /> Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-500">Within next 30 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiAlertTriangle className="text-red-500" /> Expired Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-gray-500">Need urgent disposal</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiRefreshCw className="text-blue-500" /> Restock Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">6</p>
            <p className="text-sm text-gray-500">Items below threshold</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers className="text-green-500" /> Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">15</p>
            <p className="text-sm text-gray-500">Registered suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Trend */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Expiry Trend (Next 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={expiryTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="expiring"
                stroke="#f97316"
                fill="#fed7aa"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Expiring Soon List */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiClock className="text-orange-500" /> Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoon.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-orange-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Expiry: {item.expiryDate}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {item.stock} units
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock List */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiPackage className="text-red-500" /> Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Stock left</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    {item.stock} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Directory */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Supplier</th>
                <th className="py-2">Contact</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b">
                  <td className="py-2">{supplier.name}</td>
                  <td className="py-2">{supplier.contact}</td>
                  <td
                    className={`py-2 font-medium ${
                      supplier.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {supplier.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2">
            <FiRefreshCw /> Restock Now
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FiFileText /> Generate Expiry Report
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <FiUsers /> Contact Supplier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
