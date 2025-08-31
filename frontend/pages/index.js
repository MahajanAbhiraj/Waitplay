import React, { Component } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode'; // Import the library

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: null,
      restaurantId: null,
      role: null,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    // 1. Handle case where there is NO token
    if (!token) {
      this.setState({ isAuthenticated: false });
      return; // Stop execution
    }

    try {
      // 2. Decode the token to get its payload
      const decodedToken = jwtDecode(token);
      
      // The 'exp' claim is in seconds, so we compare it with the current time in seconds
      const currentTime = Date.now() / 1000;

      // 3. Handle case where token is EXPIRED
      if (decodedToken.exp < currentTime) {
        console.warn("Token has expired.");
        // Clean up the expired token from storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('restaurant_id');
        this.setState({ isAuthenticated: false });
      } else {
        // 4. Handle case where token is VALID
        const userRole = localStorage.getItem('role'); // Or get it from decodedToken.role
        const restaurantId = localStorage.getItem('restaurant_id');
        this.setState({
          isAuthenticated: true,
          role: userRole,
          restaurantId: userRole === 'admin' ? restaurantId : null,
        });
      }
    } catch (error) {
      // 5. Handle case where token is INVALID or MALFORMED
      console.error("Invalid token:", error);
      // Clean up the invalid token from storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('restaurant_id');
      this.setState({ isAuthenticated: false });
    }
  }

  render() {
    const { isAuthenticated, role, restaurantId } = this.state;

    if (isAuthenticated === null) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">Loading...</div>;
    }

    if (!isAuthenticated) {
      // This "Oops" page will now show for no token, expired token, or invalid token
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mt-4">Oops! You're not logged in.</h1>
          <p className="text-lg text-gray-600 mt-2">
            Your session may have expired. Please sign in to continue.
          </p>
          <Link href="/login" legacyBehavior>
            <a className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
              Sign In
            </a>
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-white text-gray-800">
        <header className="bg-gray-50 py-20">
          <button className="absolute top-4 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105">
            <Link 
              href={role === "admin" ? `/${restaurantId}/dashboard` : "/admin"} 
              legacyBehavior
            >
              <a>Go to your page</a>
            </Link>
          </button>
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold text-gray-900">Welcome to WaitPlay</h1>
            <p className="text-xl text-gray-700 mt-4">
              Revolutionize Your Restaurant's Dining Experience.
            </p>
            
          </div>
        </header>

        {/* Features for Customers Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">A Seamless Experience for Your Guests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                

[Image of a QR code]

                <h3 className="text-2xl font-semibold mt-4">Instant Menu Access</h3>
                <p className="mt-2 text-gray-600">Guests scan a unique QR code at their table to instantly view your full menu.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                
                <h3 className="text-2xl font-semibold mt-4">Effortless Ordering</h3>
                <p className="mt-2 text-gray-600">They can browse, customize, and place their order directly from their own device.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                
                <h3 className="text-2xl font-semibold mt-4">Live Order Tracking</h3>
                <p className="mt-2 text-gray-600">Keep guests informed with real-time order status updates from confirmed to served.</p>
              </div>
            </div>
          </div>
        </section>
        
        <hr className="border-gray-200 container mx-auto" />

        {/* Features for Restaurants Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Powerful Tools for Your Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                
                <h3 className="text-2xl font-semibold mt-4">Centralized Admin Panel</h3>
                <p className="mt-2 text-gray-600">Manage your menu, track all orders, and oversee table assignments from one intuitive dashboard.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                
                <h3 className="text-2xl font-semibold mt-4">Real-Time Order Management</h3>
                <p className="mt-2 text-gray-600">New orders appear instantly. Update the status with a single click to notify both staff and customers.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                
                <h3 className="text-2xl font-semibold mt-4">Instant Notifications</h3>
                <p className="mt-2 text-gray-600">Our real-time system ensures your staff is immediately alerted to new orders and customer requests.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 WaitPlay. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}