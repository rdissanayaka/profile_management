"use client";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navigation from "./Navigation";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Alert,
} from "@mui/material";

export default function EditProfile({ user, onLogout, onUpdateProfile }) {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      basicDetails: { ...user.basicDetails },
      additionalDetails: { ...user.additionalDetails },
      spouseDetails: { ...user.spouseDetails },
      personalDetails: { ...user.personalDetails },
    },
  });

  const watchedMaritalStatus = watch("additionalDetails.maritalStatus");

  const tabs = [
    { id: "basic", label: "Basic Details" },
    { id: "additional", label: "Additional Details" },
    { id: "personal", label: "Personal Details" },
  ];

  // Add spouse tab if user is married
  if (watchedMaritalStatus === "Married") {
    tabs.splice(2, 0, { id: "spouse", label: "Spouse Details" });
  }

  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return true;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 17;
    }
    return age >= 17;
  };

  const getRequiredFields = (tabId) => {
    switch (tabId) {
      case "basic":
        return [
          "basicDetails.salutation",
          "basicDetails.firstName",
          "basicDetails.lastName",
          "basicDetails.email",
        ];
      case "additional":
        return ["additionalDetails.homeAddress", "additionalDetails.country"];
      case "spouse":
        return watchedMaritalStatus === "Married"
          ? [
              "spouseDetails.salutation",
              "spouseDetails.firstName",
              "spouseDetails.lastName",
            ]
          : [];
      case "personal":
        return [];
      default:
        return [];
    }
  };

  const isTabValid = (tabId, currentData) => {
    const requiredFields = getRequiredFields(tabId);
    return requiredFields.every((field) => {
      const value = field
        .split(".")
        .reduce((obj, key) => obj?.[key], currentData);
      return value && value.trim() !== "";
    });
  };

  const onSubmit = (data) => {
    const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

    if (currentTabIndex < tabs.length - 1) {
      // Move to next tab
      setActiveTab(tabs[currentTabIndex + 1].id);
    } else {
      // Save all data
      const updatedUser = {
        ...user,
        ...data,
      };
      onUpdateProfile(updatedUser);
      alert("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    const originalData = {
      basicDetails: { ...user.basicDetails },
      additionalDetails: { ...user.additionalDetails },
      spouseDetails: { ...user.spouseDetails },
      personalDetails: { ...user.personalDetails },
    };
    reset(originalData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <Box className="tab-content" sx={{ p: 0 }}>
            <Typography variant="h5" gutterBottom>
              Basic Details
            </Typography>

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.basicDetails?.salutation}
              required
            >
              <InputLabel id="salutation-label">Salutation</InputLabel>
              <Select
                labelId="salutation-label"
                id="salutation"
                label="Salutation"
                defaultValue=""
                {...register("basicDetails.salutation", {
                  required: "Salutation is required",
                })}
                value={watch("basicDetails.salutation") || ""}
                {...register("basicDetails.salutation")}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
              </Select>
              {errors.basicDetails?.salutation && (
                <FormHelperText>
                  {errors.basicDetails.salutation.message}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              id="firstName"
              label="First Name *"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.basicDetails?.firstName}
              helperText={errors.basicDetails?.firstName?.message}
              {...register("basicDetails.firstName", {
                required: "First name is required",
              })}
            />

            <TextField
              id="lastName"
              label="Last Name *"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.basicDetails?.lastName}
              helperText={errors.basicDetails?.lastName?.message}
              {...register("basicDetails.lastName", {
                required: "Last name is required",
              })}
            />

            <TextField
              id="email"
              label="Email *"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.basicDetails?.email}
              helperText={errors.basicDetails?.email?.message}
              {...register("basicDetails.email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </Box>
        );
      case "additional":
        return (
          <Box className="tab-content" sx={{ p: 0 }}>
            <Typography variant="h5" gutterBottom>
              Additional Details
            </Typography>

            <TextField
              id="homeAddress"
              label="Home Address *"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              error={!!errors.additionalDetails?.homeAddress}
              helperText={errors.additionalDetails?.homeAddress?.message}
              {...register("additionalDetails.homeAddress", {
                required: "Home address is required",
              })}
            />

            <TextField
              id="country"
              label="Country *"
              fullWidth
              margin="normal"
              error={!!errors.additionalDetails?.country}
              helperText={errors.additionalDetails?.country?.message}
              {...register("additionalDetails.country", {
                required: "Country is required",
              })}
              value={watch("additionalDetails.country") || ""}
              {...register("additionalDetails.country")}
            />

            <TextField
              id="postalCode"
              label="Postal Code"
              fullWidth
              margin="normal"
              {...register("additionalDetails.postalCode")}
              value={watch("additionalDetails.postalCode") || ""}
              {...register("additionalDetails.postalCode")}
            />

            <TextField
              id="dateOfBirth"
              label="Date of Birth (min. 17 years old)"
              type="date"
              fullWidth
              margin="normal"
              slotProps={{ shrink: true }}
              error={!!errors.additionalDetails?.dateOfBirth}
              helperText={errors.additionalDetails?.dateOfBirth?.message}
              {...register("additionalDetails.dateOfBirth", {
                validate: (value) =>
                  !value ||
                  validateAge(value) ||
                  "Must be at least 17 years old",
              })}
              value={watch("additionalDetails.dateOfBirth") || ""}
              {...register("additionalDetails.dateOfBirth")}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                label="Gender"
                value={watch("additionalDetails.gender") || ""}
                {...register("additionalDetails.gender")}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="maritalStatus-label">Marital Status</InputLabel>
              <Select
                labelId="maritalStatus-label"
                id="maritalStatus"
                label="Marital Status"
                defaultValue=""
                value={watch("additionalDetails.maritalStatus") || ""}
                {...register("additionalDetails.maritalStatus")}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case "spouse":
        return (
          <Box className="tab-content" sx={{ p: 0 }}>
            <Typography variant="h5" gutterBottom>
              Spouse Details
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              Please provide your spouse's basic information.
            </Alert>

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.spouseDetails?.salutation}
            >
              <InputLabel id="spouseSalutation-label">Salutation</InputLabel>
              <Select
                labelId="spouseSalutation-label"
                id="spouseSalutation"
                label="Salutation *"
                defaultValue=""
                {...register("spouseDetails.salutation", {
                  required: "Spouse salutation is required",
                })}
                value={watch("spouseDetails.salutation") || ""}
                {...register("spouseDetails.salutation")}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
              </Select>
              {errors.spouseDetails?.salutation && (
                <FormHelperText>
                  {errors.spouseDetails.salutation.message}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              id="spouseFirstName"
              label="First Name *"
              fullWidth
              margin="normal"
              error={!!errors.spouseDetails?.firstName}
              helperText={errors.spouseDetails?.firstName?.message}
              {...register("spouseDetails.firstName", {
                required: "Spouse first name is required",
              })}
              value={watch("spouseDetails.firstName") || ""}
              {...register("spouseDetails.firstName")}
            />

            <TextField
              id="spouseLastName"
              label="Last Name *"
              fullWidth
              margin="normal"
              error={!!errors.spouseDetails?.lastName}
              helperText={errors.spouseDetails?.lastName?.message}
              {...register("spouseDetails.lastName", {
                required: "Spouse last name is required",
              })}
              value={watch("spouseDetails.lastName") || ""}
              {...register("spouseDetails.lastName")}
            />
          </Box>
        );

      case "personal":
        return (
          <Box className="tab-content" sx={{ p: 0 }}>
            <Typography variant="h5" gutterBottom>
              Personal Details
            </Typography>

            <TextField
              id="hobbies"
              label="Hobbies and Interests"
              multiline
              fullWidth
              minRows={3}
              placeholder="Tell us about your hobbies"
              margin="normal"
              {...register("personalDetails.hobbies")}
              value={watch("personalDetails.hobbies") || ""}
              {...register("personalDetails.hobbies")}
            />

            <TextField
              id="favoriteSports"
              label="Favorite Sports"
              fullWidth
              placeholder="e.g., Football, Basketball, Tennis"
              margin="normal"
              {...register("personalDetails.favoriteSports")}
              value={watch("personalDetails.favoriteSports") || ""}
              {...register("personalDetails.favoriteSports")}
            />

            <TextField
              id="musicGenres"
              label="Preferred Music Genres"
              fullWidth
              placeholder="e.g., Rock, Pop, Classical"
              margin="normal"
              {...register("personalDetails.musicGenres")}
              value={watch("personalDetails.musicGenres") || ""}
              {...register("personalDetails.musicGenres")}
            />

            <TextField
              id="moviesTV"
              label="Preferred Movies/TV Shows"
              fullWidth
              placeholder="e.g., Action, Comedy, Drama"
              margin="normal"
              {...register("personalDetails.moviesTV")}
              value={watch("personalDetails.moviesTV") || ""}
              {...register("personalDetails.moviesTV")}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <Navigation user={user} onLogout={onLogout} />

      <div className="profile-container">
        <div className="profile-header">
          <h1>Edit Profile</h1>
          <p>Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-layout">
            <div className="profile-tabs">
              <div className="tabs-header">
                <h4>Sections</h4>
              </div>
              <div className="tabs-list">
                {tabs.map((tab) => (
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
              <div className="content-card">
                {renderTabContent()}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isTabValid(activeTab, watch())}
                  >
                    {activeTab === tabs[tabs.length - 1].id
                      ? "Save"
                      : "Save & Next"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="mandatory-fields">* Mandatory field</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
