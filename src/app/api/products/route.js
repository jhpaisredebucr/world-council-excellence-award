import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        let products = [];
        let packages = [];
        
        try {
            const productsResult = await query("SELECT * FROM products");
            products = productsResult.map(product => ({
                ...product,
                price: Number(product.price)
            }));
        } catch (productError) {
            console.error("[GET /api/products] products query error:", productError);
        }
        
        try {
            const packagesResult = await query("SELECT * FROM packages");
            packages = packagesResult.map(packageItem => ({
                ...packageItem,
                price: Number(packageItem.price)
            }));
        } catch (packageError) {
            console.error("[GET /api/products] packages query error:", packageError);
        }

        return NextResponse.json({ 
            products: products,
            packages: packages
        });
    } catch (err) {
        console.error("[GET /api/products] outer error:", err);
        return NextResponse.json({ 
            success: false, 
            message: err.message,
            products: [],
            packages: []
        }, { status: 500 })
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
    const bodyType = body.type; // 'product' or 'package'
    const product_name = body.product_name?.trim();
    const package_name = body.package_name?.trim();
    const description = body.description?.trim() || "";
    const price = Number(body.price);
    const img_url = body.img_url?.trim();

    // Check if it's a package or product
    if (bodyType === 'package' || package_name) {
      // Create package
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
          price: Number(createdPackage[0].price)
        }
      });
    } else {
      // Create product
      if (!product_name || !img_url || Number.isNaN(price) || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid product payload" },
          { status: 400 }
        );
      }

      const createdProduct = await query(
        `INSERT INTO products (user_id, product_name, description, price, img_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userResult[0].id, product_name, description, price, img_url]
      );

      return NextResponse.json({
        success: true,
        product: {
          ...createdProduct[0],
          price: Number(createdProduct[0].price)
        }
      });
    }
  } catch (err) {
    console.error("[POST /api/products] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
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
    const deleteType = body.type; // 'product' or 'package'
    const deleteId = Number(body?.id);

    if (!Number.isInteger(deleteId) || deleteId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    // Check if it's a package or product
    if (deleteType === 'package') {
      // Delete package
      const deletedPackages = await query(
        "DELETE FROM packages WHERE id = $1 RETURNING id",
        [deleteId]
      );

      if (!deletedPackages.length) {
        return NextResponse.json(
          { success: false, message: "Package not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        deletedId: deletedPackages[0].id
      });
    } else {
      // Delete product
      const deletedProducts = await query(
        "DELETE FROM products WHERE id = $1 RETURNING id",
        [deleteId]
      );

      if (!deletedProducts.length) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        deletedId: deletedProducts[0].id
      });
    }
  } catch (err) {
    console.error("[DELETE /api/products] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}