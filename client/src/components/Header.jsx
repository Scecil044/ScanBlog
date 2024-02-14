import { Button, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaRegMoon } from "react-icons/fa6";

import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const path = useLocation().pathname;
  return (
    <>
      <Navbar className="border-b-2">
        <Link
          to="/"
          className="flex items-center text-sm sm:text-xl text-nowrap"
        >
          <span className="px-2 py-1 text-white bg-gradient-to-r from-indigo-500 via bg-purple-500 to-pink-500 rounded-lg">
            TheScience
          </span>
          Blog
        </Link>

        <form className="hidden lg:inline">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
          />
        </form>
        <Button pill className="w-12 h-10 lg:hidden" color="gray">
          <AiOutlineSearch />
        </Button>

        <div className="flex gap-2 md:order-2">
          <Button color="gray" className="hidden sm:inline">
            <FaRegMoon />
          </Button>
          <Link to="/login">
            <Button color="grey" gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
