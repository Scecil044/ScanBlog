import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteFulFilled,
  deletePending,
  deleteRejected,
  logoutUser,
  updateFulFilled,
  updatePending,
  updateRejected,
} from "../redux/authSlice";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to handle onChange for file input with ref
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // UseEffect handles uploading of image immediately selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      uploadImage();
    }
  }, [selectedImage]);

  //   Function to upload image to firebase
  const uploadImage = async () => {
    setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + selectedImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);
    uploadTask.on(
      "status_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // console.log(error);
        setUploadProgress(null);
        setImageUrl(null);
        setSelectedImage(null);
        setUploadError(
          "Failed to upload. The selected file must be an image, less than 2mb in size"
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    dispatch(updatePending());
    try {
      const res = await fetch(`/api/users/update/user/${user._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateRejected(data.message));
        return;
      }
      dispatch(updateFulFilled(data));
    } catch (error) {
      dispatch(updateRejected(error.message));
    }
  };

  // function to logout user
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      dispatch(logoutUser());
    } catch (error) {
      // console.log(error.message);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deletePending());
      const res = await fetch(`/api/users/delete/account/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.message !== false) {
        dispatch(deleteRejected(data.message));
      }
      dispatch(deleteFulFilled(data));
    } catch (error) {
      dispatch(deleteRejected(error.message));
      // console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto my-4 w-full flex flex-col gap-3">
      <input
        type="file"
        accept="image/*"
        id="file"
        onChange={handleImage}
        ref={fileRef}
        className="hidden"
      />
      <div className="w-32 h-32 cursor-pointer overflow-hidden self-center relative">
        {uploadProgress && (
          <CircularProgressbar
            value={uploadProgress || 0}
            text={`${uploadProgress}%`}
            strokeWidth={5}
            styles={{
              root: {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              },
              path: {
                stroke: `rgba(62,152,199, ${uploadProgress / 100})`,
              },
            }}
          />
        )}
        <img
          src={imageUrl || user?.profilePicture}
          alt="user"
          className={`object-cover w-32 h-32 border-8 border-gray-300 rounded-full hover:scale-105 ${
            uploadProgress && uploadProgress < 100 ? "opacity-60" : ""
          }`}
          onClick={() => fileRef.current.click()}
        />
      </div>
      {uploadError && <Alert color="failure">{uploadError}</Alert>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-3">
          <Label value="First Name" />
          <TextInput
            type="text"
            placeholder="First Name"
            id="firstName"
            defaultValue={user?.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <Label value="Last Name" />
          <TextInput
            type="text"
            placeholder="Last Name"
            id="lastName"
            defaultValue={user?.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <Label value="Email" />
          <TextInput
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={user?.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <Label value="Password" />
          <TextInput
            type="password"
            placeholder="Password"
            id="password"
            defaultValue="*****"
            onChange={handleChange}
          />
        </div>
        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Update
        </Button>
        <div className="flex justify-between items-center mt-3">
          <Link
            onClick={() => setShowModal(true)}
            className="py-1 px-3 text-red-500"
          >
            Delete Account
          </Link>
          <Link onClick={handleLogout} className="py-1 px-3 text-red-500">
            Logout
          </Link>
        </div>
      </form>
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col text-center">
            <HiOutlineExclamationCircle className="h-12 w-12 self-center mb-3" />
            <p className="gray-700 dark:gray-400">
              Are you sure you want to delete your account? All your personal
              configurations will be reset
            </p>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button onClick={() => setShowModal(false)} color="failure">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} color="gray">
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
