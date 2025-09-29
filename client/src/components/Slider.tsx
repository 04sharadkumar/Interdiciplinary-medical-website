import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroPage() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20 min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/image.png')",
      }}
    >
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Modern Hospital Inventory
          <span className="text-blue-300 block">Management System</span>
        </h1>

        <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Streamline your hospital's inventory operations with our comprehensive solution. 
          Track medicines, manage suppliers, and ensure optimal stock levels with real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg inline-flex items-center justify-center"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>

          <Link
            to="/login"
            className="border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
