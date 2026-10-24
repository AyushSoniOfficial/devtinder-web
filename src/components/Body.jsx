import axios from "axios";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { BASE_URL, END_POINTS } from "../config";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/slices/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (userData) {
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}${END_POINTS.profileView}`, {
        withCredentials: true,
      });

      const data = response?.data?.data;
      dispatch(addUser(data));
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching user:", error.response);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
