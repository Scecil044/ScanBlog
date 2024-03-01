import { Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DashSpinner from "../components/DashSpinner";
import AppModal from "../components/AppModal";
import UpdateModal from "../components/UpdateModal";
import AppSpinner from "../components/AppSpinner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/get/users");
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          return;
        }
        setLoading(false);
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
  }, [user._id]);
  const handleShowMore = async () => {
    try {
      setLoading(true);
      const startIndex = users.length;
      const res = await fetch(`/api/users/get/users?startIndex=${startIndex}`);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
        return;
      }
      setLoading(false);

      setUsers((prev) => [...prev, ...data.users]);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    setUsers((prev) =>
      prev.filter((user) => {
        const { firstName, lastName, email, _id } = user;
        return (
          firstName.toLowerCase().includes(searchTerm) ||
          lastName.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          _id.toLowerCase().includes(searchTerm)
        );
      })
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="min-h-screen table-auto md:mx-auto scrollbar scrollbar-thumb-slate-500 scrollbar-track-slate-400 dark:scrollbar-thumb-slate-200 dark:scrollbar-track-slate-200 overflow-x-auto">
        <div className="self-start md:ml-[870px] ml-[555px] my-2">
          <TextInput
            placeholder="Search..."
            id="search"
            onChange={handleSearch}
            className="w-72"
          />
        </div>
        <Table className="text-medium text-black dark:text-white" hoverable>
          <Table.Head>
            <Table.HeadCell>Created</Table.HeadCell>
            <Table.HeadCell>Avatar</Table.HeadCell>
            <Table.HeadCell>First Name</Table.HeadCell>
            <Table.HeadCell>Last Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={user.profilePicture}
                    alt="avatar"
                    className="object-cover rounded-full h-10 w-10"
                  />
                </Table.Cell>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>N/A</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-3 items-center">
                    <Link
                      onClick={() => {
                        setShowUpdateModal(true);
                        setUserId(user._id);
                      }}
                    >
                      Edit
                    </Link>
                    <Link
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user._id);
                      }}
                    >
                      Delete
                    </Link>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {users.length > 0 && showMore && (
          <button onClick={handleShowMore} className="w-full py-2 px-4 mb-5">
            Show More
          </button>
        )}
      </div>

      {showModal && (
        <AppModal
          showModal={showModal}
          setShowModal={setShowModal}
          component="user"
          userId={userId}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          setShowUpdateModal={setShowUpdateModal}
          showUpdateModal={showUpdateModal}
          component="user"
          userId={userId}
        />
      )}

      {loading && <AppSpinner />}
    </div>
  );
}
