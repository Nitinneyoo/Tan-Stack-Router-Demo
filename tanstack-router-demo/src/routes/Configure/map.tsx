import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { Map, Wrench, Menu, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Map cell type
type CellType = "empty" | "workstation" | "obstacle";
type MapData = CellType[][];

// Initialize 10x10 map with empty cells
const INITIAL_MAP: MapData = Array(10)
  .fill(null)
  .map(() => Array(10).fill("empty"));

// Map cell component
const MapCell = ({
  type,
  onClick,
  isSelected,
}: {
  type: CellType;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const bgColor =
    type === "workstation"
      ? "bg-blue-500"
      : type === "obstacle"
        ? "bg-red-500"
        : "bg-gray-200";
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onClick}
      className={cn(
        "w-8 h-8 border border-gray-300 cursor-pointer",
        bgColor,
        isSelected && "border-2 border-blue-700"
      )}
    />
  );
};

export const Route = createFileRoute("/configure/map")({
  component: () => {
    const [mapData, setMapData] = useState<MapData>(INITIAL_MAP);
    const [selectedCell, setSelectedCell] = useState<{
      row: number;
      col: number;
    } | null>(null);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleCellClick = (row: number, col: number) => {
      setSelectedCell({ row, col });
      // Toggle cell type: empty -> workstation -> obstacle -> empty
      setMapData((prev) => {
        const newMap = prev.map((r) => [...r]);
        const currentType = newMap[row][col];
        newMap[row][col] =
          currentType === "empty"
            ? "workstation"
            : currentType === "workstation"
              ? "obstacle"
              : "empty";
        return newMap;
      });
    };

    const handleReset = () => {
      setMapData(INITIAL_MAP);
      setSelectedCell(null);
    };

    // Calculate summary
    const workstationCount = mapData
      .flat()
      .filter((cell) => cell === "workstation").length;
    const obstacleCount = mapData
      .flat()
      .filter((cell) => cell === "obstacle").length;
    const selectedCellType = selectedCell
      ? mapData[selectedCell.row][selectedCell.col]
      : "none";

    const navOptions = [
      {
        key: "automation",
        label: "Automation Settings",
        icon: <Wrench className="h-5 w-5 mr-2" />,
        path: "/Configure/Automation",
      },
      {
        key: "map",
        label: "Workspace Map",
        icon: <Map className="h-5 w-5 mr-2" />,
        path: "/Configure/Map",
      },
    ];

    return (
      <div className="min-h-screen bg-white text-black">
        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Navbar */}
          <nav
            className={cn(
              "fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-300 p-4 z-20",
              isNavbarOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Configuration</h2>
              <Button
                variant="ghost"
                className="md:hidden text-black hover:bg-gray-200"
                onClick={() => setIsNavbarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-2">
              {navOptions.map((option) => (
                <Link to={option.path} key={option.key}>
                  <Button
                    variant={
                      window.location.pathname === option.path
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "w-full justify-start text-sm font-bold",
                      window.location.pathname === option.path
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black border-gray-300 hover:bg-gray-200"
                    )}
                    onClick={() => setIsNavbarOpen(false)}
                  >
                    {option.icon}
                    {option.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Button
              variant="ghost"
              className="md:hidden mb-4 text-black hover:bg-gray-200"
              onClick={() => setIsNavbarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              {/* Map Header */}
              <div className="bg-white p-6 border border-gray-300 rounded-lg">
                <div className="flex items-center mb-4">
                  <Map className="h-6 w-6 text-black mr-2" />
                  <h3 className="text-lg font-bold text-black">
                    Workspace Map
                  </h3>
                </div>
                <p className="text-sm text-black">
                  Configure the workspace layout by clicking cells to toggle
                  between workstations, obstacles, or empty spaces.
                </p>
              </div>

              {/* Map Grid */}
              <div className="bg-white p-6 border border-gray-300 rounded-lg">
                <Label className="text-black font-bold text-sm mb-4 block">
                  Map Layout
                </Label>
                <div className="grid grid-cols-10 gap-1 w-fit">
                  {mapData.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <MapCell
                        key={`${rowIndex}-${colIndex}`}
                        type={cell}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        isSelected={
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === colIndex
                        }
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Summary Panel */}
              <div className="bg-white p-6 border border-gray-300 rounded-lg">
                <div className="flex items-center mb-4">
                  <Wrench className="h-6 w-6 text-black mr-2" />
                  <h3 className="text-lg font-bold text-black">Map Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
                  <p>Workstations: {workstationCount}</p>
                  <p>Obstacles: {obstacleCount}</p>
                  <p>
                    Selected Cell:{" "}
                    {selectedCell
                      ? `(${selectedCell.row}, ${selectedCell.col}) - ${selectedCellType}`
                      : "None"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleReset}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
