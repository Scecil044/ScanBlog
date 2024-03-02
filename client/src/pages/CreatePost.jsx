import ReactQuill from "react-quill";
import {
  Alert,
  Button,
  FileInput,
  Progress,
  Select,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // function to handle image upload to firebase
  const uploadImage = async () => {
    if (!selectedImage) {
      setUploadError("No image was selected");
      return;
    }
    try {
      setUploadError(null);
      setUploadProgress(null);
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
          setUploadError("Oops! something went wrong!");
          setUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, downloadUrl: downloadURL });
            setUploadError(null);
            setUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setUploadError("Image upload failed");
      setUploadProgress(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    try {
      const res = await fetch("/api/posts/create/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate("/dashboard?tab=posts");
    } catch (error) {
      setPublishError(error.message);
    }
  };
  // console.log(formData, uploadProgress);
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-5">
      <h1 className="text-center text-2xl font-semibold mt-5 mb-2">
        Create Post
      </h1>
      {publishError && <Alert color="failure">{publishError}</Alert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            className="flex-1"
            id="title"
            onChange={handleChange}
          />
          <Select id="category" onChange={handleChange}>
            <option value="uncategorized">Select a Category</option>
            <option value="Vue.js">Vue.js</option>
            <option value="React.js">React.js</option>
            <option value="Node.js">Node.js</option>
            <option value="Laravel">Laravel</option>
          </Select>
        </div>
        <div className="flex flex-row justify-between border-blue-400 border-4 border-dotted p-2">
          <FileInput
            accept="image/*"
            id="image"
            className="flex-1"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
          <Button
            onClick={uploadImage}
            type="button"
            outline
            gradientDuoTone="purpleToPink"
          >
            Upload
          </Button>
        </div>
        {uploadProgress && <Progress progress={uploadProgress} color="blue" />}

        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        {selectedImage && (
          <img src={formData.downloadUrl} alt="selectedImage" />
        )}
        <ReactQuill
          theme="snow"
          className="h-72"
          placeholder="Write something..."
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Post
        </Button>
      </form>
    </div>
  );
}
