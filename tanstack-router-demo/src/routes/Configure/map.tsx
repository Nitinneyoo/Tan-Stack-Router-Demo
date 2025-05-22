import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Map, Wrench, Menu, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Animation variants
const navbarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
      ? "bg-blue-500/80"
      : type === "obstacle"
        ? "bg-red-500/80"
        : "bg-navy-700/50";
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onClick}
      className={cn(
        "w-8 h-8 border border-blue-500/20 cursor-pointer transition-all duration-200",
        bgColor,
        isSelected && "shadow-[0_0_10px_rgba(59,130,246,0.9)] scale-110 z-10",
        "hover:shadow-[0_0_8px_rgba(59,130,246,0.7)] hover:scale-105"
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
        path: "/configure/automation",
      },
      {
        key: "map",
        label: "Workspace Map",
        icon: <Map className="h-5 w-5 mr-2" />,
        path: "/configure/map",
      },
    ];

    return (
      <div className="min-h-screen bg-navy-900 text-gray-200 relative overflow-hidden">
        {/* Dashboard Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, transparent 70%),
              linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px) 0 0/20px 20px,
              linear-gradient(0deg, rgba(59,130,246,0.05) 1px, transparent 1px) 0 0/20px 20px
            `,
          }}
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 10% 20%, rgba(59,130,246,0.3) 2px, transparent 2px),
              radial-gradient(circle at 80% 30%, rgba(59,130,246,0.3) 2px, transparent 2px),
              radial-gradient(circle at 40% 70%, rgba(59,130,246,0.3) 2px, transparent 2px)
            `,
            animation: "pulse 6s infinite",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/50 to-navy-900/50 z-0" />

        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Navbar */}
          <motion.nav
            variants={navbarVariants}
            initial="hidden"
            animate={
              isNavbarOpen || window.innerWidth >= 768 ? "visible" : "hidden"
            }
            className={cn(
              "fixed md:static top-0 left-0 h-full w-64 bg-navy-800/90 p-4 shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20",
              isNavbarOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-sans font-extrabold tracking-tight text-blue-400">
                Configuration
              </h2>
              <Button
                variant="ghost"
                className="md:hidden text-blue-400 hover:bg-navy-700"
                onClick={() => setIsNavbarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-2">
              {navOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={
                    window.location.pathname === option.path
                      ? "default"
                      : "outline"
                  }
                  className={cn(
                    "w-full justify-start text-sm font-sans font-extrabold tracking-tight",
                    window.location.pathname === option.path
                      ? "bg-blue-500 text-white"
                      : "bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                  )}
                  onClick={() => {
                    setIsNavbarOpen(false);
                    window.location.href = option.path; // Replace with Tanstack Router's Link in production
                  }}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </motion.nav>

          {/* Main Content */}
          <div className="flex-1 p-6 z-10">
            <Button
              variant="ghost"
              className="md:hidden mb-4 text-blue-400 hover:bg-navy-700"
              onClick={() => setIsNavbarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto flex flex-col gap-6"
            >
              {/* Map Header */}
              <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.7)]">
                <div className="flex items-center mb-4">
                  <Map className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-400">
                    Workspace Map
                  </h3>
                </div>
                <p className="text-sm text-blue-300 font-sans font-extrabold tracking-tight">
                  configure the workspace layout by clicking cells to toggle
                  between workstations, obstacles, or empty spaces.
                </p>
              </div>

              {/* Map Grid */}
              <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.7)]">
                <Label className="text-blue-300 font-sans font-extrabold tracking-tight text-sm mb-4 block">
                  Map Layout
                </Label>
                <div className="grid grid-cols-10 gap-1 w-fit">
                  {mapData.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <MapCell
                        key={`${rowIndex}-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          colIndex
                        }`}
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
              <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.7)]">
                <div className="flex items-center mb-4">
                  <Wrench className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-400">
                    Map Summary
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-300 font-sans font-extrabold tracking-tight">
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
                  className="bg-navy-700 hover:bg-navy-800 text-blue-300 py-3 px-6 rounded-md font-sans font-extrabold tracking-tight shadow-[0_0_12px_rgba(59,130,246,0.7)] hover:shadow-[0_0_18px_rgba(59,130,246,0.9)] hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset Map
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CSS for Dashboard Animation */}
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.2); }
              100% { opacity: 0.3; transform: scale(1); }
            }
          `}
        </style>
      </div>
    );
  },
});
