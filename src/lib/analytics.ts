/** Cookieless pageviews. Dashboard: nutricarolagostini.goatcounter.com */
export const goatCounterUrl = 'https://nutricarolagostini.goatcounter.com/count';

/**
 * Query keys kept on the tracked path so a shared link
 * (`/midia-kit/joy/?ref=maria`) shows up as its own row.
 * `ref` / `utm_source` / `campaign` also feed GoatCounter campaigns.
 */
export const goatCounterLinkKeys = [
  'ref',
  'utm_source',
  'utm_campaign',
  'campaign',
  'src',
  'source',
] as const;
