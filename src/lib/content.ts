export const navLinks = [
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#presenca', label: 'Online' },
  { href: '#conteudo', label: 'Conteúdo' },
] as const;

export const services = [
  {
    name: 'Consulta',
    desc: 'Online ou presencial, o plano é criado com o paciente.',
    tone: 'chocolate',
    image: {
      src: 'images/consult',
      alt: 'Nutricionista em consulta online, sorrindo atrás do notebook',
      width: 800,
      height: 1200,
      objectPosition: '50% 36%',
    },
  },
  {
    name: 'Avaliação',
    desc: 'Antropometria, bioimpedância, comparação de fotos ou com IA.',
    tone: 'sage',
    image: {
      src: 'images/assessment',
      alt: 'Nutricionista medindo a prega cutânea da coxa com adipômetro',
      width: 800,
      height: 1200,
      objectPosition: '50% 100%',
    },
  },
  {
    name: 'Gestantes',
    desc: 'Acompanhamento especializado para mamães que querem passar pela gestação de forma tranquila.',
    tone: 'terracota',
    image: {
      src: 'images/pregnancy',
      alt: 'Gestante sorrindo, com as mãos sobre a barriga',
      width: 800,
      height: 1200,
      objectPosition: '48% 32%',
    },
  },
  {
    name: 'Dieta Flexível',
    desc: 'Liberdade de trocar os alimentos para nunca enjoar.',
    tone: 'mauve',
    image: {
      src: 'images/flexible',
      alt: 'Café da manhã com ovos mexidos, frutas, café e chocolate sobre a mesa',
      width: 800,
      height: 1200,
      objectPosition: '50% 100%',
    },
  },
  {
    name: 'Acompanhamento',
    desc: 'Ajustes no momento certo, sem efeito sanfona.',
    tone: 'clay',
    image: {
      src: 'images/followup',
      alt: 'Paciente usando o app de diário alimentar no celular',
      width: 800,
      height: 1200,
      objectPosition: '50% 100%',
    },
  },
  {
    name: 'E-books',
    desc: 'Materiais exclusivos com receitas para cada perfil.',
    tone: 'blue',
    image: {
      src: 'images/ebooks',
      alt: 'Guia de industrializados da Carol Agostini em pé sobre a mesa',
      width: 800,
      height: 1200,
      objectPosition: '50% 40%',
    },
  },
  {
    name: 'Consultoria',
    desc: 'Para nutricionistas, clínicas e academias.',
    tone: 'olive',
    image: {
      src: 'images/consulting',
      alt: 'Bloco de notas da Carol Agostini e caneta sobre a mesa',
      width: 800,
      height: 1200,
      objectPosition: '50% 45%',
    },
  },
] as const;

export const presenceCountries = [
  { id: 'norway', name: 'Noruega', shortName: 'Noruega', location: [59.91, 10.75] },
  { id: 'germany', name: 'Alemanha', shortName: 'Alemanha', location: [52.52, 13.41] },
  { id: 'sweden', name: 'Suécia', shortName: 'Suécia', location: [59.33, 18.07] },
  { id: 'portugal', name: 'Portugal', shortName: 'Portugal', location: [38.72, -9.14] },
  { id: 'france', name: 'França', shortName: 'França', location: [48.86, 2.35] },
  { id: 'italy', name: 'Itália', shortName: 'Itália', location: [41.9, 12.5] },
  { id: 'usa', name: 'Estados Unidos', shortName: 'EUA', location: [38.91, -77.04] },
  { id: 'brazil', name: 'Brasil', shortName: 'Brasil', location: [-15.79, -47.88] },
] as const;

export const methods = [
  {
    name: 'Anamnese',
    desc: 'A avaliação começa pela conversa. História, rotina, queixas e o que o corpo pede agora.',
    tone: 'ash',
  },
  {
    name: 'Antropometria',
    desc: 'Os métodos mais tradicionais — e os mais comprovados — de análise.',
    tone: 'terracota',
  },
  {
    name: 'Fotos',
    desc: 'Mais do que olhar números, comparamos a evolução estética do paciente.',
    tone: 'mauve',
  },
  {
    name: 'Bioimpedância',
    desc: 'Tecnologias como Technogym e InBody são opções menos invasivas.',
    tone: 'steel',
  },
  {
    name: 'Shaped',
    desc: 'Ferramenta de IA que, em confluência com os outros métodos, facilita o acompanhamento.',
    tone: 'sage',
  },
] as const;

export const partners = [
  { name: 'Daniela Leal', src: 'images/partners/daniela-leal.svg', width: 2464, height: 1171 },
  { name: 'Essential', src: 'images/partners/essential.svg', width: 1920, height: 1171 },
  { name: 'Legítima', src: 'images/partners/legitima.svg', width: 1330, height: 1171 },
  { name: 'Sycl', src: 'images/partners/sycl.svg', width: 1171, height: 1171 },
  { name: 'Moove', src: 'images/partners/moove.svg', width: 1970, height: 1170 },
] as const;

export const contentPosts = [
  { shortcode: 'DcUGlv4oAYH', kind: 'post' },
  { shortcode: 'DaWQohpx70Q', kind: 'reel' },
  { shortcode: 'DbeNp9rlDQ_', kind: 'post' },
  { shortcode: 'Da6HnkplA7C', kind: 'post' },
  { shortcode: 'Dalp7ankTIP', kind: 'post' },
  { shortcode: 'DUqW-JwDUxv', kind: 'reel' },
  { shortcode: 'DVyf9IjDSEM', kind: 'post' },
  { shortcode: 'DGySY14xfXr', kind: 'reel' },
  { shortcode: 'DEvCwLdxgJu', kind: 'reel' },
  { shortcode: 'C-K6e0oxzLT', kind: 'reel' },
  { shortcode: 'C4Io5wtuShY', kind: 'reel' },
  { shortcode: 'C7KstuXxW86', kind: 'reel' },
  { shortcode: 'C2AxWX6R1xL', kind: 'reel' },
] as const;

export function instagramPostHref(post: (typeof contentPosts)[number]): string {
  const segment = post.kind === 'reel' ? 'reel' : 'p';
  return `https://www.instagram.com/${segment}/${post.shortcode}/`;
}

/** Indexed pages kept off the home chrome — sitemap + JSON-LD only. */
export const seoPages = [
  { href: 'sobre/', label: 'Sobre' },
  { href: 'servicos/', label: 'Serviços' },
  { href: 'contato/', label: 'Contato' },
] as const;

export const footerNav = [
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#presenca', label: 'Online' },
  { href: '#parcerias', label: 'Parcerias' },
  { href: '#conteudo', label: 'Conteúdo' },
] as const;
