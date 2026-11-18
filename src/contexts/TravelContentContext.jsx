import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { get } from 'api';
import Loader from 'ui-component/Loader';
import { getIcon } from 'views/travel/icons';

const TravelContentContext = createContext(null);

function normalizeFields(fields = []) {
  return fields.map((field) => ({
    name: field.name,
    label: field.label,
    placeholder: field.placeholder || undefined,
    type: field.type,
    options: field.options?.length ? field.options : undefined
  }));
}

function buildContentValue(data) {
  const navItems = (data.navItems || []).map((item) => ({ ...item, icon: getIcon(item.icon_name) }));
  const categories = (data.categories || []).map((category) => ({
    ...category,
    icon: getIcon(category.icon_name),
    fields: normalizeFields(category.fields)
  }));
  const deals = (data.deals || []).map((deal) => {
    const vehicleType = deal.vehicle_type || deal.vehicleType || null;
    return {
      ...deal,
      category: deal.category_id || deal.category,
      nights: deal.duration_label || deal.nights,
      oldPrice: deal.old_price ?? deal.oldPrice,
      icon: getIcon(deal.icon_name),
      highlights: deal.highlights || [],
      includes: deal.includes || [],
      vehicleType,
      seatLayout: vehicleType
        ? deal.seatLayout || { rows: deal.seat_rows, columns: deal.seat_columns, aisleAfter: deal.seat_aisle_after }
        : null
    };
  });
  const destinations = (data.destinations || []).map((destination) => ({ ...destination, icon: getIcon(destination.icon_name) }));
  const perks = (data.perks || []).map((perk) => ({ ...perk, icon: getIcon(perk.icon_name) }));
  const articles = (data.articles || []).map((article) => ({ ...article, read: article.read_time || article.read }));
  const mapPins = (data.mapPins || []).map((pin) => ({ ...pin, x: pin.x ?? pin.x_pct, y: pin.y ?? pin.y_pct }));
  const experienceFields = data.experienceSearchFields?.[0];
  const experiences = (data.experiences || []).map((experience) => ({
    ...experience,
    icon: getIcon(experience.icon_name),
    fields: normalizeFields(experience.fields || experienceFields)
  }));

  return {
    navItems,
    primaryNavIds: data.primaryNavIds || navItems.filter((item) => item.nav_group === 'primary').map((item) => item.id),
    moreNavIds: data.moreNavIds || navItems.filter((item) => item.nav_group === 'more').map((item) => item.id),
    categories,
    deals,
    destinations,
    perks,
    articles,
    mapPins,
    experiences,
    getNavItem: (id) => navItems.find((item) => item.id === id),
    getCategory: (id) => categories.find((category) => category.id === id),
    getExperience: (kind) => experiences.find((experience) => experience.kind === kind),
    getDeal: (id) => deals.find((deal) => String(deal.id) === String(id))
  };
}

export function TravelContentProvider({ children }) {
  const { data, error, mutate } = useSWR('/travel/content', get, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
  });
  const [fallback, setFallback] = useState(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState(null);

  useEffect(() => {
    if (!error || data || fallback || fallbackLoading) return undefined;
    let cancelled = false;
    setFallbackLoading(true);
    import('../../server/seed-content.json')
      .then((module) => {
        if (!cancelled) setFallback(module.default);
      })
      .catch((err) => {
        if (!cancelled) setFallbackError(err);
      })
      .finally(() => {
        if (!cancelled) setFallbackLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [error, data, fallback, fallbackLoading]);

  const source = data || fallback;
  const value = useMemo(() => (source ? buildContentValue(source) : null), [source]);

  if (!value && (fallbackError || (error && !fallbackLoading))) {
    return (
      <Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center', p: 3, gap: 2 }}>
        <Alert severity="error">Could not load site content from the API.</Alert>
        <Button variant="contained" onClick={() => mutate()}>
          Retry
        </Button>
      </Stack>
    );
  }

  if (!value) return <Loader />;

  return <TravelContentContext.Provider value={value}>{children}</TravelContentContext.Provider>;
}

export function useTravelContent() {
  const context = useContext(TravelContentContext);
  if (!context) throw new Error('useTravelContent must be used within a TravelContentProvider');
  return context;
}

export default TravelContentProvider;
