import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconSearch } from '@tabler/icons-react';

import { useTravelContent } from 'contexts/TravelContentContext';

import GuestRoomPicker from './GuestRoomPicker';

const defaultGuests = { rooms: 1, adults: 1, children: 0 };

const isGuestRoomField = (field) => field.type === 'counter' || (field.name === 'guests' && field.label === 'Guests & rooms');

export default function SearchPanel({ categoryId, onCategoryChange, tabs = [], override, onSearch }) {
  const { categories, getCategory } = useTravelContent();
  const category = override || getCategory(categoryId) || categories[0];
  const [values, setValues] = useState({});

  const handleChange = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.({ criteria: values, fields: category.fields, category });
  };

  const fieldSize = category.fields.length >= 5 ? 2 : 12 / category.fields.length;

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={6}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          maxWidth: 1100,
          mx: 'auto',
          width: '100%'
        }}
      >
        {tabs.length > 0 && (
          <Tabs
            value={category.id}
            onChange={(_, value) => {
              onCategoryChange?.(value);
              setValues({});
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'grey.200',
              mb: 2.5,
              minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, textTransform: 'none', fontWeight: 600 }
            }}
          >
            {tabs.map((item) => {
              const Icon = item.icon;
              return <Tab key={item.id} icon={<Icon size={17} />} iconPosition="start" label={item.title} value={item.id} />;
            })}
          </Tabs>
        )}

        <Grid container spacing={2} alignItems="center">
          {category.fields.map((field) => (
            <Grid key={field.name} size={{ xs: 12, sm: 6, md: fieldSize }}>
              {isGuestRoomField(field) ? (
                <GuestRoomPicker
                  label={field.label}
                  value={values[field.name] || defaultGuests}
                  onChange={(value) => handleChange(field.name, value)}
                />
              ) : field.type === 'select' ? (
                <TextField
                  select
                  fullWidth
                  size="small"
                  label={field.label}
                  value={values[field.name] || field.options[0]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  type={field.type === 'date' ? 'date' : 'text'}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                />
              )}
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, md: category.fields.length >= 5 ? 2 : 12 / category.fields.length }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<IconSearch size={18} />}
              sx={{ height: 40, whiteSpace: 'nowrap' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            No hidden fees
          </Typography>
          <Typography variant="caption" color="text.secondary">
            · Free cancellation on selected options
          </Typography>
        </Box>
      </Paper>
    </>
  );
}
