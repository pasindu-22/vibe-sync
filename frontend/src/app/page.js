'use client';

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [trackUrl, setTrackUrl] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://127.0.0.1:8000/classify?track_url=${trackUrl}`);
      setResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Music Genre and Mood Classifier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={trackUrl}
          onChange={(e) => setTrackUrl(e.target.value)}
          placeholder="Enter Music Track URL"
        />
        <button type="submit">Classify</button>
      </form>

      {response && (
        <div>
          <h2>Classification Result</h2>
          <p>Track: {response.track}</p>
          <p>Genre: {response.genre}</p>
          <p>Mood: {response.mood}</p>
        </div>
      )}
    </div>
  );
}
