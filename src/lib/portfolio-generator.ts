import {
  PortfolioData,
  UserInfo,
  SocialLink,
  Project,
  PortfolioTheme,
  PortfolioLayout,
  SocialPlatform,
} from '../types/portfolio'; // Adjusted path assuming src/lib and src/types

export const generateDefaultStandardPortfolioHtml = (data: PortfolioData): string => {
  const { userInfo, projects, socialLinks } = data;

  // Helper to generate project list HTML
  const projectsHtml = projects
    .map(
      (project) => `
    <div class="mb-4 p-4 border border-gray-200 rounded-lg">
      <h3 class="text-xl font-semibold">${project.name}</h3>
      <p class="text-gray-700">${project.description}</p>
      ${
        project.repositoryUrl
          ? `<p><a href="${project.repositoryUrl}" class="text-blue-500 hover:underline">Repository</a></p>`
          : ''
      }
      ${
        project.liveUrl
          ? `<p><a href="${project.liveUrl}" class="text-blue-500 hover:underline">Live Demo</a></p>`
          : ''
      }
      <p class="text-sm text-gray-600">Technologies: ${project.technologies.join(', ')}</p>
    </div>
  `
    )
    .join('');

  // Helper to generate social links HTML
  const socialLinksHtml = socialLinks
    .map(
      (link) => `
    <li class="mb-2">
      <a href="${link.url}" target="_blank" class="text-blue-500 hover:underline">
        ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
      </a>
    </li>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userInfo.name}'s Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans">
  <div class="container mx-auto p-8">
    <header class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h1 class="text-4xl font-bold text-gray-900">${userInfo.name}</h1>
      <p class="text-xl text-indigo-600">${userInfo.professionalTitle}</p>
    </header>

    <section id="about" class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
      <p class="text-gray-700 leading-relaxed">${userInfo.aboutMe}</p>
    </section>

    <section id="projects" class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Projects</h2>
      ${projectsHtml}
    </section>

    <section id="contact" class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Connect with Me</h2>
      <ul class="list-none">
        ${socialLinksHtml}
      </ul>
    </section>

    <footer class="text-center text-gray-500 mt-8">
      <p>Last updated: ${data.lastUpdatedAt.toLocaleDateString()}</p>
    </footer>
  </div>
</body>
</html>
  `;
};

// Helper function for social links, can be reused by different templates
const generateSocialLinksListHtml = (socialLinks: SocialLink[]): string => {
  return socialLinks
    .map(
      (link) => `
    <li class="mb-2">
      <a href="${link.url}" target="_blank" class="hover:underline">
        ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
      </a>
    </li>
  `
    )
    .join('');
};

// Helper function for projects, can be reused or adapted
const generateProjectsListHtml = (projects: Project[], itemClass: string = "", linkClass: string = ""): string => {
  return projects
    .map(
      (project) => `
    <div class="mb-6 p-4 border border-gray-700 rounded-lg ${itemClass}">
      <h3 class="text-xl font-semibold mb-1">${project.name}</h3>
      <p class="text-sm mb-2">${project.description}</p>
      <div class="flex space-x-4 mb-2">
        ${
          project.repositoryUrl
            ? `<a href="${project.repositoryUrl}" class="hover:underline ${linkClass}" target="_blank">Repository</a>`
            : ''
        }
        ${
          project.liveUrl
            ? `<a href="${project.liveUrl}" class="hover:underline ${linkClass}" target="_blank">Live Demo</a>`
            : ''
        }
      </div>
      <p class="text-xs">Technologies: ${project.technologies.join(', ')}</p>
    </div>
  `
    )
    .join('');
};


export const generateMinimalistDarkPortfolioHtml = (data: PortfolioData): string => {
  const { userInfo, projects, socialLinks } = data;

  const socialLinksHtml = generateSocialLinksListHtml(socialLinks);
  // For dark theme, let's make project links a bit brighter
  const projectsHtml = generateProjectsListHtml(projects, "bg-gray-800 border-gray-700", "text-indigo-400");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userInfo.name}'s Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Additional custom styles for dark theme if needed */
    body { font-family: 'Inter', sans-serif; } /* Example: Using a common sans-serif font */
  </style>
</head>
<body class="bg-gray-900 text-gray-300 font-sans leading-relaxed">
  <div class="container mx-auto max-w-3xl p-8 md:p-12">
    <header class="text-center mb-12">
      ${userInfo.profilePictureUrl ? `<img src="${userInfo.profilePictureUrl}" alt="${userInfo.name}" class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg">` : ''}
      <h1 class="text-5xl font-bold text-white mb-2">${userInfo.name}</h1>
      <p class="text-2xl text-indigo-400 mb-6">${userInfo.professionalTitle}</p>
    </header>

    <section id="about" class="mb-12">
      <h2 class="text-3xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">About Me</h2>
      <p class="text-lg">${userInfo.aboutMe}</p>
    </section>

    <section id="projects" class="mb-12">
      <h2 class="text-3xl font-semibold text-white mb-6 border-b-2 border-gray-700 pb-2">My Work</h2>
      <div class="space-y-6">
        ${projectsHtml}
      </div>
    </section>

    <section id="contact" class="text-center">
      <h2 class="text-3xl font-semibold text-white mb-6 border-b-2 border-gray-700 pb-2">Connect</h2>
      <ul class="list-none text-lg text-indigo-400 space-y-2">
        ${socialLinksHtml}
      </ul>
    </section>

    <footer class="text-center text-gray-500 mt-16 text-sm">
      <p>Last updated: ${new Date(data.lastUpdatedAt).toLocaleDateString()}</p>
      <p>&copy; ${new Date().getFullYear()} ${userInfo.name}. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
  `;
};

export const generateCreativeGridPortfolioHtml = (data: PortfolioData): string => {
  const { userInfo, projects, socialLinks } = data;

  const socialLinksHtml = socialLinks
    .map(
      (link) => `
    <a href="${link.url}" target="_blank" class="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
      ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
    </a>
  `
    )
    .join('<span class="mx-2 text-gray-400">|</span>'); // Separator for links

  const projectsGridHtml = projects
    .map(
      (project) => `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      ${'' /* Placeholder for project image: <img src="https://via.placeholder.com/400x250" alt="${project.name}" class="w-full h-48 object-cover"> */}
      <div class="p-6">
        <h3 class="text-2xl font-semibold text-gray-800 mb-2">${project.name}</h3>
        <p class="text-gray-600 text-sm mb-4 h-20 overflow-y-auto">${project.description}</p> {/* Fixed height with scroll for long descriptions */}
        <p class="text-xs text-gray-500 mb-3">Technologies: ${project.technologies.join(', ')}</p>
        <div class="flex justify-between items-center">
          ${
            project.repositoryUrl
              ? `<a href="${project.repositoryUrl}" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium" target="_blank">View Code</a>`
              : '<div></div>' // Keep spacing
          }
          ${
            project.liveUrl
              ? `<a href="${project.liveUrl}" class="text-sm bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-medium" target="_blank">Live Demo</a>`
              : '<div></div>'
          }
        </div>
      </div>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userInfo.name}'s Creative Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Poppins', sans-serif; } /* Example: Using a creative font */
    .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  </style>
