// src/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import { useState } from "react";
import { Box, useMediaQuery, useTheme, Fab } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Box className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        {/* Main Content */}
        <Box className="flex-1">
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Fab
          onClick={() => setMobileDrawerOpen(true)}
          className="fixed! bottom-6! right-6! bg-blue-600! hover:bg-blue-700! text-white! shadow-lg!"
          aria-label="filters"
        >
          <FilterIcon />
        </Fab>
      )}
    </Box>
  );
}

export default Layout;
