import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        models: true,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video" },
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
    const {
      title,
      description,
      url,
      previewUrl,
      thumbnail,
      duration,
      views,
      modelIds,
    } = body;

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        url,
        previewUrl,
        thumbnail,
        duration,
        views,
        models: modelIds
          ? {
              set: modelIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        models: true,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update video" },
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
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 },
    );
  }
}
