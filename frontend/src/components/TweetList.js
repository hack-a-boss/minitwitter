import { Tweet } from "./Tweet";

export const TweetList = ({ tweets, removeTweet }) => {
  return tweets.length ? (
    <ul className="tweet-list">
      {tweets.map((tweet) => {
        return (
          <li key={tweet.id}>
            <Tweet tweet={tweet} removeTweet={removeTweet} />
          </li>
        );
      })}
    </ul>
  ) : (
    <p>There are no tweets...</p>
  );
};
