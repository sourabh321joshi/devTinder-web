import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

function Requests() {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewResquest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length === 0)
    return (
      <h1 className="text-center mt-10 text-gray-300">No Requests Found</h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-white text-3xl mb-8">Requests</h1>

      <div className="flex flex-col gap-6 items-center">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-6 bg-base-300 w-full max-w-3xl mx-auto rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Left: Image */}
              <img
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                src={photoUrl}
              />

              {/* Center: Text */}
              <div className="text-left text-gray-200">
                <h2 className="font-semibold text-xl text-white">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-400">{`${age}, ${gender}`}</p>
                )}
                <p className="text-sm mt-1 text-gray-300">{about}</p>
              </div>

              {/* Right: Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => reviewResquest("rejected", request._id)}
                  className="btn btn-primary mx-4"
                >
                  Reject
                </button>
                <button
                  onClick={() => reviewResquest("accepted", request._id)}
                  className="btn btn-secondary mx-4"
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Requests;
