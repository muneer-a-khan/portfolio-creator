import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/export" className="text-gray-600 hover:text-gray-900">
                Export
              </Link>
              <Link href="/instructions" className="text-blue-600 font-medium">
                Deployment Guide
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Deployment Guide</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg">
              After exporting your portfolio as a ZIP file, you can deploy it to various platforms. 
              Here are step-by-step instructions for the most popular options:
            </p>

            <div className="mt-8 space-y-12">
              {/* GitHub Pages */}
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">GitHub Pages (Free)</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Create a new repository on GitHub named <code className="bg-gray-100 px-1 py-0.5 rounded">username.github.io</code> (replace "username" with your GitHub username)</li>
                  <li>Extract the ZIP file you downloaded from our export page</li>
                  <li>
                    Push the contents to your new repository:
                    <pre className="bg-gray-800 text-white p-3 rounded-md mt-2 overflow-x-auto">
                      <code>
                        git init<br/>
                        git add .<br/>
                        git commit -m "Initial commit"<br/>
                        git branch -M main<br/>
                        git remote add origin https://github.com/username/username.github.io.git<br/>
                        git push -u origin main
                      </code>
                    </pre>
                  </li>
                  <li>Go to your repository settings, navigate to "Pages" in the left sidebar</li>
                  <li>Under "Source", select "main" branch and the root directory, then click "Save"</li>
                  <li>Wait a few minutes, and your site will be live at <code className="bg-gray-100 px-1 py-0.5 rounded">https://username.github.io</code></li>
                </ol>
              </div>

              {/* Netlify */}
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Netlify (Free)</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Create an account on <a href="https://www.netlify.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Netlify</a> if you don't have one</li>
                  <li>From your Netlify dashboard, click "Add new site" {'->'} "Deploy manually"</li>
                  <li>Extract the ZIP file you downloaded from our export page</li>
                  <li>Drag and drop the extracted folder into the upload area on Netlify</li>
                  <li>Wait for the upload to complete and your site will be live instantly</li>
                  <li>You can configure a custom domain in the site settings if desired</li>
                </ol>
              </div>

              {/* Vercel */}
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vercel (Free)</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Create an account on <a href="https://vercel.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel</a> if you don't have one</li>
                  <li>Extract the ZIP file you downloaded from our export page</li>
                  <li>Push the extracted files to a GitHub repository</li>
                  <li>From your Vercel dashboard, click "New Project"</li>
                  <li>Import your GitHub repository</li>
                  <li>Keep all default settings and click "Deploy"</li>
                  <li>Your site will be live in a few seconds with a Vercel subdomain</li>
                  <li>You can configure a custom domain in the project settings</li>
                </ol>
              </div>

              {/* Any web hosting */}
              <div className="bg-white p-6 border border-gray-200 rounded-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Any Web Hosting Service</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Extract the ZIP file you downloaded from our export page</li>
                  <li>Upload all files to your web hosting service using FTP or their file manager</li>
                  <li>Place the files in the public HTML directory (usually called "public_html", "www", or "htdocs")</li>
                  <li>Your site will be accessible at your domain name</li>
                </ol>
                <p className="mt-4 text-gray-700">
                  Popular web hosting services include:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>Bluehost</li>
                  <li>HostGator</li>
                  <li>DreamHost</li>
                  <li>SiteGround</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-blue-50 p-6 rounded-md">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Need Help?</h2>
              <p className="text-blue-700">
                If you encounter any issues during deployment, please contact our support team at support@instantdevportfolios.com 
                or refer to our <a href="#" className="font-medium underline">FAQ section</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} InstantDevPortfolios. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 