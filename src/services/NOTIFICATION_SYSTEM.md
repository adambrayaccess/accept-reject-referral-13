# Notification System

## Overview
The notification system has been updated to only show toast notifications for the following approved scenarios:

## Approved Notification Types

### 1. New Referrals Imported
- **Trigger**: When a new referral is inserted into the database
- **Implementation**: `useReferralNotifications.tsx` - INSERT event listener
- **Example**: "A new referral for John Smith has been imported into the system"

### 2. Referral Updates
- **Trigger**: When an existing referral is updated in the database
- **Implementation**: `useReferralNotifications.tsx` - UPDATE event listener  
- **Example**: "Referral for Jane Doe status changed from new to accepted"

### 3. Error Messages
- **Trigger**: When validation errors, creation failures, or unexpected errors occur
- **Implementation**: `NotificationService.showError()` method
- **Example**: "Validation Error: Please fill in all required fields"

### 4. Specialty Filter Changes
- **Trigger**: When user changes specialty filters in the dashboard
- **Implementation**: `NotificationService.showSpecialtyFilterChange()` method
- **Example**: "Specialties Updated: Now triaging for Cardiology"

## Implementation

### NotificationService
- Centralized service for managing all toast notifications
- Located in: `src/services/notificationService.ts`
- Only allows notifications for approved types
- Provides helper methods for error handling and specialty filter changes

### Usage Examples

```typescript
// For error messages
const { showError } = useNotificationService();
showError("Validation Error", "Please fill in all required fields");

// For specialty filter changes
const { showSpecialtyFilterChange } = useNotificationService();
showSpecialtyFilterChange(["Cardiology", "Neurology"]);
```

## Changes Made

### Removed Notifications
The following types of notifications have been removed to reduce noise:
- Patient selection confirmations
- Successful referral creation messages
- Test referral creation confirmations
- Patient creation success messages
- General status update confirmations

### Preserved Notifications
The following critical notifications remain:
- All error messages (validation, creation failures, unexpected errors)
- Real-time referral import notifications
- Real-time referral update notifications
- Specialty filter change confirmations

## Real-time Notifications
The existing `useReferralNotifications` hook continues to provide real-time notifications for:
- New referrals being imported from external systems
- Referral updates from other users or systems
- These notifications include "View Referral" action buttons

This ensures users stay informed about critical system events while reducing notification fatigue.