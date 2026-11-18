import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';

import PageHero from './PageHero';

export default function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page took a wrong turn"
        subtitle="The page you are looking for does not exist or has moved. Let us get you back on track."
        scene="mountain"
        dense
      />
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Stack direction="row" sx={{ gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} to="/" variant="contained" startIcon={<IconArrowLeft size={18} />} sx={{ fontWeight: 700 }}>
            Back to home
          </Button>
          <Button component={Link} to="/deals" variant="outlined" startIcon={<IconSearch size={18} />} sx={{ fontWeight: 700 }}>
            Browse deals
          </Button>
        </Stack>
      </Container>
    </>
  );
}
