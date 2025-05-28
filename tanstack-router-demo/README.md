# Anscer Robotics Dashboard

A comprehensive React-based dashboard for managing and monitoring robotic automation systems.

## Features

- **Fleet Management**: Add, monitor, and manage robots in your fleet
- **Configuration Panel**: Configure robot settings including:
  - Operation modes
  - Safety protocols
  - Energy optimization
  - Task scheduling
- **Workspace Mapping**: Visual editor for configuring workspace layouts
- **Authentication**: Secure login and signup system
- **Real-time Monitoring**: Track robot status and activities
- **Task Management**: Prioritize and schedule robot tasks
- **Contact System**: Built-in communication system

## Tech Stack

- React 
- TypeScript
- TanStack Router
- Tailwind CSS
- Radix UI Components
- DND Kit for drag-and-drop
- Zod for validation

## Getting Started

1. Clone the repository
2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8000`

## Project Structure

```
src/
├── components/      # Reusable UI components
├── routes/         # Application routes and pages
│   ├── Configure/  # Configuration related routes
│   ├── Fleet/      # Fleet management routes
│   └── dashboard/  # Dashboard routes
├── lib/           # Utility functions
└── hooks/         # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

[Your License]

## Contributing

[Contribution Guidelines]