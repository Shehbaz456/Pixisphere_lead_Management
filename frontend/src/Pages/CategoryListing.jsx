
import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Skeleton, CircularProgress } from '@mui/material';
import Card from '../components/Card';
import { fetchPhotographers, loadMorePhotographers } from '../store/photographerSlice';

function CategoryListing() {
  const dispatch = useDispatch();
  const { 
    displayedPhotographers, 
    loading, 
    searchQuery, 
    hasMore,
    filteredPhotographers 
  } = useSelector((state) => state.photographers);
  
  const observer = useRef();
  const loadingMore = useRef(false);

  useEffect(() => {
    dispatch(fetchPhotographers());
  }, [dispatch]);

  // Intersection Observer for infinite scroll
  const lastCardRef = useCallback(
    (node) => {
      if (loading || loadingMore.current) return;
      
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadingMore.current = true;
          dispatch(loadMorePhotographers());
          setTimeout(() => {
            loadingMore.current = false;
          }, 500);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-8 md:py-10">
      <Container maxWidth="xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-bold text-gray-800 text-2xl sm:text-3xl md:text-4xl mb-2">
            Photographer Profiles
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {loading
              ? 'Loading photographers...'
              : searchQuery
              ? `Found ${filteredPhotographers.length} result${
                  filteredPhotographers.length !== 1 ? 's' : ''
                } for "${searchQuery}" (Showing ${displayedPhotographers.length})`
              : `Found ${filteredPhotographers.length} photographer${
                  filteredPhotographers.length !== 1 ? 's' : ''
                } (Showing ${displayedPhotographers.length})`}
          </p>
        </div>

        {/* Loading Skeletons - Initial Load */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                className="h-80! sm:h-96! rounded-xl!"
              />
            ))}
          </div>
        ) : displayedPhotographers.length === 0 ? (
          // No Results
          <div className="text-center py-16">
            <h2 className="text-gray-600 text-xl font-semibold mb-2">
              {searchQuery
                ? `No photographers found for "${searchQuery}"`
                : 'No photographers found'}
            </h2>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Please check your connection or try again later'}
            </p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {displayedPhotographers.map((photographer, index) => {
                // Add ref to last card for infinite scroll
                if (displayedPhotographers.length === index + 1) {
                  return (
                    <div ref={lastCardRef} key={photographer.id}>
                      <Card photographer={photographer} />
                    </div>
                  );
                } else {
                  return <Card key={photographer.id} photographer={photographer} />;
                }
              })}
            </div>

            {/* Loading More Indicator */}
            {hasMore && !loading && (
              <div className="flex justify-center items-center py-8">
                <CircularProgress size={40} className="text-blue-600" />
                <span className="ml-3 text-gray-600">Loading more photographers...</span>
              </div>
            )}

            {/* End Message */}
            {!hasMore && displayedPhotographers.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 font-semibold">
                  You've reached the end! No more photographers to load.
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default CategoryListing;
