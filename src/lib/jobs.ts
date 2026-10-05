export type Job = {
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  area: string;
  salary?: string;
  posted: string;
  deadline: string;
  description: string;
};

export const LOCATIONS = ["Cabo Delgado", "Gaza", "Inhambane", "Maputo Cidade", "Maputo Província", "Nampula", "Niassa", "Sofala", "Tete", "Todo o país", "Zambézia"];

export const JOBS: Job[] = [
  { slug: "tecnico-help-desk-ti-maputo", title: "Técnico de Help Desk de TI, Maputo, Moçambique", company: "FNB Moçambique", location: "Maputo Cidade", type: "Tempo inteiro", area: "Redes, Infraestrutura e Sistemas", posted: "2 dias atrás", deadline: "11 de Out", description: "Prestar suporte técnico aos utilizadores, gerir incidentes e manter a infraestrutura de TI do banco." },
  { slug: "technical-officer-emce-rcce-maputo", title: "Technical Officer for Public Health Messaging and Community Engagement, Maputo", company: "FHI 360", location: "Maputo Cidade", type: "Full-time", area: "Community Engagement", salary: "USD 34,000 – 43,000 / ano", posted: "2 dias atrás", deadline: "10 de Out", description: "Lead evidence-based risk communication and community engagement activities across health programs." },
  { slug: "senior-technical-officer-health-emergency", title: "Senior Technical Officer – Health Emergency Management, Maputo", company: "FHI 360", location: "Maputo Cidade", type: "Full-time", area: "Health Emergency Management", salary: "USD 47,500 – 57,000 / ano", posted: "2 dias atrás", deadline: "10 de Out", description: "Provide technical leadership on health emergency preparedness and response." },
  { slug: "coordenador-monitoria-ecologica-massale", title: "Coordenador(a) de Monitoria Ecológica, Massale, Matutuíne", company: "FDSC / Conserve Global", location: "Maputo Província", type: "Tempo inteiro", area: "Conservação e Gestão Ambiental", posted: "3 dias atrás", deadline: "16 de Out", description: "Coordenar programas de monitoria ecológica e recolha de dados de biodiversidade." },
  { slug: "oficial-qualidade-cuidados-niassa", title: "Oficial de Qualidade de Cuidados, Niassa, Moçambique", company: "PSI Moçambique", location: "Niassa", type: "Tempo inteiro", area: "Nível médio em Saúde", posted: "3 dias atrás", deadline: "7 de Out", description: "Garantir a qualidade dos serviços de saúde prestados nas unidades sanitárias apoiadas." },
  { slug: "oficial-logistica-cabo-delgado", title: "Oficial de Logística, Pemba, Cabo Delgado", company: "Ação Contra a Fome", location: "Cabo Delgado", type: "Tempo inteiro", area: "Logística", posted: "4 dias atrás", deadline: "14 de Out", description: "Gerir aprovisionamento, armazém e frota para operações humanitárias." },
  { slug: "contabilista-beira", title: "Contabilista Sénior, Beira, Sofala", company: "Grupo Sofala", location: "Sofala", type: "Tempo inteiro", area: "Contabilidade", posted: "4 dias atrás", deadline: "20 de Out", description: "Elaborar demonstrações financeiras e assegurar o cumprimento fiscal." },
  { slug: "estagio-engenharia-software-nampula", title: "Estágio em Engenharia de Software, Nampula", company: "TechMoz", location: "Nampula", type: "Estágio", area: "Engenharia de Software", posted: "5 dias atrás", deadline: "25 de Out", description: "Participar no desenvolvimento de aplicações web e móveis com a equipa de produto." },
];

export const AREAS = Array.from(new Set(JOBS.map((j) => j.area))).sort();
