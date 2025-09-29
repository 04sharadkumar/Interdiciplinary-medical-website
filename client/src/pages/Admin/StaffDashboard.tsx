import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FiBox, FiTrendingUp, FiEdit, FiClock, FiAlertTriangle, FiPlusCircle, FiFileText } from "react-icons/fi";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const usageData = [
  { day: "Mon", dispensed: 120 },
  { day: "Tue", dispensed: 98 },
  { day: "Wed", dispensed: 150 },
  { day: "Thu", dispensed: 80 },
  { day: "Fri", dispensed: 200 },
  { day: "Sat", dispensed: 130 },
  { day: "Sun", dispensed: 170 },
];

const StaffDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Staff Dashboard</h2>
        <p className="text-gray-600">Track daily medicine usage and manage hospital stock efficiently.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiBox className="text-blue-500" /> Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,245</p>
            <p className="text-sm text-gray-500">Total items in inventory</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiTrendingUp className="text-green-500" /> Used Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">312</p>
            <p className="text-sm text-gray-500">Medicines dispensed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiClock className="text-orange-500" /> Pending Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-gray-500">Stock updates required</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiAlertTriangle className="text-red-500" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
            <p className="text-sm text-gray-500">Items running low</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dispensed" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2">
            <FiEdit /> Update Stock
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FiPlusCircle /> Add New Item
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <FiFileText /> Generate Report
          </Button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Time</th>
                <th className="py-2">Action</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">09:30 AM</td>
                <td className="py-2">20 Paracetamol added to stock</td>
                <td className="py-2 text-green-600">Completed</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">11:15 AM</td>
                <td className="py-2">15 Antibiotics dispensed to Ward-3</td>
                <td className="py-2 text-green-600">Completed</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">01:45 PM</td>
                <td className="py-2">Stock update pending for IV fluids</td>
                <td className="py-2 text-orange-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
