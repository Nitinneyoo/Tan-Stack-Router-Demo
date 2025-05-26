import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import AddRobotForm from "./addRobot";
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

export const Route = createFileRoute("/Fleet/")({
  component: FleetPage,
});

type Robot = {
  id: string;
  name: string;
  path: string;
  loadAvailable: string;
};

function FleetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [robots, setRobots] = useState<Robot[]>([]);

  const handleAddRobot = (robot: Robot) => {
    setRobots((prev) => [...prev, robot]);
    setIsModalOpen(false);
  };

  const handleDeleteRobot = (id: string) => {
    setRobots((prev) => prev.filter((robot) => robot.id !== id));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-2 bg-primary border-t-1 flex items-center justify-between text-xl font-bold shadow-lg">
        <Link to="/Fleet" className="text-text">
          Fleet
        </Link>
        <div className="text-sm font-normal">
          <Button
            variant="outline"
            className= "text-text hover:bg-blue-600 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Robot In Fleet
          </Button>
        </div>
      </header>

      {/* Robot List */}
      <div className="p-4 space-y-4 overflow-auto">
        {robots.length === 0 ? (
          <p className="text-gray-600">No robots added yet.</p>
        ) : (
          robots.map((robot) => (
            <div
              key={robot.id}
              className="border rounded-lg p-4 bg-white shadow-sm grid grid-cols-5 items-center gap-4"
            >
              <div>
                <strong>Name:</strong> {robot.name}
              </div>
              <div>
                <strong>ID:</strong> {robot.id}
              </div>
              <div>
                <strong>Path:</strong> {robot.path}
              </div>
              <div>
                <strong>Load:</strong> {robot.loadAvailable}
              </div>
              <AlertDialog>
                {/* Wrap the Button with AlertDialogTrigger */}
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the robot with ID {robot.id}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteRobot(robot.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg relative border border-gray-200">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-text"
            >
              ✕
            </Button>
            <h2 className="text-lg font-semibold mb-4">Add Robot to Fleet</h2>
            <AddRobotForm onSubmit={handleAddRobot} />
          </div>
        </div>
      )}
    </div>
  );
}
