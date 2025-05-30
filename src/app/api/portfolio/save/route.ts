import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getServerSession } from "next-auth/next"; // Placeholder for auth
// import { authOptions } from "@/lib/auth"; // Placeholder for auth options

// Ensure PrismaClient is initialized, possibly from a shared lib/db.ts file in a real app
const prisma = new PrismaClient();

// Define a type for the expected request body structure
// This should align with src/types/portfolio.ts but might need adjustments for Prisma (e.g. Json fields)
interface PortfolioSaveRequestBody {
  userInfo: any; // Should be UserInfo from src/types/portfolio
  socialLinks: any[]; // Should be SocialLink[] from src/types/portfolio
  projects: any[]; // Should be Project[] from src/types/portfolio
  themeId?: string;
  layoutId?: string;
  customCss?: string;
}

export async function POST(req: NextRequest) {
  // TODO: Replace with actual authentication to get userId
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  // const authenticatedUserId = session.user.id;
  const authenticatedUserId = 'user_placeholder_123abc'; // Hardcoded for now

  try {
    const body = (await req.json()) as PortfolioSaveRequestBody;

    const {
      userInfo,
      socialLinks,
      projects,
      themeId = 'default',
      layoutId = 'standard',
      customCss,
    } = body;

    // Validate required fields (basic validation)
    if (!userInfo || !socialLinks || !projects) {
      return NextResponse.json(
        { success: false, error: 'Missing required portfolio data.' },
        { status: 400 }
      );
    }
    
    // For Prisma Json fields, data must be stored as a JSON string if it's an array or complex object.
    // Prisma handles serialization for Json type if you pass an object/array directly.
    // However, if you changed from Json[] to Json to support SQLite,
    // you must ensure the client sends a JSON string, or stringify here.
    // For this implementation, we assume Prisma client handles JS objects/arrays correctly for Json type.
    // If Json[] was changed to Json for SQLite, the actual data (arrays) are stored within that Json field.

    const portfolioData = {
      userId: authenticatedUserId,
      userInfo: userInfo, // Prisma expects a JSON-compatible object
      socialLinks: socialLinks, // Prisma expects a JSON-compatible object (array of objects)
      projects: projects, // Prisma expects a JSON-compatible object (array of objects)
      themeId: themeId,
      layoutId: layoutId,
      customCss: customCss,
    };

    const savedPortfolio = await prisma.portfolio.upsert({
      where: { userId: authenticatedUserId },
      create: portfolioData,
      update: {
        ...portfolioData,
        userId: undefined, // Cannot update userId
        lastUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: savedPortfolio }, { status: 200 });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: 'Failed to save portfolio data.', details: errorMessage },
      { status: 500 }
    );
  }
}
