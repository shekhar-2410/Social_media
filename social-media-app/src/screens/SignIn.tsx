import React, { useState } from "react";
import loginImg from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen sm:p-4 md:p-0">
      {/* Left Card */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center overflow-hidden">
        <img
          src={loginImg}
          alt="Login Illustration"
          className="w-2/3 h-auto max-h-[80vh] object-contain transform transition-transform duration-500 hover:scale-110"
        />
      </div>
      {/* Right Card */}
      <div className="flex flex-col w-full md:w-1/2 items-center h-[100vh] justify-center bg-violet-100 p-8 shadow-lg rounded-lg md:rounded-none">
        <h1 className="text-3xl font-bold text-custom-purple mb-4">
          Welcome back
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          We've missed you! Please sign in to catch <br /> up on what you've
          missed.
        </p>
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-custom-purple text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
            />
          </div>
          {/* Password */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-custom-purple text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"} // Toggle input type based on visibility state
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
            />
            {/* Toggle visibility icon */}
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-3/4 right-4 transform -translate-y-1/2 cursor-pointer"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Display eye icon */}
            </span>
          </div>
          {/* Login Button */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-custom-purple text-white font-bold py-2 px-4 rounded-xl hover:bg-purple-900 hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 mt-6 text-center">
          Don't have an account yet?
          <Link to="/signup">
            <span className="text-custom-purple font-medium cursor-pointer">
              Sign up
            </span>{" "}
          </Link>
          now to join our community.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
