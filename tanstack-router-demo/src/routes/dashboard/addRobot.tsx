import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddRobotFormProps = {
  onSubmit: (robot: {
    id: string;
    name: string;
    path: string;
    loadAvailable: string;
  }) => void;
};

function AddRobotForm({ onSubmit }: AddRobotFormProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [loadAvailable, setLoadAvailable] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const robot = {
      id: crypto.randomUUID(), // ✅ ensures unique ID
      name,
      path,
      loadAvailable,
    };

    onSubmit(robot);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Robot Name</Label>
        <Select value={name} onValueChange={(value) => setName(value)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a robot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AR-250">AR-250</SelectItem>
            <SelectItem value="AGV">Agv</SelectItem>
            <SelectItem value="PLR">PLR</SelectItem>
            <SelectItem value="AMR">AMR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-sm font-medium">Path</Label>
        <Select value={path} onValueChange={(value) => setPath(value)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a path" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Warehouse-A">Warehouse-A</SelectItem>
            <SelectItem value="Assembly-Line-B">Assembly-Line-B</SelectItem>
            <SelectItem value="Delivery-Route-C">Delivery-Route-C</SelectItem>
            <SelectItem value="Testing-Zone-D">Testing-Zone-D</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-sm font-medium">Load Available</Label>
        <Select
          value={loadAvailable}
          onValueChange={(value) => setLoadAvailable(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select load availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50Kg">50Kg</SelectItem>
            <SelectItem value="100Kg">100Kg</SelectItem>
            <SelectItem value="250kg">250kg</SelectItem>
            <SelectItem value="500kg">500kg</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-background-900 text-foreground w-full">
        Add Robot
      </Button>
    </form>
  );
}
export const Route = createFileRoute("/dashboard/addRobot")({
  component: AddRobotForm,
});

export default AddRobotForm;
