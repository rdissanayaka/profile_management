import React from "react";
import Navigation from "./Navigation"

export default function Homepage({ user, onLogout }) {
  return (
    <div className="page-container">
      <Navigation user={user} onLogout={onLogout} />

      <div className="main-content">
        <div className="content-card">
          <h1>Welcome to Your Profile App</h1>
          <p>Hello, {user.userId}! This is your homepage.</p>
          <p>Use the menu to navigate to your profile or edit your details.</p>
          <p>Get started by completing your profile information in the Edit Profile section.</p>
        </div>
      </div>
    </div>
  )
}
