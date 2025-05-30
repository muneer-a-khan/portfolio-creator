export interface UserInfo {
  name: string;
  professionalTitle: string;
  aboutMe: string;
  profilePictureUrl?: string;
}

export enum SocialPlatform {
  GitHub = 'github',
  LinkedIn = 'linkedin',
  Twitter = 'twitter',
  Website = 'website',
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface Project {
  name: string;
  description: string;
  repositoryUrl?: string; // General repository URL
  githubUrl?: string; // Specific GitHub URL for fetching info
  liveUrl?: string;
  technologies: string[];
}

export interface PortfolioTheme {
  id: string; // e.g., 'default', 'dark', 'minimal'
  name: string;
}

export interface PortfolioLayout {
  id: string; // e.g., 'standard', 'grid', 'sidebar'
  name: string;
}

export interface PortfolioData {
  userId: string;
  userInfo: UserInfo;
  socialLinks: SocialLink[];
  projects: Project[];
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  customCss?: string;
  lastUpdatedAt: Date;
}
