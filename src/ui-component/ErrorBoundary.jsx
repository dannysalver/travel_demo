import { Component } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="sm">
            <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
              <Typography variant="overline" sx={{ color: 'orange.main', fontWeight: 700, letterSpacing: 2 }}>
                Something went wrong
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                We hit an unexpected error
              </Typography>
              <Typography color="text.secondary">Please refresh the page. If it keeps happening, contact hello@seravita.travel.</Typography>
              <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => window.location.reload()} sx={{ fontWeight: 700 }}>
                  Reload page
                </Button>
                <Button variant="outlined" href="/" sx={{ fontWeight: 700 }}>
                  Back to home
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
