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
      ? "bg-background-500"
      : type === "obstacle"
        ? "bg-red-500"
        : "text-foreground-200";
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

export const Route = createFileRoute("/Configure/map")({
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
      <div className="min-h-screen bg-background text-foreground">
        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Navbar */}
          <nav
            className={cn(
              "fixed md:static top-0 left-0 h-full w-64 bg-background border-r border-gray-300 p-4 z-0",
              isNavbarOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Configuration</h2>
              <Button
                variant="ghost"
                className="md:hidden text-foreground hover:text-foreground-200"
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
                        ? "bg-background-500 text-foreground"
                        : "bg-background text-foreground border-gray-300 hover:text-foreground-200"
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
              className="md:hidden mb-4 text-foreground hover:text-foreground-200"
              onClick={() => setIsNavbarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              {/* Map Header */}
              <div className="bg-background p-6 border border-gray-300 rounded-lg">
                <div className="flex items-center mb-4">
                  <Map className="h-6 w-6 text-foreground mr-2" />
                  <h3 className="text-lg font-bold text-foreground">
                    Workspace Map
                  </h3>
                </div>
                <p className="text-sm text-foreground">
                  Configure the workspace layout by clicking cells to toggle
                  between workstations, obstacles, or empty spaces.
                </p>
              </div>

              {/* Map Grid */}
              <div className="bg-background p-6 border border-gray-300 rounded-lg">
                <Label className="text-foreground font-bold text-sm mb-4 block">
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
              <div className="bg-background p-6 border border-gray-300 rounded-lg">
                <div className="flex items-center mb-4">
                  <Wrench className="h-6 w-6 text-foreground mr-2" />
                  <h3 className="text-lg font-bold text-foreground">Map Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground">
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
                  className="bg-background-500 hover:bg-background-600 text-foreground py-3 px-6 rounded-lg"
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
