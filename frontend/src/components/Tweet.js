import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { deleteTweetService } from "../services";

export const Tweet = ({ tweet, removeTweet }) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [error, setError] = useState("");

  const deleteTweet = async (id) => {
    try {
      await deleteTweetService({ id, token });

      if (removeTweet) {
        removeTweet(id);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <article>
      <p>{tweet.text}</p>
      {tweet.image ? (
        <img
          src={`${process.env.REACT_APP_BACKEND}/uploads/${tweet.image}`}
          alt={tweet.text}
        />
      ) : null}
      <p>
        By <Link to={`/user/${tweet.user_id}`}>{tweet.email}</Link> on{" "}
        <Link to={`/tweet/${tweet.id}`}>
          {new Date(tweet.created_at).toLocaleString()}
        </Link>
      </p>
      {user && user.id === tweet.user_id ? (
        <section>
          <button onClick={() => deleteTweet(tweet.id)}>Delete tweet</button>
          {error ? <p>{error}</p> : null}
        </section>
      ) : null}
    </article>
  );
};