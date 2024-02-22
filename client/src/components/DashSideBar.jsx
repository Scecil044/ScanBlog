import { Sidebar } from "flowbite-react";
import { FaUser } from "react-icons/fa";
import { CgArrowRight } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../redux/authSlice";
import { useSelector } from "react-redux";
import { IoMdDocument } from "react-icons/io";

export default function DashSideBar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // function to logout user
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      dispatch(logoutUser());
    } catch (error) {
      // console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={FaUser}
              active={tab === "profile"}
              label={user.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {user.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                icon={IoMdDocument}
                active={tab === "posts"}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            onClick={handleLogout}
            icon={CgArrowRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
