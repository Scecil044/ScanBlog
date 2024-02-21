import { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/get/posts?userId=${user._id}`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user.isAdmin) {
      fetchPosts();
    }
  }, [user._id]);

  // Function to show more posts
  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(
        `/api/posts/get/posts?userId=${user._id}&startIndex=${startIndex}`
      );
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to delete post
  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/posts/delete/post/${user._id}/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen md:mx-auto table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-500 dark:scrollbar-thumb-slate-700">
      {user.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {posts.map((post, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-10 w-20 object-cover"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="text-gray-500 dark:text-gray-400 font-m">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className="text-red-600 hover:underline">
                    <Link
                      onClick={() => {
                        setShowModal(true);
                        setPostId(post?._id);
                      }}
                    >
                      Delete
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-blue-500">
                      <Link to={`/edit/post/${post._id}`}>Edit</Link>
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-600 dark:text-white py-7 w-full"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        "You have no posts yet"
      )}

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
              Are you sure you want to delete this post account?
            </p>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button onClick={() => setShowModal(false)} color="failure">
              Cancel
            </Button>
            <Button onClick={handleDeletePost} color="gray">
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
