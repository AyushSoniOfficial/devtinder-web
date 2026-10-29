import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, END_POINTS } from "../config";
import { addRequests, removeRequestById } from "../store/slices/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}${END_POINTS.requests}`, {
        withCredentials: true,
      });

      console.log("requests res.data", res.data);
      const data = res?.data?.data || [];
      dispatch(addRequests(data));
    } catch (error) {
      console.log(
        "Error fetching requests:",
        error?.response?.data || error.message,
      );
    }
  };

  const handleRequestReview = async (status, requestId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}${END_POINTS.requestReview}/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      console.log("review response", res.data);
      dispatch(removeRequestById(requestId));
    } catch (error) {
      console.log(
        "Error reviewing request:",
        error?.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Requests</h2>

      {requests?.length ? (
        <div className="space-y-4">
          {requests.map((request, index) => {
            const sender = request?.fromUserId || {};

            return (
              <div
                key={request?._id || index}
                className="flex items-center gap-4 rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm"
              >
                <img
                  src={
                    sender?.imageUrl ||
                    "https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg"
                  }
                  alt={`${sender?.firstName || "User"} ${sender?.lastName || ""}`}
                  className="h-20 w-20 rounded-full object-cover border-2 border-base-200"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {sender?.firstName || "Unknown"} {sender?.lastName || ""}
                  </h3>
                  <p className="mt-1 text-sm text-base-content/70">
                    {sender?.about || "No bio available."}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-primary">
                    {request?.status || "pending"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handleRequestReview("accepted", request?._id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() =>
                      handleRequestReview("rejected", request?._id)
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-base-200 p-4 text-base-content/70">
          No requests found.
        </div>
      )}
    </div>
  );
};

export default Requests;
