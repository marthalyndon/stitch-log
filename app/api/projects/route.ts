import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/db';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating project with data:', data);
    const project = await createProject(data);
    console.log('Project created successfully:', project);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating project:', error);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error code:', error?.code);
    console.error('❌ Error details:', error?.details);
    console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

