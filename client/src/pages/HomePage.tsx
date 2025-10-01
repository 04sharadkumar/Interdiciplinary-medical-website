import React from 'react';
import { Link } from 'react-router-dom';
import { 
  
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  Package,
  CheckCircle,
  
} from 'lucide-react';
import { FaHandHoldingMedical } from "react-icons/fa";
import Slider from '../components/Slider'
const HomePage: React.FC = () => {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track medicines, equipment, and supplies with real-time stock monitoring.'
    },
    {
      icon: Clock,
      title: 'Expiry Tracking',
      description: 'Automated alerts for medicines nearing expiration to prevent waste.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting on usage patterns and inventory optimization.'
    },
    {
      icon: Users,
      title: 'Supplier Management',
      description: 'Maintain vendor relationships and track purchase history efficiently.'
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure access control for Admin, Staff, and Pharmacist roles.'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Ready',
      description: 'Built-in features to maintain healthcare regulatory compliance.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaHandHoldingMedical className="w-8 h-8 text-red-600 mr-3" /> 
              <span className="text-2xl font-bold text-blue-800">MedInventory</span>
            </div>
            <div className="flex space-x-2 ">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-4 py-2  rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Slider />
     

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Inventory Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage hospital inventory efficiently, 
              reduce waste, and ensure critical supplies are always available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Hospitals</div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Items Tracked</div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hospital Inventory?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of healthcare facilities already using MedInventory to optimize their operations.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaHandHoldingMedical className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold">MedInventory</span>
            </div>
            <div className="text-gray-400">
              © 2024 MedInventory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;