// Static profile data. Career levels, projects and posts are loaded from the
// admin API (admin.iearul.xyz); the copies below are the offline fallback and
// mirror the admin's PortfolioSeeder.

export const PROFILE = {
  name: 'Md Iearulislam',
  short: 'Iearul',
  role: 'Full-Stack Developer',
  location: 'Leipzig, Germany',
  email: 'iearul.abid@gmail.com',
  github: 'https://github.com/iearul',
  linkedin: 'https://www.linkedin.com/in/md-iearulislam/',
  summary:
    'Full-stack developer with around 7 years of professional experience, mostly in production SaaS and complex enterprise systems. I work across large, multi-technology codebases and take ownership of architecture and performance.',
  languages: [
    { name: 'English', level: 'C1' },
    { name: 'German', level: 'B1+' },
  ],
}

// tier: 'core' = proficient (gold orb), 'familiar' = silver orb
export const SKILLS = [
  { id: 'php', name: 'PHP', group: 'Backend', tier: 'core' },
  { id: 'laravel', name: 'Laravel', group: 'Backend', tier: 'core' },
  { id: 'yii2', name: 'Yii2', group: 'Backend', tier: 'core' },
  { id: 'node', name: 'Node.js', group: 'Backend', tier: 'core' },
  { id: 'rest', name: 'REST APIs', group: 'Backend', tier: 'core' },
  { id: 'mysql', name: 'MySQL', group: 'Data', tier: 'core' },
  { id: 'postgres', name: 'PostgreSQL', group: 'Data', tier: 'familiar' },
  { id: 'js', name: 'JavaScript', group: 'Frontend', tier: 'core' },
  { id: 'ts', name: 'TypeScript', group: 'Frontend', tier: 'core' },
  { id: 'vue', name: 'Vue.js', group: 'Frontend', tier: 'core' },
  { id: 'react', name: 'React', group: 'Frontend', tier: 'core' },
  { id: 'angular', name: 'Angular', group: 'Frontend', tier: 'core' },
  { id: 'tailwind', name: 'Tailwind CSS', group: 'Frontend', tier: 'core' },
  { id: 'java', name: 'Java', group: 'Also speaks', tier: 'familiar' },
  { id: 'python', name: 'Python', group: 'Also speaks', tier: 'familiar' },
  { id: 'cicd', name: 'CI/CD', group: 'Ways of working', tier: 'core' },
  { id: 'agile', name: 'Agile / Scrum', group: 'Ways of working', tier: 'core' },
]

export const FALLBACK_CAREER = [
  {
    id: 1, level: 1, zone: 'campus', kind: 'education',
    title: 'Higher Secondary Certificate (Science)', organization: 'Adamjee Cantonment College',
    location: 'Dhaka, Bangladesh', started_on: '2009-01-01', ended_on: '2011-12-31', period: '01/2009 – 12/2011',
    summary: null, highlights: null, tech: [],
  },
  {
    id: 2, level: 2, zone: 'campus', kind: 'education',
    title: 'B.Sc. in Computer Science & Engineering', organization: 'East West University',
    location: 'Dhaka, Bangladesh', started_on: '2011-08-01', ended_on: '2016-07-31', period: '08/2011 – 07/2016',
    summary: null,
    highlights: '- Focus area: Software Engineering\n- Thesis: Software Product Line (SPL) Feature Tree Analysis',
    tech: [],
  },
  {
    id: 3, level: 3, zone: 'startup', kind: 'work',
    title: 'Software QA Engineer', organization: 'Zettabyte Technologies',
    location: null, started_on: '2017-09-01', ended_on: '2018-09-30', period: '09/2017 – 09/2018',
    summary: 'Manual functional testing and API testing.', highlights: null, tech: ['JIRA', 'Postman'],
  },
  {
    id: 4, level: 4, zone: 'startup', kind: 'founder',
    title: 'Software Engineer & Founder', organization: 'Zettabyte Technologies',
    location: null, started_on: '2018-09-01', ended_on: '2022-12-31', period: '09/2018 – 12/2022',
    summary: null,
    highlights:
      '- Built and managed scalable full-stack web applications using Angular, Laravel and MySQL\n- Led end-to-end client engagement: requirement gathering, project planning and delivery\n- Managed multiple projects simultaneously with on-time delivery and a 100% client satisfaction rate\n- Developed high-quality, maintainable software with a strong focus on performance\n- Introduced Agile methodologies to improve development efficiency and collaboration',
    tech: ['Angular', 'Laravel', 'MySQL', 'Agile'],
  },
  {
    id: 5, level: 5, zone: 'university', kind: 'education',
    title: 'M.Sc. Computer Simulation in Science', organization: 'Bergische Universität Wuppertal',
    location: 'Wuppertal, Germany', started_on: '2018-09-01', ended_on: null, period: '09/2018 – not completed',
    summary: null, highlights: '- Focus area: Financial Mathematics', tech: [],
  },
  {
    id: 6, level: 6, zone: 'factory', kind: 'work',
    title: 'Full-Stack Developer', organization: 'Bauer Maschinen GmbH',
    location: 'Germany', started_on: '2023-01-01', ended_on: '2023-12-31', period: '01/2023 – 12/2023',
    summary: null,
    highlights:
      '- Enhanced existing IT projects with new features and optimized legacy code\n- Developed real-time dashboards displaying live machine data and messages for data-driven decisions\n- Designed and built REST APIs for seamless system integration\n- Built high-performance web applications with PHP, Java, AngularJS, Yii2 and MySQL\n- Implemented responsive, accessible UI components with Bootstrap',
    tech: ['PHP', 'Java', 'AngularJS', 'Yii2', 'MySQL', 'Bootstrap', 'REST'],
  },
  {
    id: 7, level: 7, zone: 'tower', kind: 'work',
    title: 'Full-Stack Developer', organization: 'Weezly GmbH',
    location: 'Germany', started_on: '2024-01-01', ended_on: null, period: '01/2024 – Present',
    summary: null,
    highlights:
      '- Develop and deploy scalable full-stack applications, improving performance and user experience\n- Optimized MySQL queries, cutting query execution time by 40%\n- Build interactive, responsive UIs with Vue.js\n- Engineer efficient server-side logic in PHP for reliability and speed\n- Lead code reviews and mentor junior developers',
    tech: ['PHP', 'Vue.js', 'MySQL', 'TypeScript', 'JavaScript'],
  },
]

