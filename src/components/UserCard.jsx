import React from 'react'

function UserCard({user}) {
    // console.log(feed);
    const {firstName ,lastName , about ,age ,gender ,photoUrl} = user;
  return (
      <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary">Rejected</button>
      <button className="btn btn-secondary">Interested</button>
    </div>
  </div>
</div>
  )
}

export default UserCard
