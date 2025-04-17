'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedLayout, setSelectedLayout] = useState('standard');
  
  const themes = [
    { id: 'default', name: 'Default', color: 'bg-blue-500' },
    { id: 'dark', name: 'Dark Mode', color: 'bg-gray-800' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gray-200' },
  ];
  
  const layouts = [
    { id: 'standard', name: 'Standard' },
    { id: 'grid', name: 'Grid' },
    { id: 'sidebar', name: 'Sidebar' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
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
                  <div className="text-lg font-medium text-blue-900">Preview</div>
                  <div className="text-sm text-blue-700">
                    Theme: <span className="font-medium">{themes.find(t => t.id === selectedTheme)?.name}</span> | 
                    Layout: <span className="font-medium">{layouts.find(l => l.id === selectedLayout)?.name}</span>
                  </div>
                </div>
              </div>
              <div className="h-[600px] flex items-center justify-center p-6 bg-gray-50">
                <div className="text-center">
                  <div className="text-lg text-gray-500 mb-4">Portfolio Preview</div>
                  <div className="relative w-full max-w-2xl h-[400px] mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">Your Portfolio</div>
                        <div className="text-gray-500">This is where your portfolio preview will appear</div>
                      </div>
                    </div>
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
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white shadow rounded-lg p-6">
              <form className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About You</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Full-Stack Developer"
                      />
                    </div>
                    <div>
                      <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        About Me
                      </label>
                      <textarea
                        id="about"
                        name="about"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Write a short description about yourself..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Social Links</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="github"
                        id="github"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        id="linkedin"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/yourusername"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Personal Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
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
} 