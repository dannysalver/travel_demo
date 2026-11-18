export function criteriaFromParams(searchParams, fields = []) {
  const criteria = {};
  fields.forEach((field) => {
    const value = searchParams.get(field.name);
    if (value) criteria[field.name] = value;
  });
  return criteria;
}

export function paramsFromCriteria(criteria, fields = []) {
  const params = new URLSearchParams();
  params.set('search', '1');
  fields.forEach((field) => {
    const value = criteria[field.name];
    if (field.type === 'text' && typeof value === 'string' && value.trim()) {
      params.set(field.name, value.trim());
    }
  });
  return params;
}

export function hasSearch(searchParams) {
  return searchParams.get('search') === '1';
}

export function filterDealsByCriteria(deals, criteria, fields = []) {
  const terms = fields
    .filter((field) => field.type === 'text')
    .map((field) =>
      String(criteria[field.name] || '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);

  if (!terms.length) return deals;

  return deals.filter((deal) => {
    const haystack = [deal.title, deal.location, deal.summary, deal.provider, deal.nights, deal.highlights?.join(' ')]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function describeSearch(criteria, fields = []) {
  return fields
    .filter((field) => field.type === 'text' && criteria[field.name]?.trim())
    .map((field) => `${field.label}: ${criteria[field.name].trim()}`);
}
