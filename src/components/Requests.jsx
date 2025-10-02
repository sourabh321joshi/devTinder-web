import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestSlice';
import { Link } from 'react-router-dom';

function Requests() {
    const requests = useSelector(store => store.requests)
    const dispatch = useDispatch();

    const fetchRequests = async ()=> {
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received" , {withCredentials:true})
            dispatch(addRequests(res.data.data))
        }
        catch(err) {
            console.error(err.response.data)
        }
    }

    useEffect(() => {
        fetchRequests();
    },[])

   if (!requests) return;
  
    if (requests.length === 0) return <h1> No requests found</h1>;
  
    return (
      <div className="text-center my-10">
        <h1 className="text-bold text-white text-3xl">Requests</h1>
  
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;
  
          return (
            <div
              key={_id}
              className="flex m-4 p-4 justify-between items-center rounded-lg bg-base-300 w-1/2 mx-auto"
            >
              <div>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoUrl}
                />
              </div>
              <div className="text-left mx-4 ">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <div>
                <button className="btn btn-primary mx-4">Reject</button>
                <button className="btn btn-secondary mx-4">Accept</button>
              </div>
              <Link to={"/chat/" + _id}>
                <button className="btn btn-primary mx-4">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    );
}

export default Requests
