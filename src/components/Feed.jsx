import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, END_POINTS } from "../config";
import { addFeed } from "../store/slices/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feedData = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const fetchFeedData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}${END_POINTS.feed}`, {
        withCredentials: true,
      });

      const data = res.data?.data || [];
      dispatch(addFeed(data));
    } catch (error) {
      console.log(
        "Error fetching feed data:",
        error?.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

  return (
    <div className="flex justify-center m-20">
      {feedData && feedData.length > 0 ? <UserCard user={feedData[0]} /> : null}
    </div>
  );
};

export default Feed;
