import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SequencerGrid from "../components/SequencerGrid";
import API from "../services/api";

const PatternEditor = () => {
  const { beatId } = useParams(); // For editing existing beat, if any

  const [title, setTitle] = useState("");
  const [pattern, setPattern] = useState(
    Array(4).fill().map(() => Array(16).fill(false))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing beat if editing
  useEffect(() => {
    if (beatId) {
      setLoading(true);
      API.get(`/beats/${beatId}`)
        .then((res) => {
          setTitle(res.data.beat.title);
          setPattern(res.data.beat.data);
          setMessage("");
        })
        .catch(() => setMessage("Failed to load beat"))
        .finally(() => setLoading(false));
    }
  }, [beatId]);

  const handleSave = async () => {
    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }
    setMessage("");
    try {
      const payload = { title, data: pattern };
      if (beatId) {
      
        await API.put(`/beats/${beatId}`, payload);
        setMessage("Beat updated successfully!");
      } else {
        await API.post("/beats", payload);
        setMessage("Beat saved successfully!");
      }
    } catch {
      setMessage("Failed to save beat.");
    }
  };

  if (loading) return <p>Loading beat...</p>;

  return (
    <div className="pattern-editor-container">
      <h1>🎛️ Pattern Editor</h1>

      <input
        type="text"
        placeholder="Enter beat title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="beat-title-input"
      />

      <SequencerGrid pattern={pattern} onPatternChange={setPattern} />

      <button onClick={handleSave} className="save-beat-button">
        Save Beat
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PatternEditor;
