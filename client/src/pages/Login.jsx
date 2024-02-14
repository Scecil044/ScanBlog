import { Link } from "react-router-dom";
import { TextInput, Label, Button } from "flowbite-react";

export default function Login() {
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
          <form className="flex flex-col">
            <div className="mb-4">
              <Label value="First Name" />
              <TextInput type="text" placeholder="First Name" id="firstName" />
            </div>

            <div className="mb-4">
              <Label value="Last Name" />
              <TextInput type="text" placeholder="Last Name" id="lastName" />
            </div>

            <div className="mb-4">
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="someone@gmail.com"
                id="email"
              />
            </div>

            <div className="mb-4">
              <Label value="Password" />
              <TextInput type="password" placeholder="Password" id="password" />
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
