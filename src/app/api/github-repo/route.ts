import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get('repoUrl');

  if (!repoUrl) {
    return NextResponse.json({ success: false, message: 'Repository URL is required.' }, { status: 400 });
  }

  try {
    const url = new URL(repoUrl);
    if (url.hostname !== 'github.com') {
      return NextResponse.json({ success: false, message: 'Invalid GitHub URL provided.' }, { status: 400 });
    }

    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length < 2) {
      return NextResponse.json({ success: false, message: 'Invalid GitHub repository path.' }, { status: 400 });
    }

    const username = pathParts[0];
    const repositoryName = pathParts[1];

    const githubApiUrl = `https://api.github.com/repos/${username}/${repositoryName}`;

    const response = await fetch(githubApiUrl, {
      headers: {
        'User-Agent': 'PortfolioBuilderApp/1.0', // Recommended by GitHub API
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      let errorMessage = `Failed to fetch repository details: ${errorData.message || response.statusText}`;
      if (response.status === 404) {
        errorMessage = 'Repository not found or is private.';
      } else if (response.status === 403) {
        errorMessage = 'GitHub API rate limit exceeded or access forbidden.';
      }
      return NextResponse.json({ success: false, message: errorMessage }, { status: response.status });
    }

    const data = await response.json();

    const { name, description, language, html_url } = data;

    return NextResponse.json({ 
      success: true, 
      data: { 
        name: name || repositoryName, // Fallback to parsed name if API name is null
        description: description || '', 
        language: language || null, 
        html_url 
      } 
    });

  } catch (error) {
    console.error('Error in /api/github-repo:', error);
    let message = 'An unexpected error occurred.';
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        message = 'The provided URL is invalid.';
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
