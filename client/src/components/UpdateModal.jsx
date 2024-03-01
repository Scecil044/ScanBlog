import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import AppSpinner from "./AppSpinner";

export default function UpdateModal({
  showUpdateModal,
  setShowUpdateModal,
  component,
  userId,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // function to delete user
  const deleteUser = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetch(`/api/users/delete/account/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setIsLoading(false);
        setIsError(data.message);
        return;
      }
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.log(error.message);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/get/users?userId=${userId}`);
        const data = await res.json();
        if (data.success === false) {
          setIsLoading(false);
          console.log(data.message);
          return;
        }
        setFormData(data.users[0]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
      }
    };
    fetchUser();
    console.log(formData);
  }, [userId]);
  return (
    <div className="w-full h-full inset-0 fixed bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 text-black dark:text-white dark:bg-[rgb(16,23,42)] w-[90%] md:w-[50%] flex flex-col relative">
        {component === "user" && (
          <>
            <p className="text-lg font-semibold text-black dark:text-white">
              Update
            </p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <div className="mb-3 md:mb-0">
                <Label>First Name</Label>
                <TextInput
                  type="text"
                  placeholder="First Name"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 md:mb-0">
                <Label>Last Name</Label>
                <TextInput
                  type="text"
                  placeholder="Last Name"
                  id="lastName"
                  value={formData.lastName}
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 md:mb-0">
                <Label>Email</Label>
                <TextInput
                  type="email"
                  placeholder="Email"
                  id="email"
                  value={formData.email}
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 md:mb-0">
                <Label>Password</Label>
                <TextInput
                  type="password"
                  placeholder="********"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 md:mb-0">
                <Label>Confirm Password</Label>
                <TextInput
                  type="password"
                  placeholder="********"
                  id="passwordConfirmation"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center mt-3 justify-end">
              <Button onClick={() => setShowUpdateModal(false)} color="red">
                Cancel
              </Button>
              <Button gradientDuoTone="purpleToPink">Update</Button>
            </div>
          </>
        )}
      </div>
      {isLoading && <AppSpinner />}
    </div>
  );
}
