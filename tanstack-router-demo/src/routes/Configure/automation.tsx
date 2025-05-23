import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Cpu, Save, RefreshCw, Gauge, AlertOctagon, BatteryCharging, Wrench, Menu, X } from "lucide-react";
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
	horizontalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
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
			className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md text-black text-sm font-semibold cursor-move"
		>
			{task}
		</div>
	);
};

export const Route = createFileRoute("/configure/automation")({
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
			<div className="min-h-screen bg-white text-black">
				<div className="flex min-h-[calc(100vh-4rem)]">
					{/* Navbar */}
					<nav
						className={cn(
							"fixed md:static top-0 left-0 h-full w-64 bg-gray-100 p-4 border-r border-gray-300",
							isNavbarOpen ? "block" : "hidden md:block"
						)}
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-black">Automation Dashboard</h2>
							<Button
								variant="ghost"
								className="md:hidden text-black hover:bg-gray-200"
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
										"w-full justify-start text-sm font-semibold",
										activeSetting === option.key
											? "bg-blue-500 text-white"
											: "bg-white text-black border-gray-300 hover:bg-gray-200"
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
							{/* Setting Controls */}
							{activeSetting === "workflowMode" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<Cpu className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Workflow Mode</h3>
									</div>
									<div className="flex gap-2">
										{["Fully Automated", "Semi-Automated", "Operator-Assisted"].map((mode) => (
											<Button
												key={mode}
												variant={configData.workflowMode === mode ? "default" : "outline"}
												className={cn(
													"flex-1 py-2 text-sm font-semibold",
													configData.workflowMode === mode
														? "bg-blue-500 text-white"
														: "bg-white text-black border-gray-300 hover:bg-gray-200"
												)}
												onClick={() => handleChange("workflowMode", mode)}
											>
												{mode}
											</Button>
										))}
									</div>
									{errors.workflowMode && (
										<p className="mt-2 text-sm text-red-500">{errors.workflowMode}</p>
									)}
								</div>
							)}

							{activeSetting === "sensorSensitivity" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<Gauge className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Sensor Sensitivity</h3>
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
									<p className="mt-1 text-sm text-black">Current: {configData.sensorSensitivity}</p>
									{errors.sensorSensitivity && (
										<p className="mt-2 text-sm text-red-500">{errors.sensorSensitivity}</p>
									)}
								</div>
							)}

							{activeSetting === "errorHandlingMode" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<AlertOctagon className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Error Handling Mode</h3>
									</div>
									<div className="flex gap-2">
										{["Auto-Recover", "Pause and Alert", "Manual Intervention"].map((mode) => (
											<Button
												key={mode}
												variant={configData.errorHandlingMode === mode ? "default" : "outline"}
												className={cn(
													"flex-1 py-2 text-sm font-semibold",
													configData.errorHandlingMode === mode
														? "bg-blue-500 text-white"
														: "bg-white text-black border-gray-300 hover:bg-gray-200"
												)}
												onClick={() => handleChange("errorHandlingMode", mode)}
											>
												{mode}
											</Button>
										))}
									</div>
									{errors.errorHandlingMode && (
										<p className="mt-2 text-sm text-red-500">{errors.errorHandlingMode}</p>
									)}
								</div>
							)}

							{activeSetting === "powerOptimization" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<BatteryCharging className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Power Optimization</h3>
									</div>
									<div className="flex gap-2">
										{["Max Efficiency", "Balanced", "High Performance"].map((mode) => (
											<Button
												key={mode}
												variant={configData.powerOptimization === mode ? "default" : "outline"}
												className={cn(
													"flex-1 py-2 text-sm font-semibold",
													configData.powerOptimization === mode
														? "bg-blue-500 text-white"
														: "bg-white text-black border-gray-300 hover:bg-gray-200"
												)}
												onClick={() => handleChange("powerOptimization", mode)}
											>
												{mode}
											</Button>
										))}
									</div>
									{errors.powerOptimization && (
										<p className="mt-2 text-sm text-red-500">{errors.powerOptimization}</p>
									)}
								</div>
							)}

							{activeSetting === "movementPrecision" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<Wrench className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Movement Precision (mm)</h3>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											className="bg-white text-black border-gray-300 hover:bg-gray-200"
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
											className="w-16 bg-white text-black border border-gray-300 rounded-md text-center text-sm font-semibold"
										/>
										<Button
											variant="outline"
											className="bg-white text-black border-gray-300 hover:bg-gray-200"
											onClick={() => handleChange("movementPrecision", Math.min(5, configData.movementPrecision + 0.1))}
										>
											+
										</Button>
									</div>
									<p className="mt-1 text-sm text-black">Current: {configData.movementPrecision.toFixed(1)} mm</p>
									{errors.movementPrecision && (
										<p className="mt-2 text-sm text-red-500">{errors.movementPrecision}</p>
									)}
								</div>
							)}

							{activeSetting === "taskPriority" && (
								<div className="bg-white p-6 border border-gray-300 rounded-lg">
									<div className="flex items-center mb-4">
										<Wrench className="h-6 w-6 text-black mr-2" />
										<h3 className="text-lg font-semibold text-black">Task Priority</h3>
									</div>
									<div className="w-full max-w-xs flex gap-2">
										<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
											<SortableContext items={configData.taskPriority} strategy={horizontalListSortingStrategy}>
												{configData.taskPriority.length > 0 ? (
													configData.taskPriority.map((task) => (
														<SortableTask key={task} id={task} task={task} />
													))
												) : (
													<p className="text-sm text-red-500">No tasks available</p>
												)}
											</SortableContext>
										</DndContext>
									</div>
									{errors.taskPriority && (
										<p className="mt-2 text-sm text-red-500">{errors.taskPriority}</p>
									)}
								</div>
							)}

							{/* Summary Panel */}
							<div className="bg-white p-6 border border-gray-300 rounded-lg">
								<div className="flex items-center mb-4">
									<Wrench className="h-6 w-6 text-black mr-2" />
									<h3 className="text-lg font-semibold text-black">Configuration Summary</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
									<p>Workflow Mode: {configData.workflowMode}</p>
									<p>Sensor Sensitivity: {configData.sensorSensitivity}</p>
									<p>Error Handling: {configData.errorHandlingMode}</p>
									<p>Power Optimization: {configData.powerOptimization}</p>
									<p>Movement Precision: {configData.movementPrecision.toFixed(1)} mm</p>
									<p>Task Priority: {configData.taskPriority.join(" > ")}</p>
								</div>
								{message && (
									<p
										className={cn(
											"mt-4 text-sm text-center",
											message.type === "success" ? "text-green-500" : "text-red-500"
										)}
									>
										{message.text}
									</p>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 justify-center">
								<Button
									onClick={handleSave}
									className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-semibold"
								>
									<Save className="h-5 w-5 mr-2" />
									Validate
								</Button>
								<Button
									onClick={handleReset}
									className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-md font-semibold"
								>
									<RefreshCw className="h-5 w-5 mr-2" />
									Reset
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
});