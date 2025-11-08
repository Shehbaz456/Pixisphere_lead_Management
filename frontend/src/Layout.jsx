// src/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import { useState } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [5000, 20000],
    ratings: [4, 3, 2],
    styles: ['Traditional', 'Candid', 'Studio', 'Outdoor'],
    city: 'Bengaluru',
  });

  const [sortBy, setSortBy] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Desktop Sidebar */}
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            transition: 'margin-left 0.3s ease',
            marginLeft: isMobile ? 0 : (isCollapsed ? '0px' : '0px'),
            backgroundColor: 'var(--bg-secondary)',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* Mobile Filter Button */}
          {isMobile && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
              }}
            >
              <IconButton
                onClick={() => setMobileDrawerOpen(true)}
                sx={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  width: 56,
                  height: 56,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: 'var(--brand-primary-dark)',
                  },
                }}
              >
                <FilterIcon />
              </IconButton>
            </Box>
          )}

          <Outlet context={{ filters, sortBy, darkMode }} />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