</head>
<body class="bg-gradient-to-br from-purple-100 to-indigo-200 text-gray-800 font-sans">
  <div class="container mx-auto p-4 md:p-8">
    <header class="py-12 text-center">
      ${userInfo.profilePictureUrl ? `<img src="${userInfo.profilePictureUrl}" alt="${userInfo.name}" class="w-40 h-40 rounded-full mx-auto mb-6 border-8 border-white shadow-2xl">` : ''}
      <h1 class="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">${userInfo.name}</h1>
      <p class="text-xl md:text-2xl text-gray-700 font-medium">${userInfo.professionalTitle}</p>
      <p class="mt-6 max-w-2xl mx-auto text-gray-600 leading-relaxed">${userInfo.aboutMe}</p>
      <div class="mt-8 flex justify-center space-x-4">
        ${socialLinksHtml}
      </div>
    </header>

    <main id="projects" class="py-10">
      <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">My Projects</h2>
      <div class="project-grid gap-8 md:gap-10">
        ${projectsGridHtml}
      </div>
    </main>

    <footer class="text-center text-gray-600 mt-16 py-8 border-t border-gray-300">
      <p>Last updated: ${new Date(data.lastUpdatedAt).toLocaleDateString()}</p>
      <p>&copy; ${new Date().getFullYear()} ${userInfo.name}. Crafted with passion.</p>
    </footer>
  </div>
</body>
</html>
  `;
};


export const generatePortfolioHtml = (data: PortfolioData): string => {
  if (data.theme.id === 'dark') {
    return generateMinimalistDarkPortfolioHtml(data);
  } else if (data.theme.id === 'creative-grid') {
    return generateCreativeGridPortfolioHtml(data);
  } else { // Default case
    return generateDefaultStandardPortfolioHtml(data);
  }
};

export const samplePortfolioData: PortfolioData = {
  userId: 'user123',
  userInfo: {
    name: 'Alex Doe',
    professionalTitle: 'Full-Stack Developer',
    aboutMe:
      'Passionate developer with experience in building web applications using modern technologies. I love solving problems and learning new things. Focused on creating intuitive and performant user experiences.',
    profilePictureUrl: 'https://example.com/profile.jpg',
  },
  socialLinks: [
    { platform: SocialPlatform.GitHub, url: 'https://github.com/alexdoe' },
    { platform: SocialPlatform.LinkedIn, url: 'https://linkedin.com/in/alexdoe' },
    { platform: SocialPlatform.Twitter, url: 'https://twitter.com/alexdoe' },
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description:
        'A full-featured e-commerce platform with product listings, cart functionality, and user accounts. Built with React, Node.js, and PostgreSQL.',
      repositoryUrl: 'https://github.com/alexdoe/ecommerce-platform',
      liveUrl: 'https://ecom.example.com',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    },
    {
      name: 'Task Management App',
      description:
        'A simple and intuitive task management application to help users organize their daily tasks. Features include drag-and-drop functionality and deadline reminders.',
      repositoryUrl: 'https://github.com/alexdoe/task-app',
      liveUrl: 'https://tasks.example.com',
      technologies: ['Vue.js', 'Firebase', 'Vuetify'],
    },
    {
      name: 'Personal Blog',
      description:
        'A personal blog site to share articles and tutorials on web development. Static site generated with Next.js for performance.',
      technologies: ['Next.js', 'Markdown', 'TailwindCSS'],
    },
  ],
  theme: { id: 'default', name: 'Default Theme' },
  layout: { id: 'standard', name: 'Standard Layout' },
  customCss: `
    /* Example custom CSS */
    body {
      font-family: 'Roboto', sans-serif;
    }
    .container {
        max-width: 1024px;
    }
  `,
  lastUpdatedAt: new Date('2024-07-28'),
};
