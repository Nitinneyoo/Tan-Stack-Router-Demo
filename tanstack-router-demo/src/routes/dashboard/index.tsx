import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
// import ReactPaginate from "react-paginate";
import { createFileRoute } from "@tanstack/react-router";

// Sample data (replace with API fetch in a real application)
const sampleRobots = [
  {
    serialNumber: "TR100250",
    type: "Delivery",
    location: "Warehouse A",
    charge: 50,
    status: "ACTIVE",
    connectivity: "Connected",
  },
  {
    serialNumber: "TR100251",
    type: "Maintenance",
    location: "Warehouse B",
    charge: 25,
    status: "INACTIVE",
    connectivity: "Connected",
  },
  {
    serialNumber: "TR100252",
    type: "Security",
    location: "Production",
    charge: 75,
    status: "ACTIVE",
    connectivity: "Disconnected",
  },
  // Add more sample data as needed
];

const RobotHome = () => {
  const [open, setOpen] = useState(false);
  const [newRobot, setNewRobot] = useState({ type: "", location: "" });
  const [allRobots, setAllRobots] = useState(sampleRobots);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const handleAddRobot = () => {
    console.log("Adding new robot:", newRobot);
    setNewRobot({ type: "", location: "" });
    setOpen(false);
  };

  // Compute filtered robots
  const filteredRobots = allRobots.filter((robot) => {
    const matchesSearch =
      searchTerm === "" ||
      robot.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || robot.type === selectedType;
    const matchesLocation =
      selectedLocation === "All" || robot.location === selectedLocation;
    const matchesStatus =
      selectedStatus === "All" || robot.status === selectedStatus;
    return matchesSearch && matchesType && matchesLocation && matchesStatus;
  });

  // Compute pagination
  const totalPages = Math.ceil(filteredRobots.length / rowsPerPage);
  const indexOfLastRobot = currentPage * rowsPerPage;
  const indexOfFirstRobot = indexOfLastRobot - rowsPerPage;
  const displayedRobots = filteredRobots.slice(
    indexOfFirstRobot,
    indexOfLastRobot
  );

  // Reset current page when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedLocation, selectedStatus]);

  // Handle page change
  

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

      {/* Search and Filters */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search robots"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-grow rounded-md text-gray-900!"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40 text-gray-900">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Delivery">Delivery</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-40 text-gray-900">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Warehouse A">Warehouse A</SelectItem>
            <SelectItem value="Warehouse B">Warehouse B</SelectItem>
            <SelectItem value="Production">Production</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40 text-gray-900">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            <SelectItem value="ERROR">ERROR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Robot Table */}
      <div className="mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Connectivity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRobots.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No robots found
                </td>
              </tr>
            ) : (
              displayedRobots.map((robot) => (
                <tr key={robot.serialNumber}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm">
                    {robot.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm">{robot.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-sm">
                    {robot.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full text-sm"
                        style={{ width: `${robot.charge}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-serif">
                    <span
                      className={
                        robot.status === "ACTIVE"
                          ? "text-green-500"
                          : robot.status === "INACTIVE"
                            ? "text-orange-500"
                            : "text-red-500"
                      }
                    >
                      {robot.status}  
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        robot.connectivity === "Connected"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {robot.connectivity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
     
    </div>
  );
}
export const Route = createFileRoute('/dashboard/')({
  component: RobotHome,
});

export default RobotHome ;
