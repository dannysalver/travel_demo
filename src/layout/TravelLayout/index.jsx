import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconChevronDown,
  IconLogout,
  IconMail,
  IconMenu2,
  IconPhone,
  IconSend,
  IconUser,
  IconX
} from '@tabler/icons-react';

import Logo from 'ui-component/Logo';
import useAuth from 'hooks/useAuth';
import { useTravelContent } from 'contexts/TravelContentContext';
import { post } from 'api';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { navItems, primaryNavIds, moreNavIds, getNavItem } = useTravelContent();
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));
  const moreItems = moreNavIds.map(getNavItem).filter(Boolean);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'grey.200', color: 'text.primary' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 72 }, gap: 2 }}>
          <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>

          <Stack direction="row" sx={{ ml: 4, gap: 0.5, display: { xs: 'none', lg: 'flex' } }}>
            {primaryNavIds.map((id) => {
              const item = getNavItem(id);
              if (!item) return null;
              return (
                <Button
                  key={item.id}
                  component={NavLink}
                  to={item.path}
                  end={item.path === '/'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    color: isActive(item.path) ? 'orange.main' : 'text.primary',
                    borderBottom: isActive(item.path) ? '2px solid' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.1,
                    py: 1,
                    '&:hover': { bgcolor: 'transparent', color: 'orange.main' }
                  }}
                >
                  {item.title}
                </Button>
              );
            })}
            <Button
              onClick={(event) => setMoreAnchor(event.currentTarget)}
              endIcon={<IconChevronDown size={15} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13,
                color: 'text.primary',
                px: 1.1,
                '&:hover': { bgcolor: 'transparent', color: 'orange.main' }
              }}
            >
              Explore
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <Stack direction="row" sx={{ gap: 0.5, display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <Button component={Link} to="/account" variant="contained" size="small" startIcon={<IconUser size={16} />} sx={{ px: 2 }}>
                My account
              </Button>
              <IconButton onClick={handleLogout} aria-label="Sign out" sx={{ color: 'text.secondary' }}>
                <IconLogout size={19} />
              </IconButton>
            </Stack>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, px: 2.5 }}
            >
              Sign in
            </Button>
          )}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'inline-flex', lg: 'none' }, color: 'primary.main' }}
            aria-label="Open menu"
          >
            <IconMenu2 />
          </IconButton>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {moreItems.map((item) => {
          const Icon = item.icon;
          return (
            <MenuItem key={item.id} component={NavLink} to={item.path} onClick={() => setMoreAnchor(null)} sx={{ gap: 1.5, minWidth: 220 }}>
              <Icon size={18} color="#cb6116" />
              {item.title}
            </MenuItem>
          );
        })}
      </Menu>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800 }}>
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <IconX />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <ListItemButton
                  key={item.id}
                  component={NavLink}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(item.path)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'orange.main' }}>
                    <Icon size={19} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                </ListItemButton>
              );
            })}
            {user ? (
              <>
                <ListItemButton
                  component={Link}
                  to="/account"
                  onClick={() => setDrawerOpen(false)}
                  sx={{ borderRadius: 2, mt: 1, bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: '#ffe1cb' }}>
                    <IconUser size={19} />
                  </ListItemIcon>
                  <ListItemText primary="My account" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mt: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'orange.main' }}>
                    <IconLogout size={19} />
                  </ListItemIcon>
                  <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                component={Link}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 2, mt: 1, bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                <ListItemText primary="Sign in" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

const footerColumns = [
  { title: 'Book', items: ['hotels-homes', 'flights', 'trains', 'cars', 'buses', 'flight-hotel', 'events'] },
  { title: 'Discover', items: ['attractions-tours', 'privatetours', 'grouptours', 'cruises', 'travelinspiration'] },
  { title: 'Plan', items: ['tripplanner', 'tripmap', 'deals'] }
];

function FooterLinks() {
  const { getNavItem } = useTravelContent();
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 2, sm: 3, md: 4 },
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: '1.4fr repeat(3, minmax(0, 1fr))' }
      }}
    >
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>
          Seravita
        </Typography>
        <Typography variant="caption" sx={{ letterSpacing: { xs: 1, sm: 2 }, color: 'orange.main' }}>
          TRAVELLING AGENCY
        </Typography>
        <Typography sx={{ fontSize: 13, mt: 2, maxWidth: 280, color: 'rgba(255,225,203,0.8)' }}>
          Your world, beautifully arranged. Book every part of your journey in one place.
        </Typography>
        <Stack sx={{ mt: 2, gap: 0.75 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <IconMail size={16} />
            <Typography variant="caption" sx={{ fontSize: { xs: 11, sm: 12 } }}>
              hello@seravita.travel
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <IconPhone size={16} />
            <Typography variant="caption" sx={{ fontSize: { xs: 11, sm: 12 } }}>
              +255 700 000 000
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {footerColumns.map((column) => (
        <Box key={column.title}>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 1.5 }}>
            {column.title}
          </Typography>
          <Stack sx={{ gap: 0.9 }}>
            {column.items.map((id) => {
              const item = getNavItem(id);
              if (!item) return null;
              return (
                <Typography
                  key={id}
                  component={Link}
                  to={item.path}
                  sx={{ fontSize: 13, color: 'rgba(255,225,203,0.8)', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                >
                  {item.title}
                </Typography>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await post('/travel/newsletter', { email: email.trim() });
      setNotice({ severity: 'success', message: 'Thanks! You are on the Seravita list.' });
      setEmail('');
    } catch (err) {
      setNotice({ severity: 'error', message: err.message || 'Could not subscribe. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'secondary.main', mt: 8 }}>
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <FooterLinks />
        <Box
          component="form"
          onSubmit={handleSubscribe}
          sx={{
            mt: 5,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            bgcolor: 'rgba(255,225,203,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
              Get travel ideas and exclusive fares
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,225,203,0.8)' }}>
              One thoughtful email a month. No spam, ever.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, width: { xs: '100%', sm: 380 } }}>
            <TextField
              fullWidth
              size="small"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 0 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting}
              endIcon={<IconSend size={16} />}
              sx={{ whiteSpace: 'nowrap', flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
            >
              {submitting ? 'Sending…' : 'Subscribe'}
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,225,203,0.2)', my: 4 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,225,203,0.75)' }}>
            © {new Date().getFullYear()} Seravita Travelling Agency. All rights reserved.
          </Typography>
          <Stack direction="row" sx={{ gap: 1 }}>
            {[IconBrandFacebook, IconBrandInstagram, IconBrandTwitter].map((Icon, index) => (
              <IconButton key={index} size="small" sx={{ color: 'secondary.main' }} aria-label="Social link">
                <Icon size={18} />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
      <Snackbar open={Boolean(notice)} autoHideDuration={4000} onClose={() => setNotice(null)}>
        <Alert onClose={() => setNotice(null)} severity={notice?.severity || 'success'} variant="filled">
          {notice?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function TravelLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
