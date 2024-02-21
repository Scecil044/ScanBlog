import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { HiInformationCircle } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(null);

  // function to upload image to firebase
  const imageUpload = async () => {
    if (!selectedFile) {
      setUploadError("No file was selected!");
      return;
    }
    setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "status_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(progress.toFixed(0));
        setUploadError(null);
      },
      (error) => {
        setUploadError("Image must nox exceed 2MB in size!");
        setUploadPercentage(null);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, downloadURL: downloadUrl });
          setUploadError(null);
          setUploadPercentage(null);
        });
      }
    );
  };
  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  // Fetch post data
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/get/post/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setPost(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPost();

    // handle timeOut
    if (uploadError) {
      const timeOutId = setTimeout(() => {
        setUploadError(null);
      }, 2000);

      return () => clearTimeout(timeOutId);
    }
  }, [postId, uploadError]);
  console.log(formData);
  console.log(selectedFile);
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto my-5 p-5 shadow-md">
        <h1 className="font-semibold text-3xl text-center">Edit Post</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-5">
            <TextInput
              placeholder="Title"
              defaultValue={post?.title}
              id="title"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="flex-1"
            />

            <Select
              id="category"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="uncategorised">{post?.category}</option>
              <option value="React.js">React.js</option>
              <option value="Node.js">Node.js</option>
              <option value="Vue.js">Vue.js</option>
            </Select>
          </div>
          <div className="flex items-center justify-between p-5 border-4 border-dotted border-blue-400">
            <FileInput
              id="image"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button
              type="button"
              onClick={imageUpload}
              outline
              gradientDuoTone="purpleToPink"
              size="md"
              disabled={uploadPercentage}
              className={`disabled:cursor-not-allowed`}
            >
              {uploadPercentage && uploadPercentage < 100
                ? "Uploading..."
                : " Upload"}
            </Button>
          </div>
          <div className="relative">
            {uploadError && (
              <Alert color="red" withBorderAccent icon={HiInformationCircle}>
                {uploadError}
              </Alert>
            )}
            {!uploadPercentage && formData.downloadURL && (
              <img
                src={formData.downloadURL}
                alt="image"
                className="object-cover h-52 w-full"
              />
            )}
            {uploadPercentage &&
              uploadPercentage > 0 &&
              uploadPercentage < 100 && (
                <div className="text-center">{`Please Wait... ${uploadPercentage}% done`}</div>
              )}
          </div>
          <ReactQuill
            theme="snow"
            className="h-72"
            placeholder="Write something here..."
            id="content"
            onChange={(value) => setFormData({ ...formData, category: value })}
            value={post.title}
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}
