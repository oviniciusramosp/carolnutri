/** Cookieless pageviews. Dashboard: nutricarolagostini.goatcounter.com */
export const goatCounterUrl = 'https://nutricarolagostini.goatcounter.com/count';

/**
 * Query keys that mark a shared link (`?ref=maria`).
 * GoatCounter strips `ref` and `utm_*` from paths, so we record
 * them as `/midia-kit/joy/~maria` instead.
 */
export const goatCounterLinkKeys = [
  'ref',
  'utm_source',
  'utm_campaign',
  'campaign',
  'src',
  'source',
] as const;
