
import { useNavigate } from 'react-router-dom';
import { Card as MuiCard, CardMedia, Rating, Button, Chip } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const Card = ({ photographer }) => {
  const navigate = useNavigate();

  if (!photographer) return null;

  const handleViewProfile = () => {
    navigate(`/photographers/${photographer.id}`);
  };

  return (
    <MuiCard className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:border-blue-500">
      {/* Image */}
      <CardMedia
        component="img"
        image={photographer.profilePic}
        alt={photographer.name}
        className="w-full h-48 sm:h-52 md:h-56 object-cover bg-gray-100"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Photographer';
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 md:p-5">
        {/* Name */}
        <h3 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl mb-2 line-clamp-2">
          {photographer.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <LocationOn className="text-gray-500 text-base sm:text-lg" />
          <span className="text-gray-600 text-xs sm:text-sm">
            {photographer.location}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Rating
            value={photographer.rating}
            precision={0.1}
            readOnly
            size="small"
          />
          <span className="text-gray-600 font-semibold text-xs sm:text-sm">
            {photographer.rating}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-blue-600 font-bold text-lg sm:text-xl md:text-2xl">
            ₹{photographer.price?.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm ml-1">onwards</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {photographer.tags?.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              className="bg-gray-100! text-gray-700! text-xs! h-6!"
            />
          ))}
        </div>

        {/* Button - Auto pushed to bottom */}
        <div className="mt-auto">
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewProfile}
            className="bg-blue-600! hover:bg-blue-700! text-white! normal-case! font-semibold! text-sm sm:text-base! py-2.5! rounded-lg! shadow-none!"
          >
            View Profile
          </Button>
        </div>
      </div>
    </MuiCard>
  );
};

export default Card;
