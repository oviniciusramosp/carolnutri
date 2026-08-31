export const siteMeta = {
  name: 'Carol Nutri',
  professionalName: 'Carol Agostini',
  crn: 'CRN-10 9424',
  tagline: 'Nutrição clínica personalizada.',
  description:
    'Nutrição clínica com a nutricionista Carol Agostini. Planos que respeitam a sua rotina, o seu paladar e o que o corpo precisa agora.',
  whatsapp: '5548991885441',
  phoneDisplay: '(48) 99188-5441',
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
