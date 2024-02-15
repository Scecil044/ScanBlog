import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function FooterComponent() {
  return (
    <>
      <footer className="mt-12 border-t-8 border-teal-500 w-full p-5 bg-black text-white">
        <div className=" my-5 p-5 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="hidden  md:inline md:ml-5">
            <Link to="/">
              <FaHome className="h-8 w-9" />
            </Link>
          </div>

          <div className="text-sm">
            <ul className="flex flex-col gap-3">
              <li>
                <Link>Home</Link>
              </li>
              <li>
                <Link>Services</Link>
              </li>
              <li>
                <Link>About</Link>
              </li>
              <li>
                <Link>Contact_us</Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <ul className="flex flex-col gap-3">
              <li>
                <Link>Home</Link>
              </li>
              <li>
                <Link>Services</Link>
              </li>
              <li>
                <Link>About</Link>
              </li>
              <li>
                <Link>Contact_us</Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <ul className="flex flex-col gap-3">
              <li>
                <Link>Home</Link>
              </li>
              <li>
                <Link>Services</Link>
              </li>
              <li>
                <Link>About</Link>
              </li>
              <li>
                <Link>Contact_us</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="bg-white px-5 flex flex-col md:flex-row md:justify-between text-center">
        <div>&copy;{new Date().getFullYear()}</div>
        <div className="flex justify-center">
          <ul className="flex gap-5">
            <Link className="flex items-center gap-1">
              <FaGithub />
              Github
            </Link>
            <Link className="flex items-center gap-1">
              <FaGithub />
              Github
            </Link>
            <li>
              <Link className="flex items-center gap-1">
                <FaGithub />
                Github
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
