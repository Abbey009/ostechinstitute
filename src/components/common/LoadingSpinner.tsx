'use client';

import ClipLoader from 'react-spinners/ClipLoader';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 50,
  color = '#4ade80',
  fullScreen = true,
}) => {
  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={size} color={color} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;
