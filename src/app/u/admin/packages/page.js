"use client";

import { useEffect, useMemo, useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import ConfirmModal from "@/app/components/modal/ConfirmModal";

const initialForm = {
  package_name: "",
  description: "",
  price: ""
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

async function fetchPackages() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products", { credentials: "include" });
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
  }, []);

  async function uploadPackageImage(file) {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "packages");
    uploadData.append("public_id", `package-${Date.now()}`);
    uploadData.append("overwrite", "false");

    const uploadRes = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: uploadData
    });
    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok || !uploadJson.success) {
      throw new Error(uploadJson.message || "Package image upload failed");
    }

    return uploadJson.public_id;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!imageFile) {
      setError("Please select a package image");
      return;
    }

    if (!form.package_name.trim()) {
      setError("Package name is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Package price must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);
      const imagePublicId = await uploadPackageImage(imageFile);

const createRes = await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'package',
          package_name: form.package_name,
          description: form.description,
          price: Number(form.price),
          img_url: imagePublicId
        })
      });

      const createJson = await createRes.json();

      if (!createRes.ok || !createJson.success) {
        throw new Error(createJson.message || "Failed to create package");
      }

      setPackages((prev) => [createJson.package, ...prev]);
      setForm(initialForm);
      setImageFile(null);
      setSuccessMessage("Package added successfully");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || "Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeletePackage(packageItem) {
    if (!packageItem?.id) return;

    setError("");
    setSuccessMessage("");

    try {
      setDeletingId(packageItem.id);
const deleteRes = await fetch("/api/products", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'package', id: packageItem.id })
      });

      const deleteJson = await deleteRes.json();

      if (!deleteRes.ok || !deleteJson.success) {
        throw new Error(deleteJson.message || "Failed to remove package");
      }

      setPackages((prev) => prev.filter((item) => item.id !== packageItem.id));
      setSuccessMessage("Package removed successfully");
      setPackageToDelete(null);
    } catch (deleteError) {
      console.error(deleteError);
      setError(deleteError.message || "Failed to remove package");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={Boolean(packageToDelete)}
        onClose={() => setPackageToDelete(null)}
        onConfirm={() => handleDeletePackage(packageToDelete)}
        title="Remove Package"
        content={
          packageToDelete
            ? `Are you sure you want to remove "${packageToDelete.package_name}"?`
            : ""
        }
        button={deletingId ? "Removing..." : "Remove"}
        buttonColor="bg-red-600"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add new packages and upload package images for the shop.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-2 md:p-6"
      >
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Package Name
          </label>
          <input
            type="text"
            value={form.package_name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, package_name: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Example: Networking Router"
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={form.price}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, price: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="0"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Short package description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Package Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-secondary/20 file:px-3 file:py-2 file:text-primary"
          />
        </div>

        {previewUrl && (
          <div className="md:col-span-2">
            <Image
              src={previewUrl}
              alt="Package preview"
              width={160}
              height={160}
              unoptimized
              className="h-40 w-40 rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        {error && (
          <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="md:col-span-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </p>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Package"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Current Packages</h2>
          <button
            onClick={fetchPackages}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading packages...</p>
        ) : packages.length === 0 ? (
          <p className="text-sm text-gray-500">No packages found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((packageItem) => (
              <div
                key={packageItem.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="h-40 w-full bg-gray-100">
                  {packageItem.img_url ? (
                    <CldImage
                      src={`/${packageItem.img_url}`}
                      alt={packageItem.package_name}
                      width={320}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <h3 className="font-semibold text-gray-800">{packageItem.package_name}</h3>
                  <p className="line-clamp-2 text-sm text-gray-500">
                    {packageItem.description || "No description"}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    P{Number(packageItem.price || 0).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPackageToDelete(packageItem)}
                    disabled={deletingId === packageItem.id}
                    className="mt-2 w-full rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === packageItem.id ? "Removing..." : "Remove Package"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
