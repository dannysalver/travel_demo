import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function seatSupplement(seat, deal) {
  const { columns } = deal.seatLayout;
  let price = 0;
  if (seat.column === 0 || seat.column === columns - 1) price += 8;
  if (seat.row <= 2) price += 12;
  return price;
}

export function seatTotal(seats, deal) {
  return seats.reduce((sum, seat) => sum + seatSupplement(seat, deal), 0);
}

function isOccupied(deal, row, column) {
  return (deal.id * 19 + row * 13 + column * 7) % 9 === 0;
}

function buildSeat(deal, row, column) {
  const label = `${row}${String.fromCharCode(65 + column)}`;
  return { row, column, label, price: seatSupplement({ row, column }, deal) };
}

export default function SeatPicker({ deal, travellers, seats, onChange }) {
  const { rows, columns, aisleAfter } = deal.seatLayout;

  const toggleSeat = (seat) => {
    if (seats.some((item) => item.label === seat.label)) {
      onChange(seats.filter((item) => item.label !== seat.label));
      return;
    }
    if (seats.length >= travellers) return;
    onChange([...seats, seat].sort((a, b) => a.row - b.row || a.column - b.column));
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
        <Chip size="small" label="Available" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip size="small" label="Selected" sx={{ bgcolor: 'orange.main', color: '#fff', fontWeight: 700 }} />
        <Chip size="small" label="Taken" sx={{ bgcolor: 'grey.300', color: 'grey.700', fontWeight: 600 }} />
      </Stack>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ minWidth: 260 }}>
          {Array.from({ length: rows }).map((_, rowIndex) => {
            const row = rowIndex + 1;
            return (
              <Stack key={row} direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
                <Typography sx={{ width: 18, textAlign: 'right', fontSize: 12, color: 'text.secondary' }}>{row}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: columns }).map((_, column) => {
                    const seat = buildSeat(deal, row, column);
                    const occupied = isOccupied(deal, row, column);
                    const selected = seats.some((item) => item.label === seat.label);
                    return (
                      <Button
                        key={seat.label}
                        aria-label={`Seat ${seat.label}${selected ? ', selected' : ''}${occupied ? ', taken' : ''}`}
                        disabled={occupied || (!selected && seats.length >= travellers)}
                        onClick={() => toggleSeat(seat)}
                        sx={{
                          minWidth: 40,
                          width: 40,
                          height: 38,
                          px: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 1.5,
                          ml: column === aisleAfter ? 2.5 : 0,
                          color: selected ? '#fff' : occupied ? 'grey.500' : 'primary.main',
                          bgcolor: selected ? 'orange.main' : occupied ? 'grey.300' : 'common.white',
                          border: '1px solid',
                          borderColor: selected ? 'orange.main' : occupied ? 'grey.300' : 'grey.400',
                          '&:hover': { bgcolor: selected ? 'orange.dark' : 'secondary.main' },
                          '&.Mui-disabled': { color: occupied ? 'grey.500' : 'grey.400' }
                        }}
                      >
                        {seat.label}
                      </Button>
                    );
                  })}
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Window seats +$8 · Front two rows +$12. Choose {travellers} {travellers === 1 ? 'seat' : 'seats'} to continue.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Selected:
        </Typography>
        {seats.length ? (
          seats.map((seat) => (
            <Chip
              key={seat.label}
              label={`${seat.label}${seat.price ? ` +$${seat.price}` : ''}`}
              size="small"
              onDelete={() => toggleSeat(seat)}
              sx={{ fontWeight: 600 }}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            None yet
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'orange.main', ml: 'auto' }}>
          Seat total: ${seatTotal(seats, deal)}
        </Typography>
      </Box>
    </Stack>
  );
}
