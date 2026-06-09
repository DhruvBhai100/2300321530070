# Backend Service

The notification system utilizes a client-side proxy architecture. 
- Requests are routed directly to the evaluation service via Vite proxy configuration.
- Authentication and logging are handled by the frontend middleware.
- This approach ensures low-latency delivery of notifications to the student dashboard.