"use client";

import { useState, useEffect } from "react";
import { RoleFilters } from "@/types/roles.types";
import { ROLES_PAGINATION } from "@/config/roles.config";
import { usersAPI } from "@/services/usersAPI";
import type { UserListItem } from "@/types";

export const useRoles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<RoleFilters>({
    search: "",
    scope: undefined,
    roleType: undefined,
    status: undefined,
  });
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users for stats calculation (runs once on mount)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await usersAPI.getUsers({
          page: 1,
          limit: 1000, // Fetch a large number to get all users for stats
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        if (response.data.success) {
          setAllUsers(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching all users for stats:", err);
      }
    };

    fetchAllUsers();
  }, []); // Only run once on mount

  // Fetch users from API (for table with pagination)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        let response;

        // Use search endpoint if search query exists
        if (filters.search && filters.search.trim() !== '') {
          response = await usersAPI.searchUsers(filters.search, {
            page: currentPage,
            limit: ROLES_PAGINATION.ITEMS_PER_PAGE,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            // All filters except search are applied client-side
          });
        } else {
          // Use regular getUsers endpoint
          response = await usersAPI.getUsers({
            page: currentPage,
            limit: ROLES_PAGINATION.ITEMS_PER_PAGE,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            // All filters are applied client-side
          });
        }

        if (response.data.success) {
          setUsers(response.data.data || []);

          // Handle pagination - check if pagination exists in response
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
            setTotalUsers(response.data.pagination.total || 0);
          } else {
            // If no pagination, set defaults
            setTotalPages(1);
            setTotalUsers(response.data.data?.length || 0);
          }
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);

        // Log the full error for debugging
        if (err instanceof Error) {
          console.error("Error details:", err.message);
        }

        setError("Failed to load users");
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, filters]);

  // Transform users to match the role table format and apply client-side filters
  const transformedRoles = users
    .map((user) => ({
      role: user.roles?.[0]?.name || "No Role",
      description: user.email,
      scope: user.roles?.[0]?.systemRole || "N/A",
      user: user.name,
      lastModified: new Date(user.updatedAt).toLocaleDateString(),
      id: user.id,
      status: user.status, // Keep original status for filtering
    }))
    // Apply all client-side filters
    .filter((item) => {
      // Filter by role
      if (filters.role && item.role !== filters.role) {
        return false;
      }

      // Filter by status
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Filter by scope
      if (filters.scope && item.scope !== filters.scope) {
        return false;
      }

      return true;
    });

  // Calculate dynamic stats from ALL users data (not just current page)
  const calculateStats = () => {
    const roleCounts: Record<string, number> = {};

    // Count users by role from all users
    allUsers.forEach((user) => {
      const roleName = user.roles?.[0]?.name || "No Role";
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    // Map to stats format with icons
    const iconMapping: Record<string, string> = {
      "Ops Manager": "shield",
      "Field Agent": "briefcase",
      "Technician": "wrench",
      "Finance Manager": "dollar-sign",
      "Support Agent": "headphones",
      "Warehouse Manager": "warehouse",
      "Auditor": "clipboard-check",
      "Super Admin": "shield-alert",
      "System Admin": "shield-alert",
    };

    return Object.entries(roleCounts).map(([name, count], index) => ({
      id: `${index + 1}`,
      name,
      count,
      icon: iconMapping[name] || "shield",
    }));
  };

  const dynamicStats = calculateStats();

  // Handlers
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<RoleFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    roles: transformedRoles,
    stats: dynamicStats,
    totalRoles: totalUsers,

    // Pagination
    currentPage,
    totalPages,

    // Loading & Error
    isLoading,
    error,

    // Handlers
    handleSearch,
    handleFilterChange,
    handlePageChange,

    // State
    filters,
  };
};

export default useRoles;
