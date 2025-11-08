
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Slider,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { setFilters, setSortBy } from '../store/photographerSlice';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.photographers.filters);
  const sortBy = useSelector((state) => state.photographers.sortBy);

  const handlePriceChange = (event, newValue) => {
    dispatch(setFilters({ ...filters, priceRange: newValue }));
  };

  const handleRatingChange = (rating) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    dispatch(setFilters({ ...filters, ratings: newRatings }));
  };

  const handleStyleChange = (style) => {
    const newStyles = filters.styles.includes(style)
      ? filters.styles.filter((s) => s !== style)
      : [...filters.styles, style];
    dispatch(setFilters({ ...filters, styles: newStyles }));
  };

  if (isMobile) {
    return null;
  }

  return (
    <>
      {isCollapsed && (
        <Paper
          elevation={0}
          className="w-16 min-h-screen sticky top-16 bg-gray-200 border-r border-gray-300 flex flex-col items-center pt-4"
        >
          <IconButton
            onClick={() => setIsCollapsed(false)}
            size="small"
            className="text-gray-600 hover:bg-gray-300"
          >
            <ChevronRightIcon />
          </IconButton>
        </Paper>
      )}

      {!isCollapsed && (
        <Paper
          elevation={0}
          className="w-80 min-h-screen sticky top-16 bg-gray-200 border-r border-gray-300 transition-all duration-300 flex flex-col"
          style={{ backgroundColor: '#e5e5e5' }}
        >
          <div className="flex justify-end p-4 pb-2">
            <IconButton
              onClick={() => setIsCollapsed(true)}
              size="small"
              className="text-gray-600 hover:bg-gray-300"
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <div className="px-6 pb-6 w-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4 text-lg">
              Advanced Filters
            </Typography>

            {/* Price Range */}
            <div className="mb-4">
              <FormLabel className="text-gray-800! font-semibold! text-sm! mb-4! block!">
                Price
              </FormLabel>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={5000}
                max={20000}
                step={500}
                valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                className="text-blue-600!"
              />
              <div className="flex justify-between mt-2">
                <Typography variant="body2" className="text-gray-600 text-sm">
                  ₹{filters.priceRange[0].toLocaleString()}
                </Typography>
                <Typography variant="body2" className="text-gray-600 text-sm">
                  ₹{filters.priceRange[1].toLocaleString()}
                </Typography>
              </div>
            </div>

            <Divider className="mb-4!" />

            {/* Rating */}
            <div className="mb-4">
              <FormLabel className="text-gray-800! font-semibold! text-sm! mb-3! block">
                Rating
              </FormLabel>
              <FormGroup>
                <div className="flex flex-row justify-around items-center gap-1">
                  {[
                    { value: 4, label: '4+' },
                    { value: 3, label: '3+' },
                    { value: 2, label: '2+' },
                  ].map((rating) => (
                    <FormControlLabel
                      key={rating.value}
                      control={
                        <Checkbox
                          checked={filters.ratings.includes(rating.value)}
                          onChange={() => handleRatingChange(rating.value)}
                          className="text-gray-600 p-1.5"
                        />
                      }
                      label={
                        <Typography className="text-sm text-gray-700">
                          {rating.label}
                        </Typography>
                      }
                      className="m-0!"
                    />
                  ))}
                </div>
              </FormGroup>
            </div>

            <Divider className="mb-4!" />

            {/* Styles */}
            <div className="mb-4">
              <FormLabel className="text-gray-800! font-semibold! text-sm! mb-3! block">
                Styles
              </FormLabel>
              <FormGroup>
                <div className="flex flex-wrap gap-0">
                  {[
                    { value: 'Traditional', label: 'Traditional' },
                    { value: 'Candid', label: 'Candid' },
                    { value: 'Studio', label: 'Studio' },
                    { value: 'Outdoor', label: 'Outdoor' },
                  ].map((style) => (
                    <div key={style.value} className="w-1/2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.styles.includes(style.value)}
                            onChange={() => handleStyleChange(style.value)}
                            className="text-gray-600 p-1.5"
                          />
                        }
                        label={
                          <Typography className="text-sm text-gray-700">
                            {style.label}
                          </Typography>
                        }
                        className="m-0 mb-1"
                      />
                    </div>
                  ))}
                </div>
              </FormGroup>
            </div>

            <Divider className="mb-4!" />

            {/* City */}
            <div className="mb-4!">
              <FormLabel className="text-gray-800! font-semibold! text-sm! mb-3! block!">
                City
              </FormLabel>
              <Select
                fullWidth
                value={filters.city}
                onChange={(e) => dispatch(setFilters({ ...filters, city: e.target.value }))}
                className="text-sm text-gray-700 bg-white"
              >
                <MenuItem value="all">All Cities</MenuItem>
                <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
                <MenuItem value="Pune">Pune</MenuItem>
                <MenuItem value="Kolkata">Kolkata</MenuItem>
              </Select>
            </div>

            <Divider className="mb-4!" />

            {/* Sort */}
            <div className="mb-2!">
              <FormLabel className="text-gray-800! font-semibold! text-sm! mb-3! block!">
                Sort
              </FormLabel>
              <Select
                fullWidth
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                displayEmpty
                className="text-s! text-gray-700! bg-white!"
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating: High to Low</MenuItem>
                <MenuItem value="recent">Recently Added</MenuItem>
              </Select>
            </div>
          </div>
        </Paper>
      )}
    </>
  );
};

export default Sidebar;
