
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createFileRoute } from '@tanstack/react-router';

interface Robot {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastActive: string;
}

const robots: Robot[] = [
  { id: '1', name: 'Robot Alpha', status: 'active', lastActive: '2025-05-28 14:20' },
  { id: '2', name: 'Robot Beta', status: 'idle', lastActive: '2025-05-28 10:15' },
  { id: '3', name: 'Robot Gamma', status: 'error', lastActive: '2025-05-27 09:30' },
];

const RobotCard: React.FC<{ robot: Robot }> = ({ robot }) => {
  const statusVariants: Record<string, string> = {
    active: 'success',
    idle: 'secondary',
    error: 'destructive',
  };

  return (
    <Card className="w-64 m-2">
      <CardHeader>
        <CardTitle>{robot.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">ID: {robot.id}</p>
        <p className="text-sm">
          Status: <Badge variant={statusVariants[robot.status]}>{robot.status}</Badge>
        </p>
        <p className="text-sm">Last Active: {robot.lastActive}</p>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center p-4">
      {robots.map(robot => (
        <RobotCard key={robot.id} robot={robot} />
      ))}
    </div>
  );
};
export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
});

export default Dashboard;
