/**
 * CampusLoop Formatting Utilities
 * Data formatting and display helpers
 */

/**
 * Format timestamp to relative time (e.g., "2h ago", "Yesterday")
 */
export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    // Format as date for older posts
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Extract initials from full name
 */
export const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format distance in meters/kilometers
 */
export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m away`;
    const km = (meters / 1000).toFixed(1);
    return `${km}km away`;
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format time only
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Group items by date
 */
export const groupByDate = <T extends { createdAt: Date }>(
    items: T[]
): Record<string, T[]> => {
    const groups: Record<string, T[]> = {};

    items.forEach(item => {
        const date = item.createdAt.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
    });

    return groups;
};
