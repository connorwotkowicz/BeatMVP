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
  const [showSaveAsNewPopup, setShowSaveAsNewPopup] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [localBeatId, setLocalBeatId] = useState(null);

  useEffect(() => {
    if (beatId) {
      setLoading(true);
      API.get(`/beats/${beatId}`)
        .then((res) => {
          setTitle(res.data.beat.title);
          setPattern(res.data.beat.data);
        })
        .catch(() => setMessage("Failed to load beat."))
        .finally(() => setLoading(false));
    }
  }, [beatId]);

  const handleSaveNew = async () => {
    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    try {
      const res = await API.post("/beats", { title, data: pattern });
      setMessage("Beat saved.");
      setLocalBeatId(res.data.beat.id);
    } catch {
      setMessage("Failed to save beat.");
    }
  };

  const handleUpdateExisting = async () => {
    try {
      await API.put(`/beats/${beatId || localBeatId}`, { title, data: pattern });
      setMessage("Beat updated.");
    } catch {
      setMessage("Failed to update beat.");
    }
  };

  const handleSaveAsNew = async () => {
    if (!newTitle.trim()) {
      setMessage("Please enter a new title.");
      return;
    }

    try {
      const res = await API.post("/beats", { title: newTitle, data: pattern });
      setMessage("Beat saved as new.");
      setShowSaveAsNewPopup(false);
      setTitle(newTitle);              
      setNewTitle("");               
      setLocalBeatId(res.data.beat.id); 
    } catch {
      setMessage("Failed to save as new.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSaveAsNew();
  };

  const isEditing = beatId || localBeatId; 

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pattern-editor">
      <div className="editor-card">
        <h1>Editor</h1>

        <div className="grid-container">
          <SequencerGrid pattern={pattern} onPatternChange={setPattern} />
        </div>

        {!isEditing ? (
          <>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
            <button onClick={handleSaveNew} className="save-button">
              Save
            </button>
          </>
        ) : (
          <>
            <button onClick={handleUpdateExisting} className="save-button">
              Update Existing
            </button>
            <button onClick={() => setShowSaveAsNewPopup(true)} className="save-button secondary">
              Save As New
            </button>
          </>
        )}

        {showSaveAsNewPopup && (
          <div className="title-popup-overlay">
            <div className="title-popup">
              <input
                type="text"
                placeholder="New title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="title-input"
                autoFocus
              />
              <button onClick={handleSaveAsNew} className="confirm-save-button">
                Confirm Save As New
              </button>
              <button onClick={() => setShowSaveAsNewPopup(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        )}

        {message && <p className="editor-message">{message}</p>}
      </div>
    </div>
  );
};

export default PatternEditor;
