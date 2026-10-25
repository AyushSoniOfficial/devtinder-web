import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, END_POINTS } from "../config";
import { addUser } from "../store/slices/userSlice";
import UserCard from "./UserCard";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    imageUrl: "",
    age: "",
    about: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
        age: user.age || "",
        about: user.about || "",
        gender: user.gender
          ? String(user.gender).toLowerCase() === "other"
            ? "others"
            : String(user.gender).toLowerCase()
          : "",
      });
    }
  }, [user]);

  const previewUser = user
    ? {
        ...user,
        firstName: formData.firstName || user.firstName || "",
        lastName: formData.lastName || user.lastName || "",
        imageUrl: formData.imageUrl || user.imageUrl || "",
        age: formData.age || user.age || "",
        about: formData.about || user.about || "",
        gender:
          String(formData.gender || user.gender || "").toLowerCase() === "other"
            ? "others"
            : String(formData.gender || user.gender || "").toLowerCase(),
      }
    : null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        imageUrl: formData.imageUrl,
        age: Number(formData.age),
        about: formData.about,
        gender:
          String(formData.gender || "").toLowerCase() === "other"
            ? "others"
            : String(formData.gender || "").toLowerCase(),
      };

      const response = await axios.patch(
        `${BASE_URL}${END_POINTS.profileEdit}`,
        payload,
        {
          withCredentials: true,
        },
      );

      const updatedUser = response?.data?.data || response?.data;
      if (updatedUser) {
        dispatch(addUser(updatedUser));
      }

      showToast("success", "Profile updated successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong while updating profile.";

      showToast("error", message);
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="w-full xl:w-[60%]">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold mb-4">
                Edit Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <span className="label-text mb-2">First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Enter first name"
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-2">Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Enter last name"
                    />
                  </label>
                </div>

                <label className="form-control">
                  <span className="label-text mb-2">Image URL</span>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/profile.jpg"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <span className="label-text mb-2">Age</span>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Enter age"
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-2">Gender</span>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </label>
                </div>

                <label className="form-control">
                  <span className="label-text mb-2">About</span>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows="4"
                    placeholder="Write something about yourself"
                  />
                </label>

                <div className="card-actions justify-end pt-2">
                  <button
                    type="submit"
                    className="btn bg-black text-white border-black hover:bg-black hover:text-white rounded-[8px] px-6 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[40%] flex justify-center xl:justify-start pt-2">
          {previewUser ? <UserCard user={previewUser} /> : null}
        </div>
      </div>

      {toast.show && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
