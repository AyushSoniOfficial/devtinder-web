const UserCard = ({ user }) => {
  if (!user) return null;

  const {
    firstName = "",
    lastName = "",
    imageUrl,
    about = "",
    age,
    gender,
  } = user;

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={
            imageUrl ||
            "https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg"
          }
          alt={`${firstName} ${lastName} image`}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center m-2 gap-4">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Intrested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
