import { describe, expect, it } from 'vitest';

import { criteriaFromParams, describeSearch, filterDealsByCriteria, hasSearch, paramsFromCriteria } from './search';

const fields = [
  { name: 'destination', label: 'Location', type: 'text' },
  { name: 'checkIn', label: 'Check-in', type: 'date' }
];

const deals = [
  {
    title: 'Sunset escapes in Zanzibar',
    location: 'Zanzibar, Tanzania',
    summary: 'Four nights of barefoot luxury.',
    provider: 'Seravita Stays',
    nights: '4 nights',
    highlights: ['Beachfront rooms', 'Daily breakfast']
  },
  {
    title: 'Return flights to Nairobi',
    location: 'Nairobi, Kenya',
    summary: 'A convenient return fare.',
    provider: 'Kenya Airways',
    nights: 'Return',
    highlights: ['Direct return service']
  }
];

describe('search helpers', () => {
  it('reads only known fields from the URL', () => {
    const params = new URLSearchParams('destination=Zanzibar&checkIn=2026-01-01&ignored=x');
    expect(criteriaFromParams(params, fields)).toEqual({ destination: 'Zanzibar', checkIn: '2026-01-01' });
  });

  it('only stores text criteria when building the URL', () => {
    const params = paramsFromCriteria({ destination: ' Zanzibar ', checkIn: '2026-01-01' }, fields);
    expect(hasSearch(params)).toBe(true);
    expect(params.get('destination')).toBe('Zanzibar');
    expect(params.get('checkIn')).toBeNull();
  });

  it('filters deals by text criteria', () => {
    expect(filterDealsByCriteria(deals, { destination: 'zanzibar' }, fields)).toHaveLength(1);
    expect(filterDealsByCriteria(deals, { destination: 'nowhere' }, fields)).toHaveLength(0);
  });

  it('describes active text filters', () => {
    expect(describeSearch({ destination: 'Zanzibar' }, fields)).toEqual(['Location: Zanzibar']);
  });
});