export const FALLBACK_PROJECTS = [
  {
    id: 1, slug: 'career-island', title: 'Career Island', category: 'web', year: 2026, is_featured: true,
    summary: 'This portfolio: a low-poly 3D island where each zone is a level of my career.',
    tech: ['JavaScript', 'React', 'Three.js', 'Vite', 'Laravel API'],
    project_url: 'https://iearul.xyz/', repo_url: 'https://github.com/iearul/iearul-portfolio', cover_url: null,
  },
  {
    id: 2, slug: 'halal-scanner', title: 'Halal Scanner', category: 'mobile', year: 2026, is_featured: true,
    summary: 'Mobile app to scan a barcode and get an instant halal verdict, with product submissions and corrections.',
    tech: ['Expo', 'React Native', 'TypeScript', 'Laravel API', 'MySQL'],
    project_url: null, repo_url: 'https://github.com/iearul/halal-scanner', cover_url: null,
  },
  {
    id: 3, slug: 'leipzig-gully-cricket', title: 'Leipzig Gully Cricket', category: 'web', year: 2026, is_featured: true,
    summary: 'Casual cricket, serious rankings — stats platform for a Leipzig gully cricket community.',
    tech: ['PHP 8', 'MySQL'],
    project_url: 'https://lgc.iearul.xyz/', repo_url: 'https://github.com/iearul/Leipzig-Gully-Cricket--LGC-', cover_url: null,
  },
  {
    id: 4, slug: 'admin-hub', title: 'Admin Hub', category: 'backend', year: 2026, is_featured: false,
    summary: "Multi-purpose Laravel admin that powers my apps: halal-food approvals, this portfolio's projects, blog and career data.",
    tech: ['Laravel 13', 'PHP 8.3', 'MySQL', 'Tailwind'],
    project_url: null, repo_url: null, cover_url: null,
  },
  {
    id: 5, slug: 'pioneer-tours', title: 'Pioneer Tours', category: 'client', year: 2022, is_featured: false,
    summary: 'A tourism ticket-selling website based in Rome, Italy.',
    tech: ['Web App', 'UI/UX'], project_url: 'https://www.pioneertours.net/', repo_url: null, cover_url: null,
  },
  {
    id: 6, slug: 'sundarbans-gmbh', title: 'Sundarbans GmbH', category: 'client', year: 2022, is_featured: false,
    summary: 'A mobile-friendly website with backend for a startup company.',
    tech: ['UI/UX', 'Web'], project_url: null, repo_url: 'https://github.com/iearul/Sundarbans-GmbH', cover_url: null,
  },
  {
    id: 7, slug: 'expense-tracker', title: 'Expense Tracker', category: 'web', year: 2022, is_featured: false,
    summary: 'A simple expense tracker.', tech: ['React'],
    project_url: null, repo_url: 'https://github.com/iearul/Expense-Tracker', cover_url: null,
  },
]

export const FALLBACK_POSTS = []
