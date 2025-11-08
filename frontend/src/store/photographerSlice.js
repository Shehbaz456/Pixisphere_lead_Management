import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch photographers
export const fetchPhotographers = createAsyncThunk(
  'photographers/fetchPhotographers',
  async () => {
    const response = await fetch('http://localhost:3001/photographers');
    const data = await response.json();
    return data;
  }
);

// Combined filter and search function
const applyFiltersAndSearch = (photographers, searchQuery, filters, sortBy) => {
  let result = [...photographers];

  // Apply search first
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((photographer) => {
      const nameMatch = photographer.name.toLowerCase().includes(query);
      const locationMatch = photographer.location.toLowerCase().includes(query);
      const tagMatch = photographer.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      const styleMatch = photographer.styles?.some((style) =>
        style.toLowerCase().includes(query)
      );
      return nameMatch || locationMatch || tagMatch || styleMatch;
    });
  }

  // Apply price filter
  if (filters.priceRange) {
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
  }

  // Apply rating filter - FIXED: Only filter if at least one rating is selected
  if (filters.ratings && filters.ratings.length > 0) {
    const minRating = Math.min(...filters.ratings);
    result = result.filter((p) => p.rating >= minRating);
  }

  // Apply styles filter - FIXED: Only filter if at least one style is selected
  if (filters.styles && filters.styles.length > 0) {
    result = result.filter((p) =>
      filters.styles.some((style) => p.styles?.includes(style))
    );
  }

  // Apply city filter
  if (filters.city && filters.city !== 'all') {
    result = result.filter((p) => p.location === filters.city);
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'recent') {
    result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }

  return result;
};

const photographerSlice = createSlice({
  name: 'photographers',
  initialState: {
    allPhotographers: [],
    filteredPhotographers: [],
    displayedPhotographers: [],
    searchQuery: '',
    filters: {
      priceRange: [5000, 20000],
      ratings: [], // FIXED: Start with empty array (no filter by default)
      styles: [], // FIXED: Start with empty array (no filter by default)
      city: 'all',
    },
    sortBy: '',
    currentPage: 1,
    itemsPerPage: 10,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredPhotographers = applyFiltersAndSearch(
        state.allPhotographers,
        action.payload,
        state.filters,
        state.sortBy
      );
      state.currentPage = 1;
      state.displayedPhotographers = state.filteredPhotographers.slice(0, state.itemsPerPage);
      state.hasMore = state.filteredPhotographers.length > state.itemsPerPage;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.filteredPhotographers = applyFiltersAndSearch(
        state.allPhotographers,
        '',
        state.filters,
        state.sortBy
      );
      state.currentPage = 1;
      state.displayedPhotographers = state.filteredPhotographers.slice(0, state.itemsPerPage);
      state.hasMore = state.filteredPhotographers.length > state.itemsPerPage;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.filteredPhotographers = applyFiltersAndSearch(
        state.allPhotographers,
        state.searchQuery,
        action.payload,
        state.sortBy
      );
      state.currentPage = 1;
      state.displayedPhotographers = state.filteredPhotographers.slice(0, state.itemsPerPage);
      state.hasMore = state.filteredPhotographers.length > state.itemsPerPage;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredPhotographers = applyFiltersAndSearch(
        state.allPhotographers,
        state.searchQuery,
        state.filters,
        action.payload
      );
      state.currentPage = 1;
      state.displayedPhotographers = state.filteredPhotographers.slice(0, state.itemsPerPage);
      state.hasMore = state.filteredPhotographers.length > state.itemsPerPage;
    },
    loadMorePhotographers: (state) => {
      const nextPage = state.currentPage + 1;
      const startIndex = state.currentPage * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      const newItems = state.filteredPhotographers.slice(startIndex, endIndex);

      if (newItems.length > 0) {
        state.displayedPhotographers = [...state.displayedPhotographers, ...newItems];
        state.currentPage = nextPage;
        state.hasMore = endIndex < state.filteredPhotographers.length;
      } else {
        state.hasMore = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotographers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotographers.fulfilled, (state, action) => {
        state.loading = false;
        state.allPhotographers = action.payload;
        state.filteredPhotographers = applyFiltersAndSearch(
          action.payload,
          state.searchQuery,
          state.filters,
          state.sortBy
        );
        state.displayedPhotographers = state.filteredPhotographers.slice(0, state.itemsPerPage);
        state.hasMore = state.filteredPhotographers.length > state.itemsPerPage;
      })
      .addCase(fetchPhotographers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, clearSearch, setFilters, setSortBy, loadMorePhotographers } =
  photographerSlice.actions;
export default photographerSlice.reducer;
