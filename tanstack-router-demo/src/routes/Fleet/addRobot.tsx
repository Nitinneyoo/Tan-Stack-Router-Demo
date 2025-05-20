import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";

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
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label className="block text-sm font-medium">Path</Label>
        <Input value={path} onChange={(e) => setPath(e.target.value)} required/>
      </div>
      <div>
        <Label className="block text-sm font-medium">Load Available</Label>
        <Input value={loadAvailable} onChange={(e) => setLoadAvailable(e.target.value)} />
      </div>
      <Button type="submit" className="bg-blue-900 text-white w-full">
        Add Robot
      </Button>
    </form>
  );
}
export const Route = createFileRoute("/Fleet/addRobot")({
  component: AddRobotForm,
});

export default AddRobotForm;