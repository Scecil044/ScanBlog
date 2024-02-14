import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authFulfilledState,
  authPendingState,
  authRejectedState,
} from "../redux/authSlice";

export default function Register() {
  const { isLoading, isError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(authPendingState());
      const res = await fetch("/api/auth/register", {
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
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <Label value="First Name" />
              <TextInput
                type="text"
                placeholder="First Name"
                id="firstName"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Label value="Last Name" />
              <TextInput
                type="text"
                placeholder="Last Name"
                id="lastName"
                onChange={handleChange}
              />
            </div>

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
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
