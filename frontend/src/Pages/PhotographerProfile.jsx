import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Rating,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
} from '@mui/material';
import {
  LocationOn,
  ArrowBack,
} from '@mui/icons-material';


const PhotographerProfile = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true);
        console.log('Fetching photographer with ID:', id);
        const response = await fetch(`http://localhost:3001/photographers/${id}`);
        
        if (!response.ok) {
          throw new Error('Photographer not found');
        }
        
        const data = await response.json();
        console.log('Fetched photographer:', data);
        setPhotographer(data);
      } catch (error) {
        console.error('Error fetching photographer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhotographer();
    }
  }, [id]); // Re-fetch when ID changes

  const handleInquirySubmit = () => {
    console.log('Inquiry submitted:', inquiryForm);
    alert('Inquiry sent successfully!');
    setInquiryOpen(false);
    setInquiryForm({ name: '', email: '', phone: '', message: '' });
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-6">
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" className="h-96! rounded-xl! mb-6" />
          <Skeleton variant="rectangular" className="h-64! rounded-xl! mb-6" />
          <Skeleton variant="rectangular" className="h-48! rounded-xl!" />
        </Container>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Photographer not found
          </h2>
          <Button
            variant="contained"
            onClick={() => navigate('/photographers')}
            className="bg-blue-600! normal-case!"
          >
            Back to Photographers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-8 md:py-10">
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/photographers')}
          className="text-gray-600! normal-case! mb-4!"
        >
          Back to Photographers
        </Button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Hero Image */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-linear-to- from-blue-500 to-purple-600">
            <img
              src={photographer.profilePic}
              alt={photographer.name}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x400?text=Photographer';
              }}
            />
          </div>

          {/* Profile Info */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar
                src={photographer.profilePic}
                alt={photographer.name}
                className="w-24! h-24! sm:w-32! sm:h-32! border-4 border-white -mt-16! md:-mt-20! shadow-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {photographer.name}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <LocationOn className="text-lg!" />
                  <span className="text-sm sm:text-base">{photographer.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <Rating value={photographer.rating} precision={0.1} readOnly />
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    {photographer.rating} ({photographer.reviews?.length || 0} reviews)
                  </span>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  {photographer.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {photographer.styles?.map((style) => (
                    <Chip
                      key={style}
                      label={style}
                      className="bg-blue-100! text-blue-700! font-medium!"
                      size="small"
                    />
                  ))}
                  {photographer.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      className="bg-gray-100! text-gray-700!"
                      size="small"
                    />
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                    <p className="text-3xl sm:text-4xl font-bold text-green-600">
                      ₹{photographer.price?.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setInquiryOpen(true)}
                    className="bg-blue-600! hover:bg-blue-700! text-white! normal-case! font-semibold! py-3! px-8! rounded-lg! w-full sm:w-auto"
                  >
                    Send Inquiry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photographer.portfolio?.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity group"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {photographer.reviews?.map((review, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {review.name}
                    </h3>
                    <Rating value={review.rating} precision={0.5} readOnly size="small" />
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <img
          src={selectedImage}
          alt="Portfolio"
          className="w-full h-auto"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x600?text=Image';
          }}
        />
      </Dialog>

      {/* Inquiry Modal */}
      <Dialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-xl font-bold">
          Send Inquiry to {photographer.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Name"
            value={inquiryForm.name}
            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inquiryForm.email}
            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={inquiryForm.phone}
            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Your Message"
            multiline
            rows={4}
            value={inquiryForm.message}
            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
            margin="normal"
            placeholder="Tell us about your photography needs..."
            required
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setInquiryOpen(false)} className="normal-case!">
            Cancel
          </Button>
          <Button
            onClick={handleInquirySubmit}
            variant="contained"
            className="bg-blue-600! hover:bg-blue-700! normal-case! font-semibold!"
          >
            Send Inquiry
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PhotographerProfile;
