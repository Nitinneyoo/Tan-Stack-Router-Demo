import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "../../components/ui/date-range-picker";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Robot {
  serialNumber: string;
  type: string;
  location: string;
  charge: number;
  status: "active" | "inactive" | "error";
  connectivity: "online" | "offline";
}

const Dashboard = () => {
  const [robots, setRobots] = useState<Robot[]>([
    {
      serialNumber: "ROB001",
      type: "Delivery",
      location: "Warehouse A",
      charge: 85,
      status: "active",
      connectivity: "online",
    },
    // Add more initial robots as needed
  ]);

  const stats = {
    active: robots.filter((r) => r.status === "active").length,
    inactive: robots.filter((r) => r.status === "inactive").length,
    error: robots.filter((r) => r.status === "error").length,
    total: robots.length,
  };


  const deleteRobot = (serialNumber: string) => {
    setRobots(robots.filter((robot) => robot.serialNumber !== serialNumber));
  };

  const [open, setOpen] = useState(false);
  const [newRobot, setNewRobot] = useState({
    type: "Delivery",
    location: "Warehouse A",
  });

  const handleAddRobot = () => {
    const robot: Robot = {
      serialNumber: `ROB${(robots.length + 1).toString().padStart(3, "0")}`,
      type: newRobot.type,
      location: newRobot.location,
      charge: 100,
      status: "inactive",
      connectivity: "offline",
    };
    setRobots([...robots, robot]);
    setOpen(false);
    // Reset form
    setNewRobot({ type: "Delivery", location: "Warehouse A" });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <DateRangePicker />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Robot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gray-900">Add New Robot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newRobot.type}
                  onValueChange={(value) =>
                    setNewRobot({ ...newRobot, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newRobot.location}
                  onValueChange={(value) =>
                    setNewRobot({ ...newRobot, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddRobot}
              >
                Add Robot
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Total Robots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stats.error}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 font-semibold">
                Serial Number
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Type
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Location
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Charge
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Connectivity
              </TableHead>
              <TableHead className="text-gray-900 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {robots.map((robot) => (
              <TableRow key={robot.serialNumber} className="hover:bg-gray-50">
                <TableCell className="text-gray-900">
                  {robot.serialNumber}
                </TableCell>
                <TableCell className="text-gray-900">{robot.type}</TableCell>
                <TableCell className="text-gray-900">
                  {robot.location}
                </TableCell>
                <TableCell className="text-gray-900">{robot.charge}%</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      robot.status === "active"
                        ? "bg-green-100 text-gray-900"
                        : robot.status === "inactive"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-red-100 text-gray-900"
                    }`}
                  >
                    {robot.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      robot.connectivity === "online"
                        ? "bg-green-100 text-gray-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {robot.connectivity}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded">
                      <MoreVertical className="h-5 w-5 text-gray-900" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-gray-900 cursor-pointer hover:bg-gray-100"
                        onClick={() => deleteRobot(robot.serialNumber)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

export default Dashboard;
