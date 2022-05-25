import useTweets from "../hooks/useTweets";
import { TweetList } from "../components/TweetList";
import { ErrorMessage } from "../components/ErrorMessage";
import useAuth from "../hooks/useAuth";
import { NewTweet } from "../components/NewTweet";

export const HomePage = () => {
  const { tweets, error, loading, addTweet, removeTweet } = useTweets();
  const { user } = useAuth();

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
