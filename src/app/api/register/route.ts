import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import bcrypt from 'bcrypt';

// Bcrypt salt rounds (higher is more secure but slower)
const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 409 }
      );
    }

    // Hash the password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        // Create default portfolio settings for the new user
        settings: {
          create: {
            theme: 'default',
            layout: 'standard',
            aboutMe: '',
          }
        }
      }
    });

    // Return success but don't include sensitive information
    return NextResponse.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to register user' }),
      { status: 500 }
    );
  }
} 