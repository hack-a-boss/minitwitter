import { useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import { ErrorMessage } from "../components/ErrorMessage";
import { UserTweets } from "../components/UserTweets";
import { Loading } from "../components/Loading";

export const UserPage = () => {
  const { id } = useParams();
  const { user, loading, error } = useUser(id);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>User {user.email}</h1>
      <section class="user-data">
        <p>User id: {user.id}</p>
        <p>Registered on {new Date(user.created_at).toLocaleString()}</p>
      </section>
      <UserTweets id={user.id} />
    </section>
  );
};
