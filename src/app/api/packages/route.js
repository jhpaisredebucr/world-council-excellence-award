import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const packages = await query("SELECT * FROM packages ORDER BY created_at DESC");

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem,
      price: Number(packageItem.price),
    }));

    return NextResponse.json({
      success: true,
      packages: formattedPackages,
    });
  } catch (err) {
    console.error("[GET /api/packages] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userResult = await query(
      "SELECT id, role FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (!userResult.length || userResult[0].role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const package_name = body.package_name?.trim();
    const description = body.description?.trim() || "";
    const price = Number(body.price);
    const img_url = body.img_url?.trim();

    if (!package_name || !img_url || Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid package payload" },
        { status: 400 }
      );
    }

    const createdPackage = await query(
      `INSERT INTO packages (package_name, description, price, img_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [package_name, description, price, img_url]
    );

    return NextResponse.json({
      success: true,
      package: {
        ...createdPackage[0],
        price: Number(createdPackage[0].price),
      },
    });
  } catch (err) {
    console.error("[POST /api/packages] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create package" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userResult = await query(
      "SELECT id, role FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (!userResult.length || userResult[0].role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const packageId = Number(body?.id);

    if (!Number.isInteger(packageId) || packageId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid package id" },
        { status: 400 }
      );
    }

    const deletedPackages = await query(
      "DELETE FROM packages WHERE id = $1 RETURNING id",
      [packageId]
    );

    if (!deletedPackages.length) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: deletedPackages[0].id,
    });
  } catch (err) {
    console.error("[DELETE /api/packages] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete package" },
      { status: 500 }
    );
  }
}
