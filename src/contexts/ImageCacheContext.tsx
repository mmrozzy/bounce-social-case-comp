/**
 * @fileoverview Image cache context provider for performance optimization.
 * Maintains an in-memory cache of user and group profile/banner images
 * to reduce database queries and improve UI responsiveness.
 * 
 * The cache is loaded on mount and can be refreshed or updated incrementally.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getGroups, getUsers } from '../services/database';

interface ImageCache {
  userImages: Record<string, { profileImage?: string; bannerImage?: string }>;
  groupImages: Record<string, { profileImage?: string; bannerImage?: string }>;
  lastUpdated: number;
}

interface ImageCacheContextType {
  cache: ImageCache;
  refreshCache: () => Promise<void>;
  getUserImages: (userId: string) => { profileImage?: string; bannerImage?: string } | null;
  getGroupImages: (groupId: string) => { profileImage?: string; bannerImage?: string } | null;
  updateUserImages: (userId: string, profileImage?: string, bannerImage?: string) => void;
  updateGroupImages: (groupId: string, profileImage?: string, bannerImage?: string) => void;
  isLoading: boolean;
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined);

export function ImageCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<ImageCache>({
    userImages: {},
    groupImages: {},
    lastUpdated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load all images on mount
  const refreshCache = useCallback(async () => {
    try {
      console.log('Loading image cache...');
      const [users, groups] = await Promise.all([
        getUsers(),
        getGroups(),
      ]);

      const userImages: Record<string, { profileImage?: string; bannerImage?: string }> = {};
      const groupImages: Record<string, { profileImage?: string; bannerImage?: string }> = {};

      users.forEach(user => {
        userImages[user.id] = {
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
        };
      });

      groups.forEach(group => {
        groupImages[group.id] = {
          profileImage: group.profileImage,
          bannerImage: group.bannerImage,
        };
      });

      setCache({
        userImages,
        groupImages,
        lastUpdated: Date.now(),
      });

      console.log('Image cache loaded:', {
        users: Object.keys(userImages).length,
        groups: Object.keys(groupImages).length,
      });
    } catch (error) {
      console.error('Error loading image cache:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCache();
  }, [refreshCache]);

  const getUserImages = useCallback((userId: string) => {
    return cache.userImages[userId] || null;
  }, [cache]);

  const getGroupImages = useCallback((groupId: string) => {
    return cache.groupImages[groupId] || null;
  }, [cache]);

  const updateUserImages = useCallback((userId: string, profileImage?: string, bannerImage?: string) => {
    setCache(prev => ({
      ...prev,
      userImages: {
        ...prev.userImages,
        [userId]: {
          profileImage: profileImage ?? prev.userImages[userId]?.profileImage,
          bannerImage: bannerImage ?? prev.userImages[userId]?.bannerImage,
        },
      },
    }));
  }, []);

  const updateGroupImages = useCallback((groupId: string, profileImage?: string, bannerImage?: string) => {
    setCache(prev => ({
      ...prev,
      groupImages: {
        ...prev.groupImages,
        [groupId]: {
          profileImage: profileImage ?? prev.groupImages[groupId]?.profileImage,
          bannerImage: bannerImage ?? prev.groupImages[groupId]?.bannerImage,
        },
      },
    }));
  }, []);

  return (
    <ImageCacheContext.Provider
      value={{
        cache,
        refreshCache,
        getUserImages,
        getGroupImages,
        updateUserImages,
        updateGroupImages,
        isLoading,
      }}
    >
      {children}
    </ImageCacheContext.Provider>
  );
}

export function useImageCache() {
  const context = useContext(ImageCacheContext);
  if (context === undefined) {
    throw new Error('useImageCache must be used within an ImageCacheProvider');
  }
  return context;
}
