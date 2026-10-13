export interface SkillGroup {
  name: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    name: 'Languages & Frameworks',
    items: ['Go (Golang)', 'Java / Spring Boot', 'Python / Django', 'TypeScript / Next.js', 'Express.js / Nuxt'],
  },
  {
    name: 'Cloud & Infrastructure',
    items: ['Google Cloud Platform', 'Terraform', 'Docker', 'Kubernetes (GKE)', 'AWS'],
  },
  {
    name: 'Data & Messaging',
    items: ['PostgreSQL', 'MongoDB', 'Kafka', 'RabbitMQ', 'Cloud SQL'],
  },
  {
    name: 'AI / Automation',
    items: ['Firebase Genkit', 'Google Gemini', 'OpenAI GPT', 'Ollama', 'Zapier / n8n'],
  },
  {
    name: 'DevOps & Practices',
    items: ['GitHub Actions', 'CI/CD', 'Microservices', 'gRPC', 'System Design'],
  },
  {
    name: 'Languages',
    items: ['Indonesian (Native)', 'English (Professional)'],
  },
];
