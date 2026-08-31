export const siteOrigin = 'https://nutricarolagostini.com';

export const siteMeta = {
  name: 'Carol Nutri',
  professionalName: 'Carol Agostini',
  crn: 'CRN-10 9424',
  tagline: 'Nutrição clínica personalizada.',
  title: 'Carol Agostini | Nutricionista clínica · CRN-10 9424',
  description:
    'Nutrição clínica com a nutricionista Carol Agostini. Planos que respeitam a sua rotina, o seu paladar e o que o corpo precisa agora.',
  // Instagram bio booking link (wa.me/message/UMHEQAMPLSZ6A1) resolves here.
  whatsapp: '554891850439',
  phoneDisplay: '(48) 9185-0439',
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

export function ogImageUrl(): string {
  return `${siteOrigin}/images/og.jpg`;
}

export function jsonLdGraph(canonical: string) {
  const personId = `${siteOrigin}/#person`;
  const orgId = `${siteOrigin}/#practice`;
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
        areaServed: 'BR',
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
      },
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: siteMeta.title,
        description: siteMeta.description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${siteOrigin}/#website` },
        about: { '@id': personId },
      },
    ],
  };
}
