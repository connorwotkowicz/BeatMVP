'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import API from '@/services/api';

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [userBeats, setUserBeats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (!user.id) {
      router.push('/login');
      return;
    }

    const fetchUserBeats = async () => {
      try {
        const response = await API.get('/beats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBeats(response?.data?.beats || []);
      } catch (error) {
        console.error('Error fetching beats:', error);
      }
    };

    fetchUserBeats();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div className="account-page">Loading your account...</div>;

  return (
    <div className="account-page">
      <section className="stripe default greeting-stripe">
        <div className="account-wrapper greeting-wrap">
          <h2 className="account-title">BeatDash</h2>
          <hr
            style={{
              border: 'none',
              height: '1px',
              backgroundColor: '#ccc',
              margin: '0.5rem 0',
              width: '100%',
            }}
          />
          <button className="signout-button" onClick={handleLogout}>
            Sign out
          </button>
          <h2 className="greeting">Hi, {user.name || user.email}.</h2>
          <p className="sub-greeting">You’re signed in with {user.email}</p>
        </div>
      </section>

      <section className="stripe grey">
        <div className="account-wrapper">
          <div className="purchases-section">
            <h3>Your Saved Beats</h3>
            <div className="purchase-grid">
              {userBeats.length === 0 ? (
                <p>You haven’t saved any beats yet.</p>
              ) : (
                userBeats.map((beat) => (
                  <Link
                    key={beat.id}
                    href={`/pattern-editor/${beat.id}`}
                    className="album-card"
                  >
                    <div className="title">{beat.title}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="stripe default">
        <div className="account-wrapper">
          <div className="quick-links">
            <div className="quick-card">
              <h4>Go to Sequencer</h4>
              <p>Edit a new pattern</p>
              <Link href="/editor">Launch Sequencer</Link>
            </div>
            <div className="quick-card">
              <h4>Account Settings</h4>
              <p>View or edit login info</p>
              <Link href="/account/settings">Manage Account</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stripe grey">
        <div className="account-wrapper">
          <div className="account-settings">
            <h3>Account Info</h3>
            <div className="settings-columns">
              <div className="settings-block">
                <h4>Email</h4>
                <p>{user.email}</p>
                <Link href="/account/settings">Edit</Link>
              </div>
              <div className="settings-block">
                <h4>Password</h4>
                <p>********</p>
                <Link href="/account/settings">Change</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
