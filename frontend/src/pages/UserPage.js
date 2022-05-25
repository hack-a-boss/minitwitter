import { useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import { ErrorMessage } from "../components/ErrorMessage";
import { TweetList } from "../components/TweetList";
import useTweets from "../hooks/useTweets";
import { UserTweets } from "../components/UserTweets";

export const UserPage = () => {
  const { id } = useParams();
  const { user, loading, error } = useUser(id);

  if (loading) return <p>Loading user info...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>User {user.email}</h1>
      <p>User id: {user.id}</p>
      <p>Registered on {new Date(user.created_at).toLocaleString()}</p>

      <UserTweets id={user.id} />
    </section>
  );
};
