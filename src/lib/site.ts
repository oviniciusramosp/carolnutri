export const siteOrigin = 'https://nutricarolagostini.com';

export const siteMeta = {
  name: 'Carol Nutri',
  professionalName: 'Carol Agostini',
  crn: 'CRN-10 9424',
  tagline: 'Nutrição clínica personalizada.',
  title: 'Carol Agostini | Nutricionista em Florianópolis · CRN-10 9424',
  description:
    'Nutricionista clínica em Florianópolis e online. Carol Agostini (CRN-10 9424) monta planos que respeitam a sua rotina, o paladar e o que o corpo precisa agora.',
  city: 'Florianópolis',
  region: 'SC',
  country: 'BR',
  whatsapp: '5548991850439',
  phoneDisplay: '(48) 99185-0439',
  instagramHandle: 'carolagostini.nutri',
} as const;

export function whatsappHref(message?: string): string {
  const text = message ?? 'Olá, Carol! Gostaria de agendar uma consulta.';
  return `https://wa.me/${siteMeta.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function phoneHref(): string {
  return `tel:+${siteMeta.whatsapp}`;
}

export function instagramHref(): string {
  return `https://www.instagram.com/${siteMeta.instagramHandle}/`;
}

export function ogImageUrl(file = 'images/og.jpg'): string {
  const path = file.startsWith('/') ? file : `/${file}`;
  return `${siteOrigin}${path}`;
}

export function jsonLdGraph(
  canonical: string,
  page: { name: string; description: string } = {
    name: siteMeta.title,
    description: siteMeta.description,
  },
) {
  const personId = `${siteOrigin}/#person`;
  const orgId = `${siteOrigin}/#practice`;
  const address = {
    '@type': 'PostalAddress',
    addressLocality: siteMeta.city,
    addressRegion: siteMeta.region,
    addressCountry: siteMeta.country,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: siteMeta.professionalName,
        jobTitle: 'Nutricionista',
        description: siteMeta.description,
        url: siteOrigin,
        image: ogImageUrl(),
        telephone: `+${siteMeta.whatsapp}`,
        identifier: siteMeta.crn,
        homeLocation: { '@type': 'City', name: siteMeta.city },
        sameAs: [instagramHref()],
        worksFor: { '@id': orgId },
      },
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: siteMeta.name,
        alternateName: siteMeta.professionalName,
        url: siteOrigin,
        image: ogImageUrl(),
        telephone: `+${siteMeta.whatsapp}`,
        description: siteMeta.description,
        founder: { '@id': personId },
        address,
        areaServed: [
          { '@type': 'City', name: siteMeta.city },
          { '@type': 'AdministrativeArea', name: 'Santa Catarina' },
          { '@type': 'Country', name: 'BR' },
        ],
        availableLanguage: ['pt-BR'],
        sameAs: [instagramHref()],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        url: siteOrigin,
        name: siteMeta.name,
        description: siteMeta.description,
        inLanguage: 'pt-BR',
        publisher: { '@id': orgId },
        hasPart: [
          { '@type': 'WebPage', '@id': `${siteOrigin}/sobre/` },
          { '@type': 'WebPage', '@id': `${siteOrigin}/servicos/` },
          { '@type': 'WebPage', '@id': `${siteOrigin}/contato/` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: page.name,
        description: page.description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${siteOrigin}/#website` },
        about: { '@id': personId },
      },
    ],
  };
}
