import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { post } from 'api';
import useAuth from 'hooks/useAuth';

export default function EnquiryDialog({ open, onClose, kind = 'general', title = 'Talk to a travel specialist', intro, context = {} }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ name: user?.name || '', email: user?.email || '', message: '' });
    setError('');
    setSent(false);
    setSubmitting(false);
  }, [open, user]);

  const handleChange = (name) => (event) => setForm((current) => ({ ...current, [name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Enter your name and email so we can reply.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await post('/travel/enquiries', {
        kind,
        payload: {
          ...context,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        }
      });
      setSent(true);
    } catch (err) {
      setError(err.message || 'We could not send your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>{title}</DialogTitle>
        <DialogContent>
          {sent ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              Thanks! A Seravita specialist will be in touch shortly.
            </Alert>
          ) : (
            <Stack sx={{ gap: 2, pt: 0.5 }}>
              {intro && (
                <Typography variant="body2" color="text.secondary">
                  {intro}
                </Typography>
              )}
              <TextField fullWidth required label="Full name" autoComplete="name" value={form.name} onChange={handleChange('name')} />
              <TextField
                fullWidth
                required
                type="email"
                label="Email address"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Anything we should know?"
                value={form.message}
                onChange={handleChange('message')}
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          {sent ? (
            <Button onClick={onClose} variant="contained" sx={{ fontWeight: 700 }}>
              Close
            </Button>
          ) : (
            <>
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting} sx={{ fontWeight: 700 }}>
                {submitting ? 'Sending…' : 'Send enquiry'}
              </Button>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
