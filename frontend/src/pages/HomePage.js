import useTweets from "../hooks/useTweets";
import { TweetList } from "../components/TweetList";
import { ErrorMessage } from "../components/ErrorMessage";
import { NewTweet } from "../components/NewTweet";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";

export const HomePage = () => {
  const { tweets, error, loading, addTweet, removeTweet } = useTweets();
  const { user } = useContext(AuthContext);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      {user ? <NewTweet addTweet={addTweet} /> : null}
      <h1>Latest tweets</h1>
      <TweetList tweets={tweets} removeTweet={removeTweet} />
    </section>
  );
};
