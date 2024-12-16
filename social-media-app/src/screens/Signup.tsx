import React, { useState } from "react";
import signupImg from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(name, email, password);
      alert("Sign Up Successful! You can now log in.");
      setEmail("");
      setPassword("");
      navigate("/");
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
          src={signupImg}
          alt="Signup Illustration"
          className="w-2/3 h-auto max-h-[80vh] object-contain transform transition-transform duration-500 hover:scale-110"
        />
      </div>
      {/* Right Card */}
      <div className="flex flex-col w-full md:w-1/2 items-center h-[100vh] justify-center bg-blue-100 p-8 shadow-lg rounded-lg md:rounded-none">
        <h1 className="text-3xl font-bold text-custom-green mb-4">
          Create an Account
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Join our community and start exploring <br /> amazing features today!
        </p>
        <form onSubmit={handleSignUp} className="w-full max-w-sm">
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-custom-green text-sm font-bold mb-2"
            >
              name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-custom-green text-sm font-bold mb-2"
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
            {" "}
            {/* Add relative positioning */}
            <label
              htmlFor="password"
              className="block text-custom-green text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"} // Toggle between text and password type
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
            />
            {/* Toggle visibility icon */}
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer" // Fix position
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Display eye icon */}
            </span>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-custom-green text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/">
            <span className="text-custom-green font-medium cursor-pointer">
              Login{" "}
            </span>
          </Link>
          to access your account.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
