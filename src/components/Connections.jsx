import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0) return <h1 className="text-center mt-10 text-gray-300">No Connections Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-white text-3xl mb-8">Connections</h1>

      <div className="flex flex-col gap-6 items-center">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-6 bg-base-300 w-full max-w-3xl mx-auto rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
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

              {/* Right: Chat Button */}
              <Link to={"/chat/" + _id}>
                <button className="btn btn-primary px-6 py-2 rounded-lg hover:scale-105 transition-transform duration-200">
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
