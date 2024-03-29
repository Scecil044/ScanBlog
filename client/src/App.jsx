import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import FooterComponent from "./components/FooterComponent";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminLayout from "./components/AdminLayout";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />} path="">
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
          <Route element={<AdminLayout />} path="">
            <Route path="/create/post" element={<CreatePost />} />
            <Route path="/edit/post/:postId" element={<EditPost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FooterComponent />
      </Router>
    </>
  );
}
