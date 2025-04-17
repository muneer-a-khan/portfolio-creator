import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl">InstantDevPortfolios</div>
          <nav className="flex gap-4">
            <Link href="/login" className="px-4 py-2 hover:underline">
              Login
            </Link>
            <Link
              href="/checkout"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Create Your Professional Portfolio In Minutes
                </h1>
                <p className="text-xl text-gray-600">
                  Showcase your projects, skills, and expertise with our beautifully designed developer portfolios.
                  Integrate with GitHub, customize layouts, and download your portfolio instantly.
                </p>
                <div className="pt-4">
                  <Link
                    href="/checkout"
                    className="inline-block px-8 py-4 bg-black text-white font-medium rounded-md hover:bg-black/80"
                  >
                    Create My Portfolio - $10
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                    Portfolio Preview Placeholder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need To Impress</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
                <p className="text-gray-600">Automatically import your projects from GitHub and showcase them beautifully.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Layouts</h3>
                <p className="text-gray-600">Choose from beautiful, responsive layouts that showcase your work effectively.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Export</h3>
                <p className="text-gray-600">Download your portfolio as a static site and deploy it anywhere with our simple guide.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} InstantDevPortfolios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
