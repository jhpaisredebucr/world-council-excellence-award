//CLIENT COMPONENT

'use client';

import { useEffect, useState } from "react";
import AnnouncementCard from "../card/AnnouncementCard";
import Title from "@/app/components/ui/Title";

export default function AnnouncementMember({ announcements, userData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const role = userData?.userInfo?.role ?? "member";
  
  const filterAnnouncements = announcements.filter(user =>
    user.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.long_description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

      } catch (err) {
        console.error(err);
        setError('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex">
        <div className="w-full ml-56 px-20 py-7 bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <div className="text-xl text-gray-700">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex">
        <div className="w-full ml-56 px-20 py-7 bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-xl max-w-md text-center flex flex-col items-center gap-4">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-3 rounded-lg shadow bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Title
          title="Announcement"
          icon="/icons/announcement.svg"
        />
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
          <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
              onClick={() => setSearchTerm('')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 whitespace-nowrap shrink-0 text-sm"
          >
              Clear
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Regular Announcements */}
        <div className="space-y-4 lg:col-span-2">
          {filterAnnouncements.map((announcement) => (
            <AnnouncementCard
                key={announcement.id}
                announcements={announcement}
                role={role}
            />
          ))}
        </div>
        
        {/* Facebook API Announcement Card */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.10)] bg-white border-2 border-blue-500 sticky top-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  f
                </div>
                <div>
                  <p className="font-semibold text-blue-600">Facebook API Integration</p>
                  <p className="text-sm text-gray-400">System Announcement</p>
                </div>
              </div>
            </div>
            <p className="font-semibold my-5 text-lg">
              Facebook API Now Available
            </p>
            <p className="text-gray-700">
              We're excited to announce that Facebook API integration is now live! Connect your Facebook account to enable social sharing, profile synchronization, and enhanced networking features. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
