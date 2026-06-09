# Notification System Design

## 1. Introduction

The Campus Notifications Platform is a web application developed to help students keep track of important updates such as placement drives, examination results, and campus events. Since students often receive a large number of notifications, the application includes a priority-based view that helps surface the most important information first.

The goal of the project was not only to display notifications but also to provide a better user experience through filtering, prioritization, and persistent read tracking.

---

## 2. System Architecture

The application is divided into two main parts:

### Frontend

The frontend is built using React with Vite. React was chosen because it allows efficient state management and dynamic rendering of UI components. Material UI is used to provide a clean and responsive interface without requiring extensive custom styling.

### Logging Module

A separate logging middleware module is used to send structured logs to the evaluation server. Instead of placing logging logic throughout the application, all logging requests are routed through a reusable logger utility. This keeps the code organized and makes future maintenance easier.

### State Management

React hooks (`useState` and `useEffect`) are used for managing application state. Notification data is stored in component state, while read notification IDs are persisted using the browser's localStorage so that the information remains available even after refreshing the page.

---

## 3. Priority Inbox Logic

One of the main requirements of the project was implementing a priority-based notification view.

Each notification category is assigned a weight:

| Type      | Weight |
| --------- | ------ |
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

When the Priority Inbox is enabled:

1. Notifications are first filtered based on the selected category.
2. The filtered notifications are sorted according to their assigned weight.
3. If two notifications have the same weight, the newer notification is given preference using the timestamp.
4. The final list is limited according to the user-selected value (Top 5, Top 10, etc.).

This approach ensures that high-priority notifications appear before less important ones while still keeping recent updates visible.

---

## 4. User Interface Decisions

A few design decisions were taken to improve usability:

### Read and Unread Tracking

When a notification card is clicked, it is marked as read. Read notifications are visually distinguished using reduced opacity and a different border style. The read state is stored in localStorage so that it is preserved across browser sessions.

### Category Filtering

Users can filter notifications by type (Placement, Result, or Event). This makes it easier to focus on a specific category without scrolling through the entire feed.

### Priority Toggle

A dedicated Priority Inbox button allows users to switch between the complete notification feed and the prioritized view.

### Loading State

A loading indicator is displayed while notification data is being fetched from the server. This provides feedback to the user and avoids showing an empty page during network requests.

---

## 5. Error Handling and Logging

API calls are wrapped in try-catch blocks to handle failures gracefully.

Important application events such as:

* Successful notification retrieval
* Priority view toggling
* Marking notifications as read
* API failures

are logged through the logging middleware.

This provides better visibility into application behavior and helps with debugging if issues occur.

---

## 6. Development Considerations

During development, a Vite proxy configuration was used to route API requests through the local development server. This simplified communication with the evaluation APIs and avoided browser CORS-related issues.

Environment variables were also used for authentication tokens instead of embedding credentials directly inside application logic.

---

## 7. Future Improvements

Although the current implementation satisfies the project requirements, there are several possible enhancements:

* Real-time notification updates using WebSockets
* Search functionality
* Pagination for larger datasets
* User-specific notification preferences
* Backend-based persistence for read status instead of localStorage

These improvements can be added without major changes to the current component structure.

---

## 8. Conclusion

This project demonstrates the implementation of a notification management system using React, Material UI, and a custom logging module. The main focus was improving the usability of a notification feed through prioritization, filtering, and persistent read tracking while maintaining a clean and responsive user interface.
