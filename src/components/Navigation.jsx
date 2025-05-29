"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navigation({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/homepage", label: "Homepage" },
    { path: "/myprofile", label: "My Profile" },
    { path: "/editprofile", label: "Edit Profile" },
  ];

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div" className="logo-img" sx={{ userSelect: "none" }}>
            <img src="/logo.png" height={50} />
          </Typography>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsMenuOpen(true)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setIsMenuOpen(false)} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          <List>
            {menuItems.map((item) => (
              <ListItemButton
                component={Link}
                to={item.path}
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => setIsMenuOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "error.main" }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
