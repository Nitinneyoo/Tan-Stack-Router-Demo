import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Save,
  RefreshCw,
  Clock,
  Shield,
  Battery,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Zod schema for form validation
const configSchema = z.object({
  operationMode: z.enum(["Autonomous", "Manual", "Hybrid"], {
    errorMap: () => ({ message: "Please select an operation mode" }),
  }),
  taskSchedulingMode: z.enum(["Balanced", "Priority", "Sequential"], {
    errorMap: () => ({ message: "Please select a task scheduling mode" }),
  }),
  safetyProtocolMode: z.enum(["Standard", "Enhanced", "Minimal"], {
    errorMap: () => ({ message: "Please select a safety protocol mode" }),
  }),
  energySavingMode: z.enum(["Eco", "Performance", "Balanced"], {
    errorMap: () => ({ message: "Please select an energy saving mode" }),
  }),
  speedLimit: z
    .number()
    .min(0.5, "Speed must be at least 0.5 m/s")
    .max(5, "Speed cannot exceed 5 m/s"),
  taskPriority: z.array(z.string()).min(1, "At least one task is required"),
});

type ConfigData = z.infer<typeof configSchema>;
type FormErrors = Partial<Record<keyof ConfigData, string>>;

// Default settings
const DEFAULT_CONFIG: ConfigData = {
  operationMode: "Autonomous",
  taskSchedulingMode: "Balanced",
  safetyProtocolMode: "Standard",
  energySavingMode: "Balanced",
  speedLimit: 2.5,
  taskPriority: ["Delivery", "Inspection", "Maintenance"],
};

// Sortable task item component
const SortableTask = ({ id, task }: { id: string; task: task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
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
      className="flex items-center p-3 bg-background border border-gray-300 rounded-lg mb-2 cursor-move"
    >
      <span className="text-foreground">{task}</span>
    </div>
  );
};

