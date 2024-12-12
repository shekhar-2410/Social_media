// import { useState } from 'react'
import SignIn from "./screens/SignIn";
import Signup from "./screens/Signup";
import { Routes, Route } from "react-router-dom";
import Home from "./layout/Home";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="home" element={<Home />} />
    </Routes>
  );
}

export default App;
