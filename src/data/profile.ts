export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export const profile = {
  name: 'Jesslyn',
  title: 'Backend Engineer',
  role: 'Backend Engineer — Scalable Systems · Cloud Infrastructure · AI-Powered Automation',
  summary:
    'Backend Engineer with a passion for building scalable and efficient systems. I enjoy exploring all aspects of backend development, from architecture to performance optimization. Interested in Machine Learning and Generative AI, always eager to learn and experiment. Enthusiastic about creating reliable and well-structured solutions.',
  description:
    'Jesslyn — Backend Engineer specializing in scalable systems, cloud infrastructure, and AI-powered automation.',
  location: 'West Jakarta, Indonesia',
  email: 'jsslnjess08@gmail.com',
  github: 'https://github.com/jesslyn-ctrl',
  linkedin: 'https://www.linkedin.com/in/jesslyn-jesslyn-5798711a7/',
  cta: "Let's talk backend systems, cloud, or AI automation.",
};

export const contactLinks: ContactLink[] = [
  { label: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'GitHub', href: profile.github, external: true },
  { label: 'LinkedIn', href: profile.linkedin, external: true },
];
