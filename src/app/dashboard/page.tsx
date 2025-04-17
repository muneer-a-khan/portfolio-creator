'use client';

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [projects] = useState([
    {
      id: "1",
      title: "Personal Blog",
      description: "A personal blog built with Next.js and TailwindCSS.",
      githubLink: "https://github.com/user/blog",
    },
    {
      id: "2",
      title: "E-commerce Store",
      description: "An e-commerce store built with React and Node.js.",
      githubLink: "https://github.com/user/store",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="font-bold text-xl">InstantDevPortfolios</div>
          <nav className="flex gap-4 items-center">
            <Link href="/editor" className="text-blue-600 hover:text-blue-800">
              Customize
            </Link>
            <Link href="/export" className="text-blue-600 hover:text-blue-800">
              Export
            </Link>
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Project
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex gap-4">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
                <button className="text-red-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Portfolio Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <select className="w-full p-2 border rounded-md">
                <option value="default">Default</option>
                <option value="dark">Dark Mode</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Layout</h3>
              <select className="w-full p-2 border rounded-md">
                <option value="standard">Standard</option>
                <option value="grid">Grid</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">About Me</h3>
              <textarea 
                className="w-full p-2 border rounded-md h-32" 
                placeholder="Write a brief introduction about yourself..."
              ></textarea>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">LinkedIn URL</h3>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">GitHub URL</h3>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 