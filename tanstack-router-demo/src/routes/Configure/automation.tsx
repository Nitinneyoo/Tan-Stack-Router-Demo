import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Cpu, Save, RefreshCw, Gauge, AlertOctagon, BatteryCharging, Wrench, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Zod schema for validation
const automationSchema = z.object({
  workflowMode: z.enum(["Fully Automated", "Semi-Automated", "Operator-Assisted"], {
    errorMap: () => ({ message: "Select a workflow mode" }),
  }),
  sensorSensitivity: z.enum(["High", "Medium", "Low"], {
    errorMap: () => ({ message: "Select a sensor sensitivity" }),
  }),
  errorHandlingMode: z.enum(["Auto-Recover", "Pause and Alert", "Manual Intervention"], {
    errorMap: () => ({ message: "Select an error handling mode" }),
  }),
  powerOptimization: z.enum(["Max Efficiency", "Balanced", "High Performance"], {
    errorMap: () => ({ message: "Select a power optimization mode" }),
  }),
  movementPrecision: z.number().min(0.1, "Precision must be at least 0.1 mm").max(5, "Precision cannot exceed 5 mm"),
  taskPriority: z.array(z.string()).min(1, "At least one task is required"),
});

type AutomationData = z.infer<typeof automationSchema>;
type FormErrors = Partial<Record<keyof AutomationData, string>>;

// Default settings
const DEFAULT_CONFIG: AutomationData = {
  workflowMode: "Fully Automated",
  sensorSensitivity: "Medium",
  errorHandlingMode: "Pause and Alert",
  powerOptimization: "Balanced",
  movementPrecision: 1.0,
  taskPriority: ["Assembly", "Quality Check", "Material Handling"],
};

// Animation variants
const navbarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Sortable task item component
const SortableTask = ({ id, task }: { id: string; task: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center px-4 py-2 bg-navy-800/80 border border-blue-500/80 rounded-md text-blue-300 text-sm font-sans font-extrabold tracking-tight cursor-move hover:shadow-[0_0_12px_rgba(34,197,94,0.8)] hover:scale-105 transition-all duration-200"
    >
      {task}
    </div>
  );
};

