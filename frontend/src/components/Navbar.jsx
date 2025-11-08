// // src/components/Navbar.jsx
// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   InputBase,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Search as SearchIcon,
//   Brightness4,
//   Brightness7,
//   Close as CloseIcon,
// } from '@mui/icons-material';
// import { setSearchQuery, clearSearch } from '../store/photographerSlice';

// const Navbar = ({ darkMode, toggleDarkMode }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchQuery = useSelector((state) => state.photographers.searchQuery);
//   const debounceTimer = useRef(null);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Debounced search function
//   const debouncedSearch = useCallback((value) => {
//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }

//     debounceTimer.current = setTimeout(() => {
//       dispatch(setSearchQuery(value));
      
//       // Navigate to photographers page if not already there
//       if (location.pathname !== '/photographers') {
//         navigate('/photographers');
//       }
//     }, 300); // 300ms debounce delay
//   }, [dispatch, location.pathname, navigate]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//     };
//   }, []);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);
//     debouncedSearch(value);
//   };

//   const handleClearSearch = () => {
//     setInputValue('');
//     dispatch(clearSearch());
//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }
//   };

//   return (
//     <>
//       <AppBar position="sticky" className="shadow-sm" elevation={0} style={{ backgroundColor: '#e5e5e5' }}>
//         <Toolbar className="justify-between px-4 md:px-6 lg:px-8 py-2">
//           {/* Left: Logo/Title */}
//           <Box className="flex items-center min-w-[150px]">
//             <Typography
//               variant="h5"
//               component="div"
//               className="font-bold text-2xl text-gray-800 cursor-pointer"
//               onClick={() => navigate('/photographers')}
//             >
//               Pixisphere
//             </Typography>
//           </Box>

//           {/* Center: Search Bar (Desktop & Tablet) */}
//           {!isMobile && (
//             <Box className="flex-1 max-w-2xl mx-8">
//               <Box className="flex items-center rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 transition-all">
//                 <SearchIcon className="text-gray-500 text-2xl" />
//                 <InputBase
//                   placeholder="Search by name, location, or tag..."
//                   className="ml-3 flex-1 text-gray-900"
//                   value={inputValue}
//                   onChange={handleSearchChange}
//                 />
//                 {inputValue && (
//                   <IconButton size="small" onClick={handleClearSearch}>
//                     <CloseIcon className="text-gray-500 text-lg!" />
//                   </IconButton>
//                 )}
//               </Box>
//             </Box>
//           )}

//           {/* Right: Dark Mode Toggle */}
//           <Box className="flex items-center gap-2 min-w-[150px] justify-end">
//             <IconButton
//               onClick={toggleDarkMode}
//               className="text-gray-700 hover:bg-gray-300"
//             >
//               {darkMode ? <Brightness7 /> : <Brightness4 />}
//             </IconButton>

//             {/* Hamburger Menu (Mobile) */}
//             {isMobile && (
//               <IconButton
//                 onClick={handleDrawerToggle}
//                 className="text-gray-900"
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}
//           </Box>
//         </Toolbar>

//         {/* Mobile Search Bar */}
//         {isMobile && (
//           <Box className="px-4 pb-3">
//             <Box className="flex items-center rounded-full px-4 py-2.5 bg-white border border-gray-300">
//               <SearchIcon className="text-gray-500" />
//               <InputBase
//                 placeholder="Search photographers..."
//                 className="ml-3 flex-1 text-gray-900"
//                 value={inputValue}
//                 onChange={handleSearchChange}
//               />
//               {inputValue && (
//                 <IconButton size="small" onClick={handleClearSearch}>
//                   <CloseIcon className="text-gray-500 text-sm!" />
//                 </IconButton>
//               )}
//             </Box>
//           </Box>
//         )}
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         className="md:hidden"
//       >
//         <Box className="w-64 h-full bg-white" onClick={handleDrawerToggle}>
//           <List>
//             <ListItem className="justify-center py-4">
//               <Typography variant="h6" className="font-bold text-gray-900">
//                 Menu
//               </Typography>
//             </ListItem>
//           </List>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;







// src/components/Navbar.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Drawer,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Brightness4,
  Brightness7,
  Close as CloseIcon,
} from '@mui/icons-material';
import { setSearchQuery, clearSearch } from '../store/photographerSlice';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // REMOVED: const searchQuery = useSelector((state) => state.photographers.searchQuery);
  const debounceTimer = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Debounced search function
  const debouncedSearch = useCallback((value) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      dispatch(setSearchQuery(value));
      
      // Navigate to photographers page if not already there
      if (location.pathname !== '/photographers') {
        navigate('/photographers');
      }
    }, 300); // 300ms debounce delay
  }, [dispatch, location.pathname, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue('');
    dispatch(clearSearch());
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  return (
    <>
      <AppBar position="sticky" className="shadow-sm" elevation={0} style={{ backgroundColor: '#e5e5e5' }}>
        <Toolbar className="justify-between px-4 md:px-6 lg:px-8 py-2">
          {/* Left: Logo/Title */}
          <Box className="flex items-center min-w-[150px]">
            <Typography
              variant="h5"
              component="div"
              className="font-bold text-2xl text-gray-800 cursor-pointer"
              onClick={() => navigate('/photographers')}
            >
              Pixisphere
            </Typography>
          </Box>

          {/* Center: Search Bar (Desktop & Tablet) */}
          {!isMobile && (
            <Box className="flex-1 max-w-2xl mx-8">
              <Box className="flex items-center rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 transition-all">
                <SearchIcon className="text-gray-500 text-2xl" />
                <InputBase
                  placeholder="Search by name, location, or tag..."
                  className="ml-3 flex-1 text-gray-900"
                  value={inputValue}
                  onChange={handleSearchChange}
                />
                {inputValue && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <CloseIcon className="text-gray-500 text-lg!" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}

          {/* Right: Dark Mode Toggle */}
          <Box className="flex items-center gap-2 min-w-[150px] justify-end">
            <IconButton
              onClick={toggleDarkMode}
              className="text-gray-700 hover:bg-gray-300"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Hamburger Menu (Mobile) */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                className="text-gray-900"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && (
          <Box className="px-4 pb-3">
            <Box className="flex items-center rounded-full px-4 py-2.5 bg-white border border-gray-300">
              <SearchIcon className="text-gray-500" />
              <InputBase
                placeholder="Search photographers..."
                className="ml-3 flex-1 text-gray-900"
                value={inputValue}
                onChange={handleSearchChange}
              />
              {inputValue && (
                <IconButton size="small" onClick={handleClearSearch}>
                  <CloseIcon className="text-gray-500 text-sm!" />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="md:hidden"
      >
        <Box className="w-64 h-full bg-white" onClick={handleDrawerToggle}>
          <List>
            <ListItem className="justify-center py-4">
              <Typography variant="h6" className="font-bold text-gray-900">
                Menu
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
