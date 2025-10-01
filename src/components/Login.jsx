import axios from "axios";
import { useState } from "react"
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import {  useNavigate } from "react-router-dom";

const Login = () => {

  const [email ,setEmail] = useState("sourabh@gmail.com");
  const [password ,setpassword] = useState("Sourabh@123");
  const [error ,setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin =  async () => {
    try{
      const res = await axios.post(BASE_URL+"/login" , {
        email,password,
      },
      {withCredentials:true}
    ); 
    dispatch(addUser(res.data));
    return navigate("/");
    }
    catch(err){
      setError(err?.response?.data || "something went wrong")
    } 
  }


  return (
    <div className="flex justify-center my-12">
     <div className="card bg-base-300 w-96 shadow-xl">
     <div className="card-body">
     <h2 className="card-title justify-center">Login</h2>
     <div>
     <label className="form-control w-full max-w-xs my-2">
  <div className="label">
    <span className="label-text">Email Id</span>
  </div>
  <input type="text" value={email} className="input input-bordered w-full max-w-xs"
  onChange={(e) => setEmail(e.target.value )} />
</label>
<label className="form-control w-full max-w-xs my-2">
  <div className="label">
    <span className="label-text">Password</span>
  </div>
  <input type="text" value={password} className="input input-bordered w-full max-w-xs"
  onChange={(e) => setpassword(e.target.value)} />
</label>
     </div>
     
     {error &&  <p className="text-red-600">{error}</p>}
     <div className="card-actions justify-center m-2">
     <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  </div>
</div>
    </div>
  )
}

export default Login
