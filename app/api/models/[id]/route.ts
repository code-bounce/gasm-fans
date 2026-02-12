import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const model = await prisma.model.findUnique({
      where: { id },
      include: {
        videos: true,
      },
    });

    console.log("Fetched model:", model);

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error("Error fetching model:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch model",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, ethnicity, gender, image, bio, dateOfBirth, measurements } =
      body;

    const model = await prisma.model.update({
      where: { id },
      data: {
        name,
        ethnicity,
        gender,
        image,
        bio,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        measurements,
      },
      include: {
        videos: true,
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error("Error updating model:", error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.model.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 },
    );
  }
}
