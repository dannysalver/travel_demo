import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBookmark, IconMapPin } from '@tabler/icons-react';

import { del, get, post } from 'api';
import useAuth from 'hooks/useAuth';
import DestinationArt from './DestinationArt';

export default function DealCard({ deal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: savedDeals, mutate: mutateSaved } = useSWR(isAuthenticated ? '/travel/saved-deals' : null, get);
  const saved = Array.isArray(savedDeals) && savedDeals.some((item) => String(item.id) === String(deal.id));

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      if (saved) {
        await del(`/travel/saved-deals/${deal.id}`);
      } else {
        await post('/travel/saved-deals', { dealId: deal.id });
      }
      mutateSaved();
    } catch {
      // The bookmark stays in its previous state if the request fails.
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Box sx={{ position: 'relative', height: 164, flexShrink: 0 }}>
        <DestinationArt scene={deal.scene} sx={{ height: '100%' }} />
        <Chip
          label={deal.badge}
          size="small"
          sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'orange.main', color: '#fff', fontWeight: 700, fontSize: 11 }}
        />
        <IconButton
          size="small"
          onClick={handleSave}
          aria-label={saved ? `Remove ${deal.title} from saved deals` : `Save ${deal.title}`}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'common.white',
            color: saved ? 'orange.main' : 'primary.main',
            boxShadow: 2,
            '&:hover': { bgcolor: 'common.white', color: 'orange.main' }
          }}
        >
          <IconBookmark size={17} fill={saved ? '#cb6116' : 'none'} />
        </IconButton>
      </Box>
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <IconMapPin size={14} color="#cb6116" />
          <Typography variant="caption" color="text.secondary">
            {deal.location}
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.75, mb: 1, minHeight: 44 }}>
          {deal.title}
        </Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            ★ {deal.rating} · {deal.nights}
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              ${deal.oldPrice}
            </Typography>
            <Typography variant="h4" sx={{ color: 'orange.main', fontWeight: 800 }}>
              ${deal.price}
            </Typography>
          </Stack>
        </Stack>
        <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate(`/deal/${deal.id}`)}>
          View deal
        </Button>
      </CardContent>
    </Card>
  );
}
