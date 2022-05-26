import useTweets from "../hooks/useTweets";
import { TweetList } from "../components/TweetList";
import { ErrorMessage } from "../components/ErrorMessage";
import { NewTweet } from "../components/NewTweet";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const HomePage = () => {
  const { tweets, error, loading, addTweet, removeTweet } = useTweets();
  const { user } = useContext(AuthContext);

  if (loading) return <p>Loading tweets...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>Latest tweets</h1>
      {user ? <NewTweet addTweet={addTweet} /> : null}
      <TweetList tweets={tweets} removeTweet={removeTweet} />
    </section>
  );
};
