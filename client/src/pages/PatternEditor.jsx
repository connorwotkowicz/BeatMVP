import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SequencerGrid from "../components/SequencerGrid";
import API from "../services/api";

const PatternEditor = () => {
  const { beatId } = useParams();

  const [title, setTitle] = useState("");
  const [pattern, setPattern] = useState(Array(4).fill().map(() => Array(16).fill(false)));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (beatId) {
      setLoading(true);
      API.get(`/beats/${beatId}`)
        .then((res) => {
          setTitle(res.data.beat.title);
          setPattern(res.data.beat.data);
          setMessage("");
        })
        .catch(() => setMessage("Failed to load beat."))
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
        setMessage("Beat updated");
      } else {
        await API.post("/beats", payload);
        setMessage("Beat saved");
      }
    } catch {
      setMessage("Failed to save beat.");
    }
  };

  if (loading) return <p className="loading-message">Loading beat...</p>;

  return (
    <div className="pattern-editor">
      <div className="editor-card">
        <h1>Editor</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
<div className="grid-container">
        <SequencerGrid pattern={pattern} onPatternChange={setPattern} />
</div>
        <button onClick={handleSave} className="save-button">
          Save
        </button>

        {message && <p className="editor-message">{message}</p>}
      </div>
    </div>
  );
};

export default PatternEditor;
