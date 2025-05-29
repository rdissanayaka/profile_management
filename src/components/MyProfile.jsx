"use client";

import React, { useState } from "react";
import Navigation from "./Navigation";
import {
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Stack,
  Box,
} from "@mui/material";

function ProfileField({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body1">{value || "Not provided"}</Typography>
    </Box>
  );
}

export default function MyProfile({ user, onLogout }) {
  const baseTabs = [
    { id: "basic", label: "Basic Details" },
    { id: "additional", label: "Additional Details" },
    { id: "personal", label: "Personal Details" },
  ];

  if (user.additionalDetails?.maritalStatus === "Married") {
    baseTabs.splice(2, 0, { id: "spouse", label: "Spouse Details" });
  }

  const [activeTab, setActiveTab] = useState("basic");

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <>
            <Typography variant="h6" mb={2}>
              Basic Details
            </Typography>
            <Stack spacing={0}>
              <ProfileField
                label="Salutation"
                value={user.basicDetails?.salutation}
              />
              <ProfileField
                label="First Name"
                value={user.basicDetails?.firstName}
              />
              <ProfileField
                label="Last Name"
                value={user.basicDetails?.lastName}
              />
              <ProfileField label="Email" value={user.basicDetails?.email} />
            </Stack>
          </>
        );

      case "additional":
        return (
          <>
            <Typography variant="h6" mb={2}>
              Additional Details
            </Typography>
            <Stack spacing={0}>
              <ProfileField
                label="Home Address"
                value={user.additionalDetails?.homeAddress}
              />
              <ProfileField
                label="Country"
                value={user.additionalDetails?.country}
              />
              <ProfileField
                label="Postal Code"
                value={user.additionalDetails?.postalCode}
              />
              <ProfileField
                label="Date of Birth"
                value={user.additionalDetails?.dateOfBirth}
              />
              <ProfileField
                label="Gender"
                value={user.additionalDetails?.gender}
              />
              <ProfileField
                label="Marital Status"
                value={user.additionalDetails?.maritalStatus}
              />
            </Stack>
          </>
        );

      case "spouse":
        return (
          <>
            <Typography variant="h6" mb={2}>
              Spouse Details
            </Typography>
            <Stack spacing={0}>
              <ProfileField
                label="Salutation"
                value={user.spouseDetails?.salutation}
              />
              <ProfileField
                label="First Name"
                value={user.spouseDetails?.firstName}
              />
              <ProfileField
                label="Last Name"
                value={user.spouseDetails?.lastName}
              />
            </Stack>
          </>
        );

      case "personal":
        return (
          <>
            <Typography variant="h6" mb={2}>
              Personal Details
            </Typography>
            <Stack spacing={0}>
              <ProfileField
                label="Hobbies and Interests"
                value={user.personalDetails?.hobbies}
              />
              <ProfileField
                label="Favorite Sports"
                value={user.personalDetails?.favoriteSports}
              />
              <ProfileField
                label="Preferred Music Genres"
                value={user.personalDetails?.musicGenres}
              />
              <ProfileField
                label="Preferred Movies/TV Shows"
                value={user.personalDetails?.moviesTV}
              />
            </Stack>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="page-container">
        <Navigation user={user} onLogout={onLogout} />

        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>View your profile information</p>
          </div>

          <div className="profile-layout">
            <div className="profile-tabs">
              <div className="tabs-header">
                <h4>Sections</h4>
              </div>
              <div className="tabs-list">
                {baseTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`tab-button ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-content">
              <div className="content-card">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