export const Route = createFileRoute("/Configure/automation")({
  component: () => {
    const [configData, setConfigData] = useState<AutomationData>(DEFAULT_CONFIG);
    const [errors, setErrors] = useState<FormErrors>({});
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [activeSetting, setActiveSetting] = useState<keyof AutomationData | null>("workflowMode");
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    // Dnd-kit sensors
    const sensors = useSensors(useSensor(PointerSensor));

    const handleChange = (name: keyof AutomationData, value: any) => {
      if (value !== undefined && value !== null) {
        setConfigData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setMessage(null);
      }
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = configData.taskPriority.findIndex((task) => task === active.id);
        const newIndex = configData.taskPriority.findIndex((task) => task === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newPriority = [...configData.taskPriority];
          newPriority.splice(oldIndex, 1);
          newPriority.splice(newIndex, 0, active.id as string);
          handleChange("taskPriority", newPriority);
        }
      }
    };

    const handleSave = () => {
      try {
        automationSchema.parse(configData);
        setMessage({ type: "success", text: "Settings validated successfully!" });
        setErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: FormErrors = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof AutomationData] = err.message;
            }
          });
          setErrors(newErrors);
          setMessage({ type: "error", text: "Please fix the errors before saving." });
        } else {
          setMessage({ type: "error", text: "An error occurred. Please try again." });
        }
      }
    };

    const handleReset = () => {
      setConfigData(DEFAULT_CONFIG);
      setErrors({});
      setMessage({ type: "success", text: "Settings reset to default." });
    };

    const settingsOptions: { key: keyof AutomationData; label: string; icon: React.ReactNode }[] = [
      { key: "workflowMode", label: "Workflow Mode", icon: <Cpu className="h-5 w-5 mr-2" /> },
      { key: "sensorSensitivity", label: "Sensor Sensitivity", icon: <Gauge className="h-5 w-5 mr-2" /> },
      { key: "errorHandlingMode", label: "Error Handling", icon: <AlertOctagon className="h-5 w-5 mr-2" /> },
      { key: "powerOptimization", label: "Power Optimization", icon: <BatteryCharging className="h-5 w-5 mr-2" /> },
      { key: "movementPrecision", label: "Movement Precision", icon: <Wrench className="h-5 w-5 mr-2" /> },
      { key: "taskPriority", label: "Task Priority", icon: <Wrench className="h-5 w-5 mr-2" /> },
    ];

    return (
      <div className="min-h-screen bg-navy-900 text-gray-200 relative overflow-hidden">
        {/* Dashboard Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at center, rgba(34,197,94,0.15) 0%, transparent 70%),
              linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px) 0 0/20px 20px,
              linear-gradient(0deg, rgba(34,197,94,0.05) 1px, transparent 1px) 0 0/20px 20px
            `,
          }}
        />
        {/* Glowing Nodes */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 10% 20%, rgba(34,197,94,0.3) 2px, transparent 2px),
              radial-gradient(circle at 80% 30%, rgba(34,197,94,0.3) 2px, transparent 2px),
              radial-gradient(circle at 40% 70%, rgba(34,197,94,0.3) 2px, transparent 2px)
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
            animate={isNavbarOpen || window.innerWidth >= 768 ? "visible" : "hidden"}
            className={cn(
              "fixed md:static top-0 left-0 h-full w-64 bg-navy-800/90 p-4 shadow-[0_0_20px_rgba(34,197,94,0.6)] z-20",
              isNavbarOpen ? "block" : "hidden md:block"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-sans font-extrabold tracking-tight text-blue-800">Automation Dashboard</h2>
              <Button
                variant="ghost"
                className="md:hidden text-blue-800 hover:bg-navy-700"
                onClick={() => setIsNavbarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-2">
              {settingsOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={activeSetting === option.key ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start text-sm font-sans font-extrabold tracking-tight",
                    activeSetting === option.key
                      ? "bg-blue-500 text-white"
                      : "bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                  )}
                  onClick={() => {
                    setActiveSetting(option.key);
                    setIsNavbarOpen(false);
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
              className="md:hidden mb-4 text-blue-800 hover:bg-navy-700"
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
              {/* Setting Controls */}
              {activeSetting === "workflowMode" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <Cpu className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Workflow Mode</h3>
                  </div>
                  <div className="flex gap-2">
                    {["Fully Automated", "Semi-Automated", "Operator-Assisted"].map((mode) => (
                      <Button
                        key={mode}
                        variant={configData.workflowMode === mode ? "default" : "outline"}
                        className={cn(
                          "flex-1 py-2 text-sm font-sans font-extrabold tracking-tight",
                          configData.workflowMode === mode
                            ? "bg-blue-500 text-white"
                            : "bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                        )}
                        onClick={() => handleChange("workflowMode", mode)}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                  {errors.workflowMode && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.workflowMode}
                    </motion.p>
                  )}
                </div>
              )}

              {activeSetting === "sensorSensitivity" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <Gauge className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Sensor Sensitivity</h3>
                  </div>
                  <Slider
                    value={[["Low", "Medium", "High"].indexOf(configData.sensorSensitivity) * 50]}
                    onValueChange={([value]) => {
                      const sensitivity = ["Low", "Medium", "High"][Math.round(value / 50)];
                      handleChange("sensorSensitivity", sensitivity);
                    }}
                    min={0}
                    max={100}
                    step={50}
                    className="mt-2"
                  />
                  <p className="mt-1 text-xs text-blue-300 font-sans font-extrabold tracking-tight">
                    Current: {configData.sensorSensitivity}
                  </p>
                  {errors.sensorSensitivity && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.sensorSensitivity}
                    </motion.p>
                  )}
                </div>
              )}

              {activeSetting === "errorHandlingMode" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <AlertOctagon className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Error Handling Mode</h3>
                  </div>
                  <div className="flex gap-2">
                    {["Auto-Recover", "Pause and Alert", "Manual Intervention"].map((mode) => (
                      <Button
                        key={mode}
                        variant={configData.errorHandlingMode === mode ? "default" : "outline"}
                        className={cn(
                          "flex-1 py-2 text-sm font-sans font-extrabold tracking-tight",
                          configData.errorHandlingMode === mode
                            ? "bg-blue-500 text-white"
                            : "bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                        )}
                        onClick={() => handleChange("errorHandlingMode", mode)}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                  {errors.errorHandlingMode && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.errorHandlingMode}
                    </motion.p>
                  )}
                </div>
              )}

              {activeSetting === "powerOptimization" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <BatteryCharging className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Power Optimization</h3>
                  </div>
                  <div className="flex gap-2">
                    {["Max Efficiency", "Balanced", "High Performance"].map((mode) => (
                      <Button
                        key={mode}
                        variant={configData.powerOptimization === mode ? "default" : "outline"}
                        className={cn(
                          "flex-1 py-2 text-sm font-sans font-extrabold tracking-tight",
                          configData.powerOptimization === mode
                            ? "bg-blue-500 text-white"
                            : "bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                        )}
                        onClick={() => handleChange("powerOptimization", mode)}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                  {errors.powerOptimization && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.powerOptimization}
                    </motion.p>
                  )}
                </div>
              )}

              {activeSetting === "movementPrecision" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <Wrench className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Movement Precision (mm)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                      onClick={() => handleChange("movementPrecision", Math.max(0.1, configData.movementPrecision - 0.1))}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      value={configData.movementPrecision.toFixed(1)}
                      onChange={(e) => handleChange("movementPrecision", parseFloat(e.target.value))}
                      min={0.1}
                      max={5}
                      step={0.1}
                      className="w-16 bg-navy-800/80 text-blue-300 border border-blue-500/80 rounded-md text-center text-sm font-sans font-extrabold tracking-tight"
                    />
                    <Button
                      variant="outline"
                      className="bg-navy-700/80 text-blue-300 border-blue-500/80 hover:bg-blue-500/30 hover:scale-105"
                      onClick={() => handleChange("movementPrecision", Math.min(5, configData.movementPrecision + 0.1))}
                    >
                      +
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-blue-300 font-sans font-extrabold tracking-tight">
                    Current: {configData.movementPrecision.toFixed(1)} mm
                  </p>
                  {errors.movementPrecision && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.movementPrecision}
                    </motion.p>
                  )}
                </div>
              )}

              {activeSetting === "taskPriority" && (
                <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                  <div className="flex items-center mb-4">
                    <Wrench className="h-6 w-6 text-blue-800 mr-2" />
                    <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Task Priority</h3>
                  </div>
                  <div className="w-full max-w-xs flex gap-2">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={configData.taskPriority} strategy={horizontalListSortingStrategy}>
                        {configData.taskPriority.length > 0 ? (
                          configData.taskPriority.map((task) => (
                            <SortableTask key={task} id={task} task={task} />
                          ))
                        ) : (
                          <p className="text-xs text-red-500 font-sans font-extrabold tracking-tight">
                            No tasks available
                          </p>
                        )}
                      </SortableContext>
                    </DndContext>
                  </div>
                  {errors.taskPriority && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-2 text-xs text-red-500 font-sans font-extrabold tracking-tight"
                    >
                      {errors.taskPriority}
                    </motion.p>
                  )}
                </div>
              )}

              {/* Summary Panel */}
              <div className="bg-navy-800/90 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.7)]">
                <div className="flex items-center mb-4">
                  <Wrench className="h-6 w-6 text-blue-800 mr-2" />
                  <h3 className="text-lg font-sans font-extrabold tracking-tight text-blue-800">Configuration Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-300 font-sans font-extrabold tracking-tight">
                  <p>Workflow Mode: {configData.workflowMode}</p>
                  <p>Sensor Sensitivity: {configData.sensorSensitivity}</p>
                  <p>Error Handling: {configData.errorHandlingMode}</p>
                  <p>Power Optimization: {configData.powerOptimization}</p>
                  <p>Movement Precision: {configData.movementPrecision.toFixed(1)} mm</p>
                  <p>Task Priority: {configData.taskPriority.join(" > ")}</p>
                </div>
                {message && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "mt-4 text-sm text-center font-sans font-extrabold tracking-tight",
                      message.type === "success" ? "text-blue-800" : "text-red-500"
                    )}
                  >
                    {message.text}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-sans font-extrabold tracking-tight shadow-[0_0_12px_rgba(34,197,94,0.7)] hover:shadow-[0_0_18px_rgba(34,197,94,0.9)] hover:scale-105 transition-all duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Validate
                </Button>
                <Button
                  onClick={handleReset}
                  className="bg-navy-700 hover:bg-navy-800 text-blue-300 py-3 px-6 rounded-md font-sans font-extrabold tracking-tight shadow-[0_0_12px_rgba(34,197,94,0.7)] hover:shadow-[0_0_18px_rgba(34,197,94,0.9)] hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
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