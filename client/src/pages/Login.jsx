import { Link, useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Alert } from "flowbite-react";
import Oauth from "../components/Oauth";
import {
  authPendingState,
  authFulfilledState,
  authRejectedState,
} from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(authPendingState());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(authRejectedState(data.message));
        return;
      }
      dispatch(authFulfilledState(data));
      navigate("/");
    } catch (error) {
      dispatch(authRejectedState(error.message));
    }
  };
  return (
    <div className="min-h-screen">
      <div className="flex md:items-center flex-col gap-3 md:flex-row md:gap-5 md:p-5 mt-20 max-w-3xl mx-auto p-3">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="flex items-center text-4xl font-bold">
            <span className="text-white py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
              TheScience
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo application. It has been built on React, node,
            express, and the elgenance of Tailwind
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          {isError && <Alert color="failure">{isError}</Alert>}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="someone@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink">
              Sign Up
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 mt-3">
            Dont have an account?
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
