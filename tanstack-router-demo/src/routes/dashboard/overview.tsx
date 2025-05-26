import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Define interfaces for TypeScript
interface Feature {
  title: string;
  description: string;
}

// Header component
const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">NextGen Robotics</h1>
        <p className="text-lg md:text-xl mb-6">Revolutionizing automation with cutting-edge technology</p>
        <Button onClick={() => window.alert('Learn more clicked!')} className="bg-blue-600 hover:bg-blue-700">
          Explore Now
        </Button>
      </div>
    </header>
  );
};
  
// Features section
const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Advanced AI',
      description: 'Leverages state-of-the-art AI to perform complex tasks with precision and adaptability.',
    },
    {
      title: 'Modular Design',
      description: 'Customizable components allow seamless integration into various environments.',
    },
    {
      title: 'Real-Time Analytics',
      description: 'Provides instant data insights for optimized performance and decision-making.',
    },
    {
      title: 'Energy Efficient',
      description: 'Designed for sustainability with low power consumption and eco-friendly materials.',
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
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
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
        <p className="text-lg mb-6">Join the robotics revolution today and unlock endless possibilities.</p>
        <Button variant="outline">Get Started</Button>
      </div>
    </section>
  );
};

// Main RobotOverview component
const RobotOverview: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Features />
      <CTA />
    </div>
  );
};

export const Route = createFileRoute('/dashboard/overview')({
  component: RobotOverview,
});

export default RobotOverview;