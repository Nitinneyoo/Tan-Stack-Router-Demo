import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Animation variants
const fieldVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
	}),
};

// Sortable task item component
const SortableTask = ({ id, task }: { id: string; task: string }) => {
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
			className="flex items-center p-3 bg-white/80 dark:bg-gray-900/80 border border-blue-200/50 dark:border-blue-700/50 rounded-lg mb-2 cursor-move hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
		>
			<span className="text-gray-900 dark:text-white">{task}</span>
		</div>
	);
};

function RootIndex() {
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
				(task) => task === active.id,
			);
			const newIndex = configData.taskPriority.findIndex(
				(task) => task === over.id,
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
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/90 via-white/90 to-blue-100/90 dark:from-blue-900/90 dark:via-gray-900/90 dark:to-blue-950/90 relative overflow-hidden z-0">
			{/* Particle Background */}
			<div className="absolute inset-0 pointer-events-none z-0">
				<div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-10 left-20" />
				<div className="absolute w-2 h-2 bg-blue-500/50 rounded-full animate-particle top-40 right-28 delay-600" />
				<div className="absolute w-1 h-1 bg-blue-300/50 rounded-full animate-particle bottom-20 left-40 delay-300" />
				<div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-60 left-60 delay-900" />
			</div>

			{/* Header */}
			<motion.header
				initial={{ opacity: 0, y: -40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-950 dark:to-blue-900 shadow-xl"
			>
				{/* <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              configure Your Fleet
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-blue-100 dark:text-blue-200 font-medium max-w-3xl">
              Customize your ANSCER Robotics fleet settings to optimize performance and efficiency.
            </p>
          </div> */}
			</motion.header>

			{/* Main Content */}
			<main className="flex-grow max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 z-10">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="bg-white/95 dark:bg-gray-800/95 p-8 sm:p-12 rounded-2xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-lg"
				>
					<form onSubmit={handleSave} className="space-y-8">
						{/* Operation Mode */}
						<motion.div
							custom={0}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label
								htmlFor="operationMode"
								className="text-gray-800 dark:text-gray-100 font-semibold text-lg"
							>
								Operation Mode
							</Label>
							<div className="mt-2 relative group">
								<Select
									value={configData.operationMode}
									onValueChange={(value) => {
										console.log("Operation Mode selected:", value);
										handleChange("operationMode", value);
									}}
								>
									<SelectTrigger
										className={cn(
											"pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
											errors.operationMode &&
												"border-red-500 focus:ring-red-500",
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
									className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
									aria-hidden="true"
								/>
							</div>
							<AnimatePresence>
								{errors.operationMode && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.operationMode}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Task Scheduling Mode */}
						<motion.div
							custom={1}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label
								htmlFor="taskSchedulingMode"
								className="text-gray-800 dark:text-gray-100 font-semibold text-lg"
							>
								Task Scheduling Mode
							</Label>
							<div className="mt-2 relative group">
								<Select
									value={configData.taskSchedulingMode}
									onValueChange={(value) => {
										console.log("Task Scheduling Mode selected:", value);
										handleChange("taskSchedulingMode", value);
									}}
								>
									<SelectTrigger
										className={cn(
											"pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
											errors.taskSchedulingMode &&
												"border-red-500 focus:ring-red-500",
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
									className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
									aria-hidden="true"
								/>
							</div>
							<AnimatePresence>
								{errors.taskSchedulingMode && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.taskSchedulingMode}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Safety Protocol Mode */}
						<motion.div
							custom={2}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label
								htmlFor="safetyProtocolMode"
								className="text-gray-800 dark:text-gray-100 font-semibold text-lg"
							>
								Safety Protocol Mode
							</Label>
							<div className="mt-2 relative group">
								<Select
									value={configData.safetyProtocolMode}
									onValueChange={(value) => {
										console.log("Safety Protocol Mode selected:", value);
										handleChange("safetyProtocolMode", value);
									}}
								>
									<SelectTrigger
										className={cn(
											"pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
											errors.safetyProtocolMode &&
												"border-red-500 focus:ring-red-500",
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
									className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
									aria-hidden="true"
								/>
							</div>
							<AnimatePresence>
								{errors.safetyProtocolMode && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.safetyProtocolMode}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Energy Saving Mode */}
						<motion.div
							custom={3}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label
								htmlFor="energySavingMode"
								className="text-gray-800 dark:text-gray-100 font-semibold text-lg"
							>
								Energy Saving Mode
							</Label>
							<div className="mt-2 relative group">
								<Select
									value={configData.energySavingMode}
									onValueChange={(value) => {
										console.log("Energy Saving Mode selected:", value);
										handleChange("energySavingMode", value);
									}}
								>
									<SelectTrigger
										className={cn(
											"pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
											errors.energySavingMode &&
												"border-red-500 focus:ring-red-500",
										)}
									>
										<SelectValue placeholder="Select mode" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Eco">Eco (Max battery life)</SelectItem>
										<SelectItem value="Performance">
											Performance (Max speed)
										</SelectItem>
										<SelectItem value="Balanced">
											Balanced (Moderate energy)
										</SelectItem>
									</SelectContent>
								</Select>
								<Battery
									className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
									aria-hidden="true"
								/>
							</div>
							<AnimatePresence>
								{errors.energySavingMode && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.energySavingMode}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Speed Limit */}
						<motion.div
							custom={4}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label
								htmlFor="speedLimit"
								className="text-gray-800 dark:text-gray-100 font-semibold text-lg"
							>
								Speed Limit (m/s)
							</Label>
							<div className="mt-2">
								<Slider
									value={[configData.speedLimit]}
									onValueChange={([value]) => {
										console.log("Slider value:", value);
										handleChange("speedLimit", value);
									}}
									min={0.5}
									max={5}
									step={0.1}
									className="mt-4"
								/>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
									Current: {configData.speedLimit.toFixed(1)} m/s
								</p>
							</div>
							<AnimatePresence>
								{errors.speedLimit && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.speedLimit}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Task Priority */}
						<motion.div
							custom={5}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
						>
							<Label className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
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
							<AnimatePresence>
								{errors.taskPriority && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="mt-2 text-sm text-red-500"
									>
										{errors.taskPriority}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Message */}
						<AnimatePresence>
							{message && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className={cn(
										"text-sm text-center",
										message.type === "success"
											? "text-green-500"
											: "text-red-500",
									)}
								>
									{message.text}
								</motion.p>
							)}
						</AnimatePresence>

						{/* Buttons */}
						<motion.div
							custom={6}
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							className="flex gap-4"
						>
							<Button
								type="submit"
								className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300"
							>
								<Save className="h-5 w-5 mr-2" />
								Save Settings
							</Button>
							<Button
								type="button"
								onClick={handleReset}
								className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(107,114,128,0.8)] transition-all duration-300"
							>
								<RefreshCw className="h-5 w-5 mr-2" />
								Reset to Default
							</Button>
						</motion.div>
					</form>
				</motion.div>
			</main>
		</div>
	);
}

export const Route = createFileRoute("/Configure/")({
	component: RootIndex,
  exact: true
});
