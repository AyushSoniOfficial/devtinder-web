import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, END_POINTS } from "../config";
import { addConnections } from "../store/slices/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}${END_POINTS.connections}`, {
        withCredentials: true,
      });

      console.log("connections res.data", res.data);
      const data = res?.data?.data || [];
      dispatch(addConnections(data));
    } catch (error) {
      console.log(
        "Error fetching connections:",
        error?.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Connections</h2>

      {connections?.length ? (
        <div className="space-y-4">
          {connections.map((connection, index) => (
            <div
              key={connection?._id || index}
              className="flex items-center gap-4 rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm"
            >
              <img
                src={
                  connection?.imageUrl ||
                  "https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg"
                }
                alt={`${connection?.firstName || "User"} ${connection?.lastName || ""}`}
                className="h-20 w-20 rounded-full object-cover border-2 border-base-200"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {connection?.firstName} {connection?.lastName}
                </h3>
                <p className="mt-1 text-sm text-base-content/70">
                  {connection?.about || "No bio available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-base-200 p-4 text-base-content/70">
          No connections found.
        </div>
      )}
    </div>
  );
};

export default Connections;