export const Route = createFileRoute("/Configure/Index")({
  component: () => {
    const [configData, setConfigData] = useState<ConfigData>(() => {
      const saved = localStorage.getItem("fleetConfig");
      try {
        return saved && saved !== "undefined"
          ? JSON.parse(saved)
          : DEFAULT_CONFIG;
      } catch (error) {
        console.error("Failed to parse localStorage fleetConfig:", error);
        return DEFAULT_CONFIG;
      }
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [message, setMessage] = useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

    // Debug state changes
    useEffect(() => {
      console.log("configData updated:", configData);
    }, [configData]);

    // Dnd-kit sensors
    const sensors = useSensors(useSensor(PointerSensor));

    const handleChange = (name: keyof ConfigData, value: any) => {
      console.log(`handleChange: ${name} =`, value);
      setConfigData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setMessage(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
      console.log("handleDragEnd:", event);
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = configData.taskPriority.findIndex(
          (task) => task === active.id
        );
        const newIndex = configData.taskPriority.findIndex(
          (task) => task === over.id
        );
        console.log("Reordering:", {
          oldIndex,
          newIndex,
          taskPriority: configData.taskPriority,
        });
        const newPriority = [...configData.taskPriority];
        newPriority.splice(oldIndex, 1);
        newPriority.splice(newIndex, 0, active.id as string);
        handleChange("taskPriority", newPriority);
      }
    };

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("handleSave: configData =", configData);
      try {
        const parsed = configSchema.parse(configData);
        console.log("Parsed data:", parsed);
        localStorage.setItem("fleetConfig", JSON.stringify(configData));
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setErrors({});
      } catch (error) {
        console.error("Validation error:", error);
        if (error instanceof z.ZodError) {
          const newErrors: FormErrors = {};
          // biome-ignore lint/complexity/noForEach: <explanation>
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof ConfigData] = err.message;
            }
          });
          setErrors(newErrors);
          setMessage({
            type: "error",
            text: "Please fix the errors before saving.",
          });
        } else {
          setMessage({
            type: "error",
            text: "An error occurred. Please try again.",
          });
        }
      }
    };

    const handleReset = () => {
      console.log("handleReset: Resetting to default");
      setConfigData(DEFAULT_CONFIG);
      localStorage.setItem("fleetConfig", JSON.stringify(DEFAULT_CONFIG));
      setErrors({});
      setMessage({ type: "success", text: "Settings reset to default." });
    };

    return (
      <div className="min-h-screen bg-background text-foreground p-0">
        <main className=" w-full h-full">
          <div className="bg-background p-8 border border-gray-300">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Operation Mode */}
              <div>
                <Label
                  htmlFor="operationMode"
                  className="text-foreground font-semibold text-lg"
                >
                  Operation Mode
                </Label>
                <div className="mt-2 relative">
                  <Select
                    value={configData.operationMode}
                    onValueChange={(value) => {
                      console.log("Operation Mode selected:", value);
                      handleChange("operationMode", value);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.operationMode && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Autonomous">Autonomous</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Settings
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                {errors.operationMode && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.operationMode}
                  </p>
                )}
              </div>

              {/* Task Scheduling Mode */}
              <div>
                <Label
                  htmlFor="taskSchedulingMode"
                  className="text-foreground font-semibold text-lg"
                >
                  Task Scheduling Mode
                </Label>
                <div className="mt-2 relative">
                  <Select
                    value={configData.taskSchedulingMode}
                    onValueChange={(value) => {
                      console.log("Task Scheduling Mode selected:", value);
                      handleChange("taskSchedulingMode", value);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.taskSchedulingMode && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Balanced">
                        Balanced (Even workload)
                      </SelectItem>
                      <SelectItem value="Priority">
                        Priority (High-priority first)
                      </SelectItem>
                      <SelectItem value="Sequential">
                        Sequential (Strict order)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Clock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                {errors.taskSchedulingMode && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.taskSchedulingMode}
                  </p>
                )}
              </div>

              {/* Safety Protocol Mode */}
              <div>
                <Label
                  htmlFor="safetyProtocolMode"
                  className="text-foreground font-semibold text-lg"
                >
                  Safety Protocol Mode
                </Label>
                <div className="mt-2 relative">
                  <Select
                    value={configData.safetyProtocolMode}
                    onValueChange={(value) => {
                      console.log("Safety Protocol Mode selected:", value);
                      handleChange("safetyProtocolMode", value);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.safetyProtocolMode && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">
                        Standard (Normal safety)
                      </SelectItem>
                      <SelectItem value="Enhanced">
                        Enhanced (Stricter safety)
                      </SelectItem>
                      <SelectItem value="Minimal">
                        Minimal (Open spaces)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Shield
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                {errors.safetyProtocolMode && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.safetyProtocolMode}
                  </p>
                )}
              </div>

              {/* Energy Saving Mode */}
              <div>
                <Label
                  htmlFor="energySavingMode"
                  className="text-foreground font-semibold text-lg"
                >
                  Energy Saving Mode
                </Label>
                <div className="mt-2 relative">
                  <Select
                    value={configData.energySavingMode}
                    onValueChange={(value) => {
                      console.log("Energy Saving Mode selected:", value);
                      handleChange("energySavingMode", value);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.energySavingMode && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eco">
                        Eco (Max battery life)
                      </SelectItem>
                      <SelectItem value="Performance">
                        Performance (Max speed)
                      </SelectItem>
                      <SelectItem value="Balanced">
                        Balanced (Moderate energy)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Battery
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                {errors.energySavingMode && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.energySavingMode}
                  </p>
                )}
              </div>

              {/* Speed Limit */}
              <div>
                <Label
                  htmlFor="speedLimit"
                  className="text-foreground font-semibold text-lg"
                >
                  Speed Limit (m/s)
                </Label>
                <div className="mt-2">
                  <Slider
                    value={[configData.speedLimit]}
                    onValueChange={([value]) => {
                      // console.log("Slider value:", value);
                      handleChange("speedLimit", value);
                    }}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="mt-4"
                  />
                  <p className="mt-2 text-sm text-foreground">
                    Current: {configData.speedLimit.toFixed(1)} m/s
                  </p>
                </div>
                {errors.speedLimit && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.speedLimit}
                  </p>
                )}
              </div>

              {/* Task Priority */}
              <div>
                <Label className="text-foreground font-semibold text-lg">
                  Task Priority (Drag to reorder)
                </Label>
                <div className="mt-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={configData.taskPriority}
                      strategy={verticalListSortingStrategy}
                    >
                      {configData.taskPriority.map((task) => (
                        <SortableTask key={task} id={task} task={task} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
                {errors.taskPriority && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.taskPriority}
                  </p>
                )}
              </div>

              {/* Message */}
              {message && (
                <p
                  className={cn(
                    "text-sm text-center",
                    message.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {message.text}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-background-500 hover:bg-background-600 text-foreground py-3 rounded-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 text-foreground-500 hover:text-foreground-600 text-foreground py-3 rounded-lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  },
});
