import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import AddRobotForm from "./addRobot";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

type Robot = {
  id: string;
  type: string;
  location: string;
  charge: number;
  status: string;
  connectivity: string;
};

const columns = [
  {
    accessorKey: "id",
    header: "Serial Number",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "charge",
    header: "Charge",
    cell: ({ getValue }) => {
      const charge = getValue() as number;
      const chargeColor =
        charge <= 25 ? "bg-red-500" : charge <= 50 ? "bg-orange-500" : "bg-green-500";
      return (
        <div className="flex items-center">
          <div className={`h-2 w-16 rounded ${chargeColor}`} style={{ width: `${charge}%` }}></div>
          <span className="ml-2 text-black">{charge}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusColor =
        status === "ACTIVE"
          ? "bg-green-100 text-green-800"
          : status === "INACTIVE"
            ? "bg-orange-100 text-orange-800"
            : "bg-red-100 text-red-800";
      return <span className={`px-2 py-1 rounded ${statusColor}`}>{status}</span>;
    },
  },
  {
    accessorKey: "connectivity",
    header: "Connectivity",
    cell: ({ getValue }) => {
      const connectivity = getValue() as string;
      return (
        <span className="flex items-center">
          {connectivity === "Connected" ? (
            <span className="text-green-500">📶 Connected</span>
          ) : (
            <span className="text-red-500">📴 Disconnected</span>
          )}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const robot = row.original;
      const handleDeleteRobot = table.options.meta?.handleDeleteRobot;

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-black">...</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Robot Options</AlertDialogTitle>
              <AlertDialogDescription>
                Choose an action for the robot with ID {robot.id}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteRobot && handleDeleteRobot(robot.id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

function RobotHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [robots, setRobots] = useState<Robot[]>([
    { id: "TRI00251", type: "Tugger", location: "WAYPOINT 1", charge: 50, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00252", type: "Tugger", location: "Calling Station 1", charge: 25, status: "INACTIVE", connectivity: "Connected" },
    { id: "TRI00253", type: "Tugger", location: "TRI00253", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00254", type: "Tugger", location: "WAYPOINT 12", charge: 100, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00255", type: "Tugger", location: "Calling Station 12", charge: 25, status: "INACTIVE", connectivity: "Disconnected" },
    { id: "TRI00256", type: "Tugger", location: "WAYPOINT 13", charge: 100, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00257", type: "Tugger", location: "TRI00257", charge: 100, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00258", type: "Tugger", location: "WAYPOINT 4", charge: 100, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00259", type: "Tugger", location: "TRI00259", charge: 50, status: "ERROR", connectivity: "Disconnected" },
    { id: "TRI00260", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00261", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00262", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00263", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00264", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00265", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00266", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00267", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00268", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00269", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00270", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00271", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00272", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00273", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00274", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
    { id: "TRI00275", type: "Tugger", location: "Calling Station 12", charge: 80, status: "ACTIVE", connectivity: "Connected" },
  ]);

  const totalRobots = robots.length;
  const activeRobots = robots.filter(r => r.status === "ACTIVE").length;
  const inactiveRobots = robots.filter(r => r.status === "INACTIVE").length;
  const errorRobots = robots.filter(r => r.status === "ERROR").length;

  const handleAddRobot = (robot: { id: string; name: string; path: string; loadAvailable: string }) => {
    const newRobot: Robot = {
      id: robot.id,
      type: robot.name,
      location: robot.path,
      charge: Number(robot.loadAvailable.replace(/[^0-9]/g, "")) || 100,
      status: "ACTIVE",
      connectivity: "Connected",
    };
    setRobots((prev) => [...prev, newRobot]);
    setIsModalOpen(false);
  };

  const handleDeleteRobot = (id: string) => {
    setRobots((prev) => prev.filter((robot) => robot.id !== id));
  };

  const table = useReactTable({
    data: robots,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    meta: {
      handleDeleteRobot,
    },
  });

  const robotsPerPage = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const firstIndex = (currentPage - 1) * robotsPerPage + 1;
  const lastIndex = Math.min(currentPage * robotsPerPage, robots.length);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">Robot Home</h1>
          <Button
            className="bg-blue-900 text-white hover:bg-blue-800"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Robot
          </Button>
        </header>

        {/* Stats */}
        <div className="flex space-x-4 mt-4">
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs text-black">Total Robots</p>
            <p className="text-lg font-bold text-black">{totalRobots}</p>
          </div>
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs text-black">Active</p>
            <p className="text-lg font-bold text-black">{activeRobots}</p>
          </div>
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs text-black">Inactive</p>
            <p className="text-lg font-bold text-black">{inactiveRobots}</p>
          </div>
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs text-black">Error</p>
            <p className="text-lg font-bold text-black">{errorRobots}</p>
          </div>
        </div>
      </div>

      {/* Table and Pagination Container */}
      <div className="flex flex-col">
        {/* Table Container */}
        <div className="border rounded-lg bg-white shadow-sm">
          <div className="relative">
            {/* Table with Fixed Header and Scrollable Body */}
            <div className="overflow-auto max-h-[680px] min-h-[680px]">
              <table className="w-full">
                <ScrollArea className="h-[650px] w-full">
                  <thead className="sticky top-0 bg-gray-50 border-b z-10">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id} className="text-black">
                        {headerGroup.headers.map(header => (
                          <th key={header.id} className="p-3 text-left text-xs font-medium uppercase tracking-wider">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                      <tr key={row.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="p-3 text-xs text-black">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </ScrollArea>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="mt-2">
          <div className="flex justify-between items-center py-3 px-4 bg-white border rounded-lg text-xs text-black shadow-sm">
            <div className="flex items-center space-x-2">
              <span>Row per page:</span>
              <select
                value={robotsPerPage}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1 text-xs text-black"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span>
                {firstIndex}-{lastIndex} of {robots.length}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black"
                >
                  {"<"}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black"
                >
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg relative border border-gray-200">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </Button>
            <h2 className="text-lg font-semibold mb-4 text-black">Add Robot to Fleet</h2>
            <AddRobotForm onSubmit={handleAddRobot} />
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/dashboard/")({
  component: RobotHome,
});