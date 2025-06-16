'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import API from '@/services/api';

const SequencerGrid = dynamic(
  () => import('@/components/SequencerGrid'),
  { ssr: false, loading: () => <div className="loading">Loading sequencer...</div> }
);

export default function PatternEditor() {
  const { beatId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [pattern, setPattern] = useState(Array(4).fill().map(() => Array(16).fill(false)));
  const [loading, setLoading] = useState(!!beatId);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showSaveAsNewPopup, setShowSaveAsNewPopup] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [localBeatId, setLocalBeatId] = useState(null);

 
  const fetchPattern = useCallback(async () => {
    if (!beatId) return;
    
    try {
      setLoading(true);
      const res = await API.get(`/beats/${beatId}`);
      setTitle(res.data.beat.title);
      setPattern(res.data.beat.data);
      setMessage({ text: '', type: '' });
    } catch (error) {
      console.error('Failed to load beat:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to load beat', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }, [beatId]);

  useEffect(() => {
    fetchPattern();
  }, [fetchPattern]);

  const handleSaveNew = useCallback(async () => {
    if (!title.trim()) {
      return setMessage({ 
        text: 'Please enter a title', 
        type: 'error' 
      });
    }
    
    try {
      const res = await API.post('/beats', { 
        title, 
        data: pattern 
      });
      setMessage({ 
        text: 'Beat saved!', 
        type: 'success' 
      });
      setLocalBeatId(res.data.beat.id);
      router.refresh();
    } catch (error) {
      console.error('Save failed:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to save beat', 
        type: 'error' 
      });
    }
  }, [title, pattern, router]);

  const handleUpdateExisting = useCallback(async () => {
    try {
      await API.put(`/beats/${beatId || localBeatId}`, { 
        title, 
        data: pattern 
      });
      setMessage({ 
        text: 'Beat updated!', 
        type: 'success' 
      });
      router.refresh();
    } catch (error) {
      console.error('Update failed:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update beat', 
        type: 'error' 
      });
    }
  }, [beatId, localBeatId, title, pattern, router]);

  const handleSaveAsNew = useCallback(async () => {
    if (!newTitle.trim()) {
      return setMessage({ 
        text: 'Please enter a new title', 
        type: 'error' 
      });
    }
    
    try {
      const res = await API.post('/beats', { 
        title: newTitle, 
        data: pattern 
      });
      setMessage({ 
        text: 'Beat saved as new!', 
        type: 'success' 
      });
      setShowSaveAsNewPopup(false);
      setTitle(newTitle);
      setNewTitle('');
      setLocalBeatId(res.data.beat.id);
      router.push(`/editor/${res.data.beat.id}`);
    } catch (error) {
      console.error('Save as new failed:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to save as new', 
        type: 'error' 
      });
    }
  }, [newTitle, pattern, router]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveAsNew();
  };

  const isEditing = beatId || localBeatId;

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading pattern...</p>
    </div>
  );

  return (
    <div className="pattern-editor">
      <div className="editor-card">
        <div className="editor-header">
          <h1>{isEditing ? 'Edit Pattern' : 'Create Pattern'}</h1>
          
          <input
            type="text"
            placeholder="Pattern title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        <div className="grid-container">
          <SequencerGrid pattern={pattern} onPatternChange={setPattern} />
        </div>

        <div className="editor-actions">
          {!isEditing ? (
            <button 
              onClick={handleSaveNew} 
              className="save-button primary"
              disabled={!title.trim()}
            >
              Save new pattern
            </button>
          ) : (
            <>
              <button 
                onClick={handleUpdateExisting} 
                className="save-button primary"
              >
                Update Existing
              </button>
              <button
                onClick={() => setShowSaveAsNewPopup(true)}
                className="save-button secondary"
              >
                Save as new
              </button>
            </>
          )}
        </div>

        {showSaveAsNewPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Save as new </h3>
              <input
                type="text"
                placeholder="New pattern title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="title-input"
                autoFocus
              />
              <div className="popup-actions">
                <button 
                  onClick={handleSaveAsNew} 
                  className="confirm-button"
                  disabled={!newTitle.trim()}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowSaveAsNewPopup(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {message.text && (
          <p className={`editor-message ${message.type}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}