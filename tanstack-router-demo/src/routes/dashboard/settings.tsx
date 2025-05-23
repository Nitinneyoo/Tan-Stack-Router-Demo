
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Define interfaces for TypeScript
interface Setting {
  title: string;
  description: string;
  type: 'switch' | 'input';
  id: string;
  label: string;
}

// Header component
const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
        <p className="text-lg md:text-xl mb-6">Customize your robotics experience</p>
        <Button onClick={() => window.alert('Manage settings clicked!')} className="bg-purple-600 hover:bg-purple-700">
          Manage Settings
        </Button>
      </div>
    </header>
  );
};

// Settings section
const SettingsSection: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState('');

  const settings: Setting[] = [
    {
      title: 'Dark Mode',
      description: 'Toggle between light and dark themes for the dashboard.',
      type: 'switch',
      id: 'dark-mode',
      label: 'Enable Dark Mode',
    },
    {
      title: 'Notifications',
      description: 'Receive alerts for system updates and robot status changes.',
      type: 'switch',
      id: 'notifications',
      label: 'Enable Notifications',
    },
    {
      title: 'API Key',
      description: 'Enter your API key for integrating with external services.',
      type: 'input',
      id: 'api-key',
      label: 'API Key',
    },
  ];

  const handleSave = () => {
    window.alert(`Settings saved: Dark Mode=${darkMode}, Notifications=${notifications}, API Key=${apiKey}`);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Manage Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.map((setting) => (
            <Card key={setting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{setting.title}</CardTitle>
                <CardDescription>{setting.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {setting.type === 'switch' ? (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={setting.id}
                      checked={setting.id === 'dark-mode' ? darkMode : notifications}
                      onCheckedChange={(checked) =>
                        setting.id === 'dark-mode' ? setDarkMode(checked) : setNotifications(checked)
                      }
                    />
                    <Label htmlFor={setting.id}>{setting.label}</Label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={setting.id}>{setting.label}</Label>
                    <Input
                      id={setting.id}
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </section>
  );
};

// Call-to-Action section
const CTA: React.FC = () => {
  return (
    <section className="py-16 bg-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Optimized for You</h2>
        <p className="text-lg mb-6">Fine-tune your settings to enhance your robotics workflow.</p>
        <Button variant="outline">Explore More Options</Button>
      </div>
    </section>
  );
};

// Main Settings component
const SettingsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <SettingsSection />
      <CTA />
    </div>
  );
};

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
});

export default SettingsPage;