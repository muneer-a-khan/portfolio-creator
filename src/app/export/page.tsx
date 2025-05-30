'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generatePortfolioHtml, samplePortfolioData } from '../../lib/portfolio-generator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setExportComplete(false); // Reset for re-export
    console.log('Starting export...');

    try {
      const htmlContent = generatePortfolioHtml(samplePortfolioData);
      const zip = new JSZip();
      zip.file("index.html", htmlContent);
      // TODO: Add other assets like images, custom CSS files if any from samplePortfolioData
      // e.g., if (samplePortfolioData.customCss) zip.file("style.css", samplePortfolioData.customCss);
      // and ensure index.html links to style.css

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "portfolio.zip");

      console.log('Export finished and download triggered.');
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Add user-facing error message in the UI
    } finally {
      setExporting(false);
    }
  };

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
              <Link href="/editor" className="text-gray-600 hover:text-gray-900">
                Customize
              </Link>
              <Link href="/export" className="text-blue-600 font-medium">
                Export
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Export Your Portfolio</h1>
          
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Your portfolio will be packaged as a ZIP file containing an `index.html` file. You can host this on any web hosting service.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Export as Static Website</h2>
                  <p className="text-sm text-gray-500">Download a complete static website that you can deploy anywhere.</p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    exporting ? 'bg-blue-400 cursor-not-allowed' : exportComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {exporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : exportComplete ? (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Download Portfolio.zip Again
                    </>
                  ) : (
                    'Generate and Download ZIP'
                  )}
                </button>
              </div>
            </div>

            {exportComplete && !exporting && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Portfolio ZIP Generated!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>If your download didn&apos;t start automatically, click the &quot;Download Portfolio.zip Again&quot; button. Check out our <Link href="/instructions" className="font-medium underline">deployment guide</Link> for step-by-step instructions on how to publish your portfolio online.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-4 border border-gray-200 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help Deploying?</h2>
              <p className="text-sm text-gray-500 mb-4">
                We've created an easy-to-follow guide for deploying your portfolio on popular platforms like:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-2 mb-4">
                <li>GitHub Pages (Free)</li>
                <li>Netlify (Free)</li>
                <li>Vercel (Free)</li>
                <li>Any web hosting service</li>
              </ul>
              <Link
                href="/instructions"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View Deployment Guide →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 