import useTweets from "../hooks/useTweets";
import { ErrorMessage } from "./ErrorMessage";
import { TweetList } from "./TweetList";

export const UserTweets = ({ id }) => {
  const { tweets, loading, error, removeTweet } = useTweets(id);

  if (loading) return <p>Loading tweets...</p>;
  if (error) return <ErrorMessage message={error} />;

  return <TweetList tweets={tweets} removeTweet={removeTweet} />;
};
