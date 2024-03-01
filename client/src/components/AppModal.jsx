import { Button } from "flowbite-react";
import { useState } from "react";
import { IoIosWarning } from "react-icons/io";
import ButtonSpinner from "./ButtonSpinner";
import { useNavigate } from "react-router-dom";

export default function AppModal({
  showModal,
  setShowModal,
  component,
  userId,
}) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      setShowModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-full h-full inset-0 fixed bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 text-black dark:text-white dark:bg-[rgb(16,23,42)] w-[70%] md:w-[30%] flex flex-col relative">
          {component === "user" && (
            <>
              <IoIosWarning className="h-12 w-12 self-center mb-3" />
              <p className="text-sm text-black dark:text-white text-center">
                Are you sure you want to delete this record. The account will be
                permanently deleted from the system
              </p>
              <div className="flex gap-3 items-center mt-3 justify-end">
                <Button onClick={() => setShowModal(false)} color="gray">
                  Cancel
                </Button>
                <Button onClick={deleteUser} color="red">
                  {isLoading && <ButtonSpinner />}
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
