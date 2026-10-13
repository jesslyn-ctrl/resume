export interface Job {
  title: string;
  org: string;
  period: string;
  points: string[];
}

export const experience: Job[] = [
  {
    title: 'Software Engineer',
    org: 'DoiT International, CA · Remote',
    period: 'Mar 2026 – Present',
    points: [
      'Led system design and architecture discussions for new services, ensuring scalability, maintainability, and alignment with business needs.',
      'Built internal AI-powered tools and automation platforms to improve operational efficiency across Support, Finance, and Engineering.',
      'Designed workflow automations using Zapier and n8n, integrating Zendesk, Jira, Slack, Google Workspace, and internal APIs to eliminate repetitive tasks.',
      'Developed intelligent ticket routing systems in Zendesk, reducing manual triage and improving assignment accuracy.',
      'Implemented Finance support automation, including skill-based routing, escalation workflows, SLA management, and reporting.',
      'Built backend services in Go (Golang) and deployed cloud-native applications on Google Cloud Platform.',
      'Provisioned and managed GCP infrastructure using Terraform (Cloud Run, API Gateway, Load Balancer, IAM, Artifact Registry, Cloud Build/WIF).',
      'Created CI/CD pipelines with GitHub Actions for automated testing and deployments.',
      'Integrated systems via APIs and event-driven architectures to streamline cross-team workflows.',
      'Optimized Zendesk workflows through custom triggers, macros, views, and automation rules.',
      'Leveraged AI-assisted development tools (Claude Code, Gemini, Antigravity) to accelerate engineering productivity.',
    ],
  },
  {
    title: 'Senior Backend Engineer',
    org: 'SG-EDTS, Jakarta',
    period: 'Jan 2025 – Mar 2026',
    points: [
      'Led system design and architecture discussions for new services, ensuring scalability, maintainability, and alignment with business needs.',
      'Conducted code reviews and provided mentorship for Java Spring Boot and Golang projects, improving code quality and team productivity.',
      'Optimized backend service performance by improving database queries, caching strategies, and API response times.',
      'Drove best practices in microservices design, CI/CD pipelines, testing strategy, and observability.',
    ],
  },
  {
    title: 'Backend Engineer',
    org: 'SG-EDTS, Jakarta',
    period: 'Aug 2023 – Dec 2024',
    points: [
      'Proficient in Java Spring Boot and Golang, with hands-on experience building scalable backend services and APIs, including gRPC-based microservices.',
      'Contributed to e-Budgeting (insurance) and Indomaret (retail) projects, designing and maintaining microservices architecture for high availability and performance.',
      'Implemented Kafka for reliable real-time data exchange and decoupled service communication.',
      'Experienced with Google Cloud Platform (Cloud SQL, GKE), Docker (multi-stage builds), and Kubernetes for cloud-native deployments.',
      'Involved in system design, project structuring, technical documentation, and establishing scalability/maintainability best practices.',
      'Researched and implemented GenAI solutions (Google Gemini, OpenAI GPT, Ollama) in internal projects, enhancing workflows and exploring AI-powered automation.',
    ],
  },
  {
    title: 'Backend Engineer',
    org: 'Gramedia, Jakarta',
    period: 'Jul 2022 – Jul 2023',
    points: [
      'Built and integrated backend APIs using Python (Django) and Express.js/Nuxt with PostgreSQL, MongoDB, RabbitMQ, Elastic APM, and Firebase, ensuring scalable and reliable systems.',
      'Conducted vendor and category data mapping to ensure accurate and consistent data across systems.',
      'Worked with AWS, Docker, Elastic Search, Git, and CI/CD pipelines for cloud-native deployments.',
      'Led a 4-member team to deliver critical projects, including the Billing System B2B and Gramedia Affiliate System for Gramedia.com.',
      'Engaged in system design, technical decision-making, code reviews, and adherence to best practices.',
    ],
  },
  {
    title: 'Mobile Android & Full-stack Web Developer',
    org: 'AdIns, Jakarta',
    period: 'Mar 2021 – Jul 2022',
    points: [
      'Analyzed system loads and resolved production issues across multiple finance-industry clients (BCA Finance, Toyota Astra Finance, Wuling Finance, WOM Finance).',
      'Developed and maintained Java Spring Boot backends and JSP-based web applications, handling bug fixes and production enhancements.',
      'Built and fixed mobile applications using Java (Android Studio), integrating Firebase Crashlytics & APM for monitoring.',
      'Managed SQL Server for data operations, with deployment experience on Apache, Wildfly, and remote client servers.',
    ],
  },
  {
    title: 'Computation & NLP Assistant Lecturer',
    org: 'Tarumanagara University, Jakarta',
    period: 'Jun 2020 – Dec 2020',
    points: [],
  },
];
