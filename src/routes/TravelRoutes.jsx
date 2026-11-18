import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import TravelLayout from 'layout/TravelLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'ui-component/ProtectedRoute';

const HomePage = Loadable(lazy(() => import('views/travel/HomePage')));
const CategoryPage = Loadable(lazy(() => import('views/travel/CategoryPage')));
const ExperiencePage = Loadable(lazy(() => import('views/travel/ExperiencePage')));
const DealDetailPage = Loadable(lazy(() => import('views/travel/DealDetailPage')));
const TripPlanner = Loadable(lazy(() => import('views/travel/TripPlanner')));
const TravelInspiration = Loadable(lazy(() => import('views/travel/TravelInspiration')));
const TripMap = Loadable(lazy(() => import('views/travel/TripMap')));
const Deals = Loadable(lazy(() => import('views/travel/Deals')));
const AccountPage = Loadable(lazy(() => import('views/travel/AccountPage')));
const NotFoundPage = Loadable(lazy(() => import('views/travel/NotFoundPage')));

const category = (id) => <CategoryPage categoryId={id} />;
const experience = (kind) => <ExperiencePage kind={kind} />;

// ==============================|| TRAVEL ROUTING ||============================== //

const TravelRoutes = {
  path: '/',
  element: <TravelLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'hotels-homes', element: category('hotels-homes') },
    { path: 'flights', element: category('flights') },
    { path: 'trains', element: category('trains') },
    { path: 'cars', element: category('cars') },
    { path: 'buses', element: category('buses') },
    { path: 'attractions-tours', element: category('attractions-tours') },
    { path: 'flight-hotel', element: category('flight-hotel') },
    { path: 'events', element: category('events') },
    { path: 'privatetours', element: experience('privatetours') },
    { path: 'grouptours', element: experience('grouptours') },
    { path: 'cruises', element: experience('cruises') },
    { path: 'tripplanner', element: <TripPlanner /> },
    { path: 'travelinspiration', element: <TravelInspiration /> },
    { path: 'tripmap', element: <TripMap /> },
    { path: 'deals', element: <Deals /> },
    { path: 'deal/:dealId', element: <DealDetailPage /> },
    {
      path: 'account',
      element: (
        <ProtectedRoute roles={['Customer']}>
          <AccountPage />
        </ProtectedRoute>
      )
    },
    { path: 'private-tours', element: <Navigate to="/privatetours" replace /> },
    { path: 'group-tours', element: <Navigate to="/grouptours" replace /> },
    { path: 'trip-planner', element: <Navigate to="/tripplanner" replace /> },
    { path: 'travel-inspiration', element: <Navigate to="/travelinspiration" replace /> },
    { path: 'trip-map', element: <Navigate to="/tripmap" replace /> },
    { path: '*', element: <NotFoundPage /> }
  ]
};

export default TravelRoutes;
