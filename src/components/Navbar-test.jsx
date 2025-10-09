// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import { FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext) || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Profile menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => setAnchorEl(null);

  // Go to dashboard
  const handleDashboardClick = () => {
    handleProfileClose();
    const path = user?.role === "admin" ? "/admin-dashboard" : "/student-dashboard";
    navigate(path);
  };

  // Logout
  const handleLogout = async () => {
    if (logout) await logout();
    handleProfileClose();
    navigate("/login", { replace: true });
  };

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contactus" },
    { name: "Blog", path: "/blog" },
    { name: "Hire Talent", path: "/registration" },
  ];

  return (
    <AppBar position="fixed" color="primary" sx={{ boxShadow: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}
        >
          TalentPool
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {menuLinks.map((link, i) => (
            <Button
              key={i}
              component={RouterLink}
              to={link.path}
              sx={{ color: "white", textTransform: "none" }}
            >
              {link.name}
            </Button>
          ))}
        </Box>

        {/* User / Auth Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* ✅ Show user menu if logged in */}
          {!loading && user ? (
            <>
              <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                <Avatar>
                  {(user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                keepMounted
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle1">
                      {user.name || user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.role || "user"}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleDashboardClick}>
                  <FaTachometerAlt style={{ marginRight: 8 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : !loading ? (
            // ✅ Show login/signup if NOT logged in
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="inherit"
              >
                Log in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
              >
                Sign up
              </Button>
            </Box>
          ) : (
            // ✅ Loading state
            <Typography variant="body2">Loading...</Typography>
          )}

          {/* Mobile menu button */}
          <IconButton
            edge="end"
            sx={{ display: { md: "none" }, color: "white" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            p: 2,
            backgroundColor: "primary.main",
          }}
        >
          {menuLinks.map((link, i) => (
            <Button
              key={i}
              component={RouterLink}
              to={link.path}
              sx={{
                color: "white",
                textAlign: "left",
                justifyContent: "flex-start",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Button>
          ))}
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
