import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { sendTweetService } from "../services";

export const NewTweet = ({ addTweet }) => {
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(e.target);
      const tweet = await sendTweetService({ data, token });

      addTweet(tweet);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <section>
      <h1>Add new Tweet</h1>
      <form onSubmit={handleForm}>
        <fieldset>
          <label htmlFor="text">Text</label>
          <input type="text" name="text" id="text" required />
        </fieldset>
        <fieldset>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept={"image/*"}
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image ? (
            <figure>
              <img
                src={URL.createObjectURL(image)}
                style={{ width: "100px" }}
              />
            </figure>
          ) : null}
        </fieldset>
        <button>Send tweet</button>
        {error ? <p>{error}</p> : null}
        {loading ? <p>posting tweet...</p> : null}
      </form>
    </section>
  );
};
