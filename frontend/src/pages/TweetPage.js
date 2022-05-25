import { useParams } from "react-router-dom";
import useTweet from "../hooks/useTweet";
import { Tweet } from "../components/Tweet";
import { ErrorMessage } from "../components/ErrorMessage";

export const TweetPage = () => {
  const { id } = useParams();
  const { tweet, error, loading } = useTweet(id);

  if (loading) return <p>Loading tweets...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>Tweet</h1>
      <Tweet tweet={tweet} />
    </section>
  );
};
