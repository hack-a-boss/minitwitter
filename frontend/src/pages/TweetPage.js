import { useParams } from "react-router-dom";
import useTweet from "../hooks/useTweet";
import { Tweet } from "../components/Tweet";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";

export const TweetPage = () => {
  const { id } = useParams();
  const { tweet, error, loading } = useTweet(id);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>Tweet</h1>
      <Tweet tweet={tweet} />
    </section>
  );
};
