// SavedBeats.jsx
import { useEffect } from "react";

export default function SavedBeats({ userBeats, onClose }) {
  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const closeOnOutsideClick = (e) => {
      if (e.target.id === "popup-overlay") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("click", closeOnOutsideClick);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("click", closeOnOutsideClick);
    };
  }, [onClose, userBeats]);

  return (
    <div id="popup-overlay" className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>🎵 Saved Beats</h3>
        {userBeats.length > 0 ? (
          <ul>
            {userBeats.map((beat) => (
              <li key={beat.id || beat._id}>
                <b>{beat.name || "Untitled Beat"}</b>
                {beat.tempo && <p>Tempo: {beat.tempo} BPM</p>}
                {beat.createdAt && (
                  <p>Saved on: {new Date(beat.createdAt).toLocaleDateString()}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven’t saved any beats yet.</p>
        )}
      </div>
    </div>
  );
}
