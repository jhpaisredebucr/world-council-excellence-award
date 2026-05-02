//SERVER COMPONENT

"use client";

import Profile from "@/app/components/ui/Profile";
import ProfileCard from "@/app/components/card/ProfileCard";
import UploadImageModal from "@/app/components/modal/UploadPicture";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inputStyle =
    "w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0";

  // FETCH USER DATA
  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchJson("/api/users");

        if (!res.success) throw new Error("Failed to load user");

        setFormData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-dashed"></div>
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center text-xl text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // UPDATE INPUT FIELDS
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!data.success) {
        alert("Update failed");
        return;
      }

      alert("Profile updated successfully");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // UPLOAD IMAGE → CLOUDINARY → UPDATE formData
  async function handleUpload(file) {
    if (!file) {
      alert("No file selected");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", `users/${formData.userInfo.id}/profile`);
    uploadData.append("public_id", `${formData?.userInfo.id}-profile`);
    uploadData.append("overwrite", "true");
    console.log(formData);

    const cloudinaryRes = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: uploadData,
    });

    const cloudinaryData = await cloudinaryRes.json();

    if (!cloudinaryData.url) {
      alert("Upload failed");
      return;
    }

    console.log("Cloudinary URL:", cloudinaryData.url);

    // SINGLE SOURCE OF TRUTH UPDATE
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        img_url: cloudinaryData.url
      }
    }));
    console.log(formData);
  }

  const { profile, contacts, address, userInfo, referredBy } = formData || {};

  return (
    <div className="mx-auto mt-3 flex w-full max-w-3xl flex-col items-center rounded-xl bg-white p-4 shadow-md sm:mt-6 sm:p-6">

      {/* MODAL */}
      <UploadImageModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* PROFILE IMAGE */}
      <Profile
        GoProfile={setIsUploadOpen}
        profile={profile?.img_url}
        code="w-24 h-24 rounded-full object-cover"
      />

      {/* NAME */}
      <p className="text-lg font-semibold mt-2">
        {profile?.first_name} {profile?.middle_name} {profile?.last_name}
      </p>

      {/* PERSONAL INFO */}
      <div className="mt-6 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
        <ProfileCard label="First Name">
          <input
            className={inputStyle}
            value={profile?.first_name || ""}
            onChange={e => handleChange("profile", "first_name", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Middle Name">
          <input
            className={inputStyle}
            value={profile?.middle_name || ""}
            onChange={e => handleChange("profile", "middle_name", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Last Name">
          <input
            className={inputStyle}
            value={profile?.last_name || ""}
            onChange={e => handleChange("profile", "last_name", e.target.value)}
          />
        </ProfileCard>
      </div>

      {/* ACCOUNT INFO */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="Username">
          <input
            className={inputStyle}
            value={userInfo?.username || ""}
            onChange={e => handleChange("userInfo", "username", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Referral Code">
          <input
            className={inputStyle}
            value={userInfo?.referral_code || ""}
            disabled
          />
        </ProfileCard>
      </div>

<div className="mt-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="Referred By">
          <input
            className={inputStyle}
            value={referredBy?.username || ""}
            disabled
          />
        </ProfileCard>

        <ProfileCard label="Package">
          <input
            className={inputStyle}
            value={userInfo?.package || ""}
            disabled
          />
        </ProfileCard>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="Email">
          <input
            className={inputStyle}
            value={contacts?.email || ""}
            onChange={e => handleChange("contacts", "email", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Contact No">
          <input
            className={inputStyle}
            value={contacts?.contact_no || ""}
            onChange={e => handleChange("contacts", "contact_no", e.target.value)}
          />
        </ProfileCard>
      </div>

      {/* ADDRESS */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="City">
          <input
            className={inputStyle}
            value={address?.city || ""}
            onChange={e => handleChange("address", "city", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Barangay">
          <input
            className={inputStyle}
            value={address?.barangay || ""}
            onChange={e => handleChange("address", "barangay", e.target.value)}
          />
        </ProfileCard>
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="Postal Code">
          <input
            className={inputStyle}
            value={address?.postal_code || ""}
            onChange={e => handleChange("address", "postal_code", e.target.value)}
          />
        </ProfileCard>

        <ProfileCard label="Street Address">
          <input
            className={inputStyle}
            value={address?.street_address || ""}
            onChange={e => handleChange("address", "street_address", e.target.value)}
          />
        </ProfileCard>
      </div>

      {/* DOB */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2">
        <ProfileCard label="Date of Birth">
          <input
            type="date"
            className={inputStyle}
            value={profile?.dob || ""}
            onChange={e => handleChange("profile", "dob", e.target.value)}
          />
        </ProfileCard>
      </div>

      {/* STATUS + ROLE */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <ProfileCard label="Status">
          <input
            className={inputStyle}
            value={userInfo?.status || ""}
            disabled
          />
        </ProfileCard>

        <ProfileCard label="Role">
          <input
            className={inputStyle}
            value={userInfo?.role || ""}
            disabled
          />
        </ProfileCard>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
      >
        Save Changes
      </button>

    </div>
  );
}