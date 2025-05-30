'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // For App Router
import {
  PortfolioData,
  Project as ProjectType, // Renamed to avoid conflict with state variable name if any
  SocialLink as SocialLinkType,
  SocialPlatform,
  UserInfo
} from '../../types/portfolio';
import { generatePortfolioHtml } from '../../lib/portfolio-generator';

// Define types for SocialLink and Project states for the form
interface SocialLinkState {
  platform: SocialPlatform | string;
  url: string;
}
interface ProjectState {
  name: string;
  description: string;
  repositoryUrl?: string;
  githubUrl?: string; // Added for GitHub repo fetching
  liveUrl?: string;
  technologies: string[];
}

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('preview');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedLayout, setSelectedLayout] = useState('standard');

  // UserInfo state
  const [name, setName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // Placeholder for now

  // SocialLinks state
  const [socialLinks, setSocialLinks] = useState<SocialLinkState[]>([
    { platform: SocialPlatform.GitHub, url: '' },
  ]);

  // Projects state
  const [projects, setProjects] = useState<ProjectState[]>([
    { name: '', description: '', technologies: [], repositoryUrl: '', githubUrl: '', liveUrl: '' },
  ]);
  
  const [customCss, setCustomCss] = useState(''); // For future use

  const [isFetchingRepoInfo, setIsFetchingRepoInfo] = useState<Record<number, boolean>>({}); // For individual project loading state
  const [fetchError, setFetchError] = useState<string | null>(null);


  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const themes = [
    { id: 'default', name: 'Default', color: 'bg-blue-500' },
    { id: 'dark', name: 'Minimalist Dark', color: 'bg-gray-800' },
    { id: 'creative-grid', name: 'Creative Grid Light', color: 'bg-green-500' },
  ];
  
  const layouts = [
    { id: 'standard', name: 'Standard Layout' },
    { id: 'grid', name: 'Grid Layout' },
    { id: 'sidebar', name: 'Sidebar Layout' },
  ];

  // Authentication and Data Loading Effect
  useEffect(() => {
    if (status === 'loading') return; // Wait until session status is resolved

    if (!session) {
      router.push('/'); // Redirect to home or a login page if not authenticated
    } else {
      // If authenticated, load portfolio data
      const loadPortfolioData = async () => {
        setIsLoadingData(true);
        setSaveStatus(null);
        try {
          const response = await fetch('/api/portfolio/load'); // Auth is handled by cookies/session
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              const { userInfo, socialLinks: dbSocialLinks, projects: dbProjects, themeId, layoutId, customCss: dbCustomCss } = result.data;
              if (userInfo) {
                setName(userInfo.name || '');
                setProfessionalTitle(userInfo.professionalTitle || '');
                setAboutMe(userInfo.aboutMe || '');
                setProfilePictureUrl(userInfo.profilePictureUrl || '');
              }
              const parseJsonArray = (jsonString: any) => {
                  if (Array.isArray(jsonString)) return jsonString;
                  try { return jsonString ? JSON.parse(jsonString) : []; }
                  catch { return []; }
              };
              setSocialLinks(parseJsonArray(dbSocialLinks));
              setProjects(parseJsonArray(dbProjects));
              setSelectedTheme(themeId || 'default');
              setSelectedLayout(layoutId || 'standard');
              setCustomCss(dbCustomCss || '');
            } else if (response.status === 404 || (result.data && result.data.message === 'Portfolio not found for this user.')) {
              // No existing data for this user, this is fine.
            } else {
              setSaveStatus({message: result.message || "Failed to load portfolio data.", type: "error"});
            }
          } else if (response.status === 404) {
            // Portfolio not found for this user, this is fine.
          } else {
             setSaveStatus({message: `Error loading data: ${response.statusText}`, type: "error"});
          }
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
          setSaveStatus({message: "Client-side error fetching portfolio data.", type: "error"});
        } finally {
          setIsLoadingData(false);
        }
      };
      loadPortfolioData();
    }
  }, [session, status, router]);

  // Render loading state or redirect message
  if (status === 'loading' || (status === 'unauthenticated' && !session)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading or Redirecting...</p>
      </div>
    );
  }
  // Note: isLoadingData will show more specific loading for portfolio content after auth check

  const portfolioHtml = useMemo(() => {
    const currentThemeObj = themes.find(t => t.id === selectedTheme) || themes[0];
    const currentLayoutObj = layouts.find(l => l.id === selectedLayout) || layouts[0];

    const dataForPreview: PortfolioData = {
      userId: 'user_placeholder_123abc',
      userInfo: { name, professionalTitle, aboutMe, profilePictureUrl },
      socialLinks: socialLinks.filter(sl => sl.url).map(sl => ({...sl, platform: sl.platform as SocialPlatform})),
      projects: projects.filter(p => p.name && p.description),
      theme: { id: currentThemeObj.id, name: currentThemeObj.name },
      layout: { id: currentLayoutObj.id, name: currentLayoutObj.name },
      customCss: customCss || '',
      lastUpdatedAt: new Date(),
    };
    return generatePortfolioHtml(dataForPreview);
  }, [name, professionalTitle, aboutMe, profilePictureUrl, socialLinks, projects, selectedTheme, selectedLayout, customCss, themes, layouts]);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> {/* Changed bg-gray-50 to bg-gray-100 for body */}
      <header className="bg-white shadow-sm"> {/* Reduced shadow intensity */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="font-bold text-xl">
              InstantDevPortfolios
            </Link>
            <nav className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/editor" className="text-blue-600 font-medium">
                Customize
              </Link>
              <Link href="/export" className="text-gray-600 hover:text-gray-900">
                Export
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Editor</h1>
            <p className="mt-2 text-gray-600">Customize your portfolio's appearance and content</p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`${
                  activeTab === 'theme'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Theme & Layout
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Content
              </button>
            </nav>
          </div>

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-800">Live Preview</div> {/* Adjusted text color & weight */}
                  <div className="text-sm text-gray-600"> {/* Adjusted text color */}
                    Theme: <span className="font-semibold text-gray-700">{themes.find(t => t.id === selectedTheme)?.name || 'Default Theme'}</span> |
                    Layout: <span className="font-semibold text-gray-700">{layouts.find(l => l.id === selectedLayout)?.name || 'Standard Layout'}</span>
                  </div>
                </div>
              </div>
              {isLoadingData ? (
                <div className="h-[600px] flex items-center justify-center p-6 bg-gray-100"> {/* Matched body bg */}
                  <p className="text-gray-500 text-lg animate-pulse">Loading preview...</p> {/* Added animate-pulse */}
                </div>
              ) : (
                <div className="bg-white shadow-inner"> {/* Added shadow-inner for iframe container */}
                  <iframe
                    srcDoc={portfolioHtml}
                    title="Portfolio Preview"
                    className="w-full h-[600px] border-0" // Used className
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
          )}

          {/* Theme & Layout Tab */}
          {activeTab === 'theme' && (
            <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${isLoadingData ? 'opacity-60 cursor-not-allowed' : ''}`}> {/* Enhanced card style */}
              <fieldset disabled={isLoadingData} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Theme</h2> {/* Enhanced title */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased gap */}
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`rounded-lg p-4 cursor-pointer transition-all transform hover:scale-105 border-2 ${
                        selectedTheme === theme.id ? 'ring-4 ring-offset-2 ring-indigo-500 border-indigo-500' : 'border-gray-200 hover:border-indigo-400'
                      } bg-white shadow-md`} // Enhanced theme card
                    >
                      <div className={`h-24 w-full rounded-md mb-3 ${theme.color} flex items-center justify-center`}>
                         {selectedTheme === theme.id && <span className="text-white text-2xl">✔</span>}
                      </div>
                      <div className="font-semibold text-center text-gray-700">{theme.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Layout</h2> {/* Enhanced title */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased gap */}
                  {layouts.map((layout) => (
                    <div
                      key={layout.id}
                      onClick={() => setSelectedLayout(layout.id)}
                      className={`rounded-lg p-4 cursor-pointer transition-all transform hover:scale-105 border-2 ${
                        selectedLayout === layout.id ? 'ring-4 ring-offset-2 ring-indigo-500 border-indigo-500' : 'border-gray-200 hover:border-indigo-400'
                      } bg-white shadow-md`} // Enhanced layout card
                    >
                      <div className="h-24 w-full rounded-md mb-3 bg-gray-200 flex items-center justify-center p-2"> {/* Adjusted bg */}
                        {/* Simplified layout representations for Tailwind only */}
                        {layout.id === 'standard' && <div className="w-full space-y-2 p-2"><div className="h-4 bg-gray-400 rounded"></div><div className="h-4 bg-gray-400 rounded w-3/4"></div><div className="h-4 bg-gray-400 rounded w-1/2"></div></div>}
                        {layout.id === 'grid' && <div className="w-full grid grid-cols-2 gap-2 p-2"><div className="h-10 bg-gray-400 rounded"></div><div className="h-10 bg-gray-400 rounded"></div><div className="h-10 bg-gray-400 rounded col-span-2"></div></div>}
                        {layout.id === 'sidebar' && <div className="w-full flex gap-2 p-2"><div className="w-1/3 h-16 bg-gray-400 rounded"></div><div className="w-2/3 h-16 bg-gray-400 rounded"></div></div>}
                         {selectedLayout === layout.id && <span className="absolute top-2 right-2 text-indigo-600 text-2xl">✔</span>}
                      </div>
                      <div className="font-semibold text-center text-gray-700">{layout.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              </fieldset>
              <div className="mt-10 flex justify-end"> {/* Increased margin top */}
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving || isLoadingData}
                  className="py-2 px-6 font-semibold rounded-lg shadow-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50" // Enhanced button style
                >
                  {isSaving ? 'Saving...' : 'Save Theme & Layout'}
                </button>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white shadow-lg rounded-xl p-6 md:p-8"> {/* Enhanced card style */}
              {isLoadingData && <p className="text-center text-gray-500 mb-4 animate-pulse">Loading content...</p>}
              <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className={`space-y-10 ${isLoadingData ? 'opacity-60 cursor-not-allowed' : ''}`}> {/* Increased spacing */}
                <fieldset disabled={isLoadingData}>

                {/* User Info Section - Card like structure */}
                <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">About You</h2>
                  <div className="space-y-6"> {/* Increased spacing */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" placeholder="e.g., John Doe"/>
                    </div>
                    <div>
                      <label htmlFor="professionalTitle" className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                      <input type="text" name="professionalTitle" id="professionalTitle" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" placeholder="e.g., Senior Software Engineer"/>
                    </div>
                    <div>
                      <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                      <textarea id="aboutMe" name="aboutMe" rows={5} value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" placeholder="Tell us a bit about your work and passion..."/>
                    </div>
                  </div>
                </div>

                {/* Social Links Section - Card like structure */}
                <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Social Links</h2>
                    <button type="button" onClick={addSocialLink} className="py-1 px-3 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">+ Add Link</button>
                  </div>
                  <div className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <select value={link.platform} onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3">
                        {Object.values(SocialPlatform).map(platform => (
                          <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
                        ))}
                      </select>
                      <input type="url" value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" placeholder="https://example.com"/>
                      <button type="button" onClick={() => removeSocialLink(index)} className="py-1 px-3 text-sm font-medium rounded-md bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">- Remove</button>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Projects Section - Card like structure */}
                <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
                    <button type="button" onClick={addProject} className="py-1 px-3 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">+ Add Project</button>
                  </div>
                  <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                      {/* GitHub URL input and Fetch button */}
                      <div className="flex items-end space-x-2">
                        <div className="flex-grow">
                          <label htmlFor={`project-githubUrl-${index}`} className="block text-xs font-medium text-gray-600 mb-1">GitHub Repository URL</label>
                          <input
                            type="url"
                            id={`project-githubUrl-${index}`}
                            value={project.githubUrl || ''}
                            onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)}
                            placeholder="https://github.com/user/repo"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFetchGitHubRepoInfo(index, project.githubUrl || '')}
                          disabled={!project.githubUrl || isFetchingRepoInfo[index]}
                          className="py-2 px-3 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {isFetchingRepoInfo[index] ? 'Fetching...' : 'Fetch Repo Info'}
                        </button>
                      </div>

                      <div>
                        <label htmlFor={`project-name-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Project Name</label>
                        <input id={`project-name-${index}`} type="text" value={project.name} onChange={(e) => handleProjectChange(index, 'name', e.target.value)} placeholder="Project Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"/>
                      </div>
                      <div>
                        <label htmlFor={`project-desc-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea id={`project-desc-${index}`} value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} placeholder="Project Description" rows={3} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"/>
                      </div>
                      <div>
                        <label htmlFor={`project-tech-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Technologies (comma-separated)</label>
                        <input id={`project-tech-${index}`} type="text" value={project.technologies.join(', ')} onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)} placeholder="e.g., React, Node.js, Python" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`project-repoUrl-${index}`} className="block text-xs font-medium text-gray-600 mb-1">General Repository URL (optional)</label>
                          <input id={`project-repoUrl-${index}`} type="url" value={project.repositoryUrl || ''} onChange={(e) => handleProjectChange(index, 'repositoryUrl', e.target.value)} placeholder="Repository URL" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"/>
                        </div>
                        <div>
                          <label htmlFor={`project-liveUrl-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Live URL (optional)</label>
                          <input id={`project-liveUrl-${index}`} type="url" value={project.liveUrl || ''} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} placeholder="Live URL" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"/>
                        </div>
                      </div>
                      <div className="text-right">
                        <button type="button" onClick={() => removeProject(index)} className="py-1 px-3 text-sm font-medium rounded-md bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">- Remove Project</button>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                {fetchError && (
                  <div className="p-4 mb-4 rounded-md text-sm shadow bg-red-100 border border-red-300 text-red-800">
                    <p className="font-medium">Error fetching repo:</p>
                    <p>{fetchError}</p>
                  </div>
                )}
                {saveStatus && (
                  <div className={`p-4 mb-4 rounded-md text-sm shadow ${saveStatus.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}>
                    <p className="font-medium">{saveStatus.type === 'success' ? 'Success!' : 'Error'}</p>
                    {saveStatus.message}
                  </div>
                )}
                </fieldset>
                <div className="mt-10 flex justify-end"> {/* Increased margin top */}
                  <button
                    type="submit"
                    disabled={isSaving || isLoadingData}
                    className="py-2 px-6 font-semibold rounded-lg shadow-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50" // Enhanced button style
                  >
                    {isSaving ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme & Layout Tab */}
          {activeTab === 'theme' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Theme</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTheme === theme.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
                      }`}
                    >
                      <div className={`h-20 w-full rounded-md mb-3 ${theme.color}`}></div>
                      <div className="font-medium">{theme.name}</div>
                      {selectedTheme === theme.id && (
                        <div className="text-blue-600 text-sm mt-1">Selected</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Layout</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {layouts.map((layout) => (
                    <div
                      key={layout.id}
                      onClick={() => setSelectedLayout(layout.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedLayout === layout.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
                      }`}
                    >
                      <div className="h-20 w-full rounded-md mb-3 bg-gray-100 flex items-center justify-center">
                        {layout.id === 'standard' && (
                          <div className="w-3/4 space-y-2">
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          </div>
                        )}
                        {layout.id === 'grid' && (
                          <div className="w-3/4 grid grid-cols-2 gap-2">
                            <div className="h-8 bg-gray-300 rounded"></div>
                            <div className="h-8 bg-gray-300 rounded"></div>
                            <div className="h-8 bg-gray-300 rounded"></div>
                            <div className="h-8 bg-gray-300 rounded"></div>
                          </div>
                        )}
                        {layout.id === 'sidebar' && (
                          <div className="w-3/4 flex gap-2">
                            <div className="w-1/3 h-16 bg-gray-300 rounded"></div>
                            <div className="w-2/3 space-y-2">
                              <div className="h-3 bg-gray-300 rounded"></div>
                              <div className="h-3 bg-gray-300 rounded"></div>
                              <div className="h-3 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="font-medium">{layout.name}</div>
                      {selectedLayout === layout.id && (
                        <div className="text-blue-600 text-sm mt-1">Selected</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} InstantDevPortfolios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );

  // Handler functions for dynamic fields (Social Links and Projects)
  function handleSocialLinkChange(index: number, field: keyof SocialLinkState, value: string) {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  }

  function addSocialLink() {
    setSocialLinks([...socialLinks, { platform: SocialPlatform.GitHub, url: '' }]);
  }

  function removeSocialLink(index: number) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  }

  function handleProjectChange(index: number, field: keyof ProjectState, value: string | string[]) {
    const updatedProjects = [...projects];
    // Ensure technologies is always an array
    if (field === 'technologies' && typeof value === 'string') {
        updatedProjects[index] = { ...updatedProjects[index], [field]: value.split(',').map(t => t.trim()).filter(t => t) };
    } else {
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    }
    setProjects(updatedProjects);
  }

  function addProject() {
    setProjects([...projects, { name: '', description: '', technologies: [], repositoryUrl: '', githubUrl: '', liveUrl: '' }]);
  }

  function removeProject(index: number) {
    setProjects(projects.filter((_, i) => i !== index));
  }

  // Handle Save Changes
  async function handleSaveChanges() {
    setIsSaving(true);
    setSaveStatus(null);
    setFetchError(null); // Clear GitHub fetch error on save attempt

    const finalSocialLinks = socialLinks.map(sl => ({
      ...sl,
      platform: sl.platform as SocialPlatform
    })).filter(sl => sl.url);

    const finalProjects = projects.map(p => ({
      ...p,
      technologies: Array.isArray(p.technologies) ? p.technologies : p.technologies.join(',').split(',').map(t=>t.trim()).filter(t=>t)
    })).filter(p => p.name && p.description);

    const portfolioDataToSave = {
      userInfo: { name, professionalTitle, aboutMe, profilePictureUrl: profilePictureUrl || undefined },
      socialLinks: finalSocialLinks,
      projects: finalProjects,
      themeId: selectedTheme,
      layoutId: selectedLayout,
      customCss: customCss || undefined,
    };

    try {
      const response = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioDataToSave),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSaveStatus({ message: 'Portfolio saved successfully!', type: 'success' });
      } else {
        setSaveStatus({ message: result.error || 'Failed to save portfolio.', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setSaveStatus({ message: (error as Error).message || "An unknown error occurred during save.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFetchGitHubRepoInfo(projectIndex: number, githubUrl: string) {
    if (!githubUrl || !githubUrl.includes('github.com')) {
      setFetchError('Please enter a valid GitHub repository URL.');
      return;
    }
    setFetchError(null);
    setIsFetchingRepoInfo(prev => ({ ...prev, [projectIndex]: true }));

    try {
      const response = await fetch(`/api/github-repo?repoUrl=${encodeURIComponent(githubUrl)}`);
      const result = await response.json();

      if (response.ok && result.success) {
        const { name, description, language } = result.data;
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = {
          ...updatedProjects[projectIndex],
          name: name || updatedProjects[projectIndex].name,
          description: description || updatedProjects[projectIndex].description,
          githubUrl: result.data.html_url, // Use the URL from GitHub API as source of truth
          // Optionally add language as a technology if not already present
          technologies: language && !updatedProjects[projectIndex].technologies.includes(language)
            ? [...updatedProjects[projectIndex].technologies, language]
            : updatedProjects[projectIndex].technologies,
        };
        setProjects(updatedProjects);
        setSaveStatus({ message: `Fetched info for ${name}. Remember to save all changes.`, type: 'success'});
      } else {
        setFetchError(result.message || 'Failed to fetch repository info.');
      }
    } catch (error) {
      console.error('Error fetching GitHub repo info:', error);
      setFetchError((error as Error).message || 'An unknown error occurred while fetching repo info.');
    } finally {
      setIsFetchingRepoInfo(prev => ({ ...prev, [projectIndex]: false }));
    }
  }
}