import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RetailerRoute = ({ requiredStatus = 'CONFIRMED' }) => {
  const location = useLocation();
  const { retailer, status, isLoading } = useSelector((state) => state.retailer);
  const { user,isRetailer } = useSelector((state) => state.auth);

  // if (isLoading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  if (!isRetailer) {
    return <Navigate to="/retailer/register" replace />;
  }

  if (status !== requiredStatus) {
    const redirectPath = status === 'PENDING' 
      ? '/retailer/application-status' 
      : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Special route for pending applications
export const PendingRetailerRoute = () => (
  <RetailerRoute requiredStatus="PENDING" />
);