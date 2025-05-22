import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Define interfaces for TypeScript
interface RobotDetail {
  title: string;
  description: string;
  specs: string[];
}

// Header component
const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Robotics Fleet</h1>
        <p className="text-lg md:text-xl mb-6">Explore four cutting-edge robots designed for diverse applications</p>
        <Button onClick={() => window.alert('Discover robots clicked!')} className="bg-blue-600 hover:bg-blue-700">
          Discover Now
        </Button>
      </div>
    </header>
  );
};

// Details section
const Details: React.FC = () => {
  const robots: RobotDetail[] = [
    {
      title: 'X-1 Scout',
      description: 'A compact reconnaissance robot for surveillance and data collection in challenging environments.',
      specs: [
        'AI-Powered Vision: 4K cameras with night vision',
        'Battery Life: 12 hours continuous operation',
        'Connectivity: 5G and satellite communication',
        'Weight: 15 kg, IP67 water/dust resistance',
      ],
    },
    {
      title: 'X-2 Worker',
      description: 'A robust industrial robot for heavy-duty tasks in manufacturing and logistics.',
      specs: [
        'Payload Capacity: Up to 500 kg',
        'Precision: ±0.1 mm accuracy',
        'Power: Hybrid electric-hydraulic system',
        'Safety: LIDAR-based collision avoidance',
      ],
    },
    {
      title: 'X-3 Medic',
      description: 'A medical assistant robot for hospitals, designed for patient care and support.',
      specs: [
        'Sensors: Vital signs monitoring (heart rate, temperature)',
        'Mobility: 360° omnidirectional wheels',
        'Interface: Touchscreen with voice recognition',
        'Sterilization: UV-C disinfection module',
      ],
    },
    {
      title: 'X-4 Explorer',
      description: 'An autonomous exploration robot for extreme environments like space or deep sea.',
      specs: [
        'Environment: Operates in -40°C to 60°C',
        'Propulsion: All-terrain treads with 1 m/s speed',
        'Data: Onboard 1TB storage, real-time analytics',
        'Durability: Titanium alloy frame',
      ],
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Robot Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {robots.map((robot, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{robot.title}</CardTitle>
                <CardDescription>{robot.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600">
                  {robot.specs.map((spec, specIndex) => (
                    <li key={specIndex}>{spec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call-to-Action section
const CTA: React.FC = () => {
  return (
    <section className="py-16 bg-teal-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Robot</h2>
        <p className="text-lg mb-6">Contact us to find the perfect robot for your needs.</p>
        <Button variant="outline">Get in Touch</Button>
      </div>
    </section>
  );
};

// Main Robot component
const Robot: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Details />
      <CTA />
    </div>
  );
};

export const Route = createFileRoute('/Dashboard/')({
  component: Robot,
});

export default Robot;