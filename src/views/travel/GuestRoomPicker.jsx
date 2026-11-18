import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { IconChevronDown, IconMinus, IconPlus } from '@tabler/icons-react';

const rows = [
  { key: 'rooms', label: 'Rooms', min: 1, max: 10 },
  { key: 'adults', label: 'Adults', min: 1, max: 20 },
  { key: 'children', label: 'Children', min: 0, max: 20 }
];

export const formatGuests = ({ rooms, adults, children }) => {
  const parts = [`${rooms} ${rooms === 1 ? 'room' : 'rooms'}`, `${adults} ${adults === 1 ? 'adult' : 'adults'}`];
  if (children > 0) parts.push(`${children} ${children === 1 ? 'child' : 'children'}`);
  return parts.join(' · ');
};

export default function GuestRoomPicker({ label, value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const update = (key, delta) => {
    const row = rows.find((item) => item.key === key);
    const next = Math.min(row.max, Math.max(row.min, value[key] + delta));
    if (next !== value[key]) onChange({ ...value, [key]: next });
  };

  return (
    <>
      <OutlinedInput
        fullWidth
        size="small"
        label={label}
        value={formatGuests(value)}
        readOnly
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endAdornment={<IconChevronDown size={16} />}
        sx={{ height: 40, cursor: 'pointer', '& .MuiInputBase-input': { cursor: 'pointer', textOverflow: 'ellipsis' } }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2, width: 260 } } }}
      >
        {rows.map((row) => (
          <Box key={row.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="body2">{row.label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <IconButton
                size="small"
                aria-label={`Remove ${row.label.toLowerCase()}`}
                disabled={value[row.key] <= row.min}
                onClick={() => update(row.key, -1)}
                sx={{ color: 'primary.main', p: 0.25 }}
              >
                <IconMinus size={14} />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 16, textAlign: 'center', fontWeight: 600 }}>
                {value[row.key]}
              </Typography>
              <IconButton
                size="small"
                aria-label={`Add ${row.label.toLowerCase()}`}
                disabled={value[row.key] >= row.max}
                onClick={() => update(row.key, 1)}
                sx={{ color: 'primary.main', p: 0.25 }}
              >
                <IconPlus size={14} />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Button fullWidth variant="contained" size="small" onClick={() => setAnchorEl(null)} sx={{ mt: 0.5 }}>
          Done
        </Button>
      </Popover>
    </>
  );
}
