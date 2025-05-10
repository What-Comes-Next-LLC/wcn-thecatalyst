'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Story {
  id: string;
  title: string;
  image_url: string | null;
  link: string | null;
  is_wcn: boolean;
  created_at: string;
}

interface Feed {
  id: string;
  url: string;
  label: string;
  created_at: string;
}

export default function PRWallPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      const { data: feedsData } = await supabase
        .from('feeds')
        .select('*')
        .order('created_at', { ascending: false });
      setStories(storiesData || []);
      setFeeds(feedsData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Combine stories and feeds for the grid
  const gridItems = [
    ...stories.map(story => ({
      type: 'story',
      id: story.id,
      title: story.title,
      image_url: story.image_url,
      link: story.link,
      info: story.is_wcn ? 'WCN Story' : 'External Story',
    })),
    ...feeds.map(feed => ({
      type: 'feed',
      id: feed.id,
      title: feed.label,
      image_url: null,
      link: feed.url,
      info: 'External Feed',
    })),
  ];

  return (
    <main className="min-h-screen bg-[#216869] text-[#dce1de] font-sans">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Mojoverse Wall</h1>
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {gridItems.map((item, idx) => (
              <div key={item.id} className="group perspective w-full h-64">
                <div className="relative w-full h-full transition-transform duration-500 group-hover:rotate-y-180 preserve-3d">
                  {/* Front: Image or placeholder + title */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-lg flex items-center justify-center text-2xl font-bold backface-hidden overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="object-cover w-full h-full rounded-lg opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#49a078]/60">
                        <span className="text-2xl font-bold">{item.title}</span>
                      </div>
                    )}
                    <span className="absolute bottom-4 left-4 text-lg font-semibold bg-[#216869]/70 px-3 py-1 rounded text-[#dce1de]">
                      {item.title}
                    </span>
                  </div>
                  {/* Back: Info text or link */}
                  <div className="absolute inset-0 bg-[#49a078]/80 backdrop-blur-md border border-white/30 shadow-lg rounded-lg flex flex-col items-center justify-center backface-hidden rotate-y-180 p-4">
                    <h2 className="text-xl font-bold mb-2">{item.info}</h2>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-base underline text-[#dce1de] break-all">Read More</a>
                    ) : (
                      <p className="text-base">No link available.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 