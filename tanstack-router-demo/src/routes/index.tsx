import { createFileRoute, Link } from '@tanstack/react-router';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Anscer Robotics</h1>
         
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Welcome to AnsCer Robotics</h2>
          <p className="text-lg text-gray-600 mb-6">
            Pioneering the future of automation with intelligent robotic solutions. Explore our fleet, learn about our mission, and discover how we’re reshaping industries.
          </p>
          <Link
            to="/Fleet"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700"
          >
            Explore Fleet
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow-lg rounded-2xl bg-blue-50">
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Advanced Navigation</h3>
            <p className="text-gray-600">Our robots use cutting-edge algorithms for real-time navigation in dynamic environments.</p>
          </div>
          <div className="p-6 shadow-lg rounded-2xl bg-blue-50">
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Intelligent Decision-Making</h3>
            <p className="text-gray-600">AI-powered control systems enable autonomous decisions and task management.</p>
          </div>
          <div className="p-6 shadow-lg rounded-2xl bg-blue-50">
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Fleet Management</h3>
            <p className="text-gray-600">Manage multiple robots through our unified dashboard for maximum efficiency.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Automate with AnsCer?</h2>
        <p className="text-lg mb-6">Get in touch with us and discover how we can help revolutionize your operations.</p>
        <Link
          to="/contact"
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100"
        >
          Contact Us
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} AnsCer Robotics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
 

export default HomePage;