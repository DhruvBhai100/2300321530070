// logging_middleware/logger.js

const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaHJ1di4yM2IxNTMxMTA2QGFiZXMuYWMuaW4iLCJleHAiOjE3ODA5ODU5OTIsImlhdCI6MTc4MDk4NTA5MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjlhOTAyMTc3LWE1MWYtNDc4MC1hN2YwLTU0NGY0YzA5NzFiZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRocnV2IGd1cHRhIiwic3ViIjoiYTkxM2E3YTEtMjI3ZS00OTE1LTg0YmYtMGEyNmRkZWExYzVhIn0sImVtYWlsIjoiZGhydXYuMjNiMTUzMTEwNkBhYmVzLmFjLmluIiwibmFtZSI6ImRocnV2IGd1cHRhIiwicm9sbE5vIjoiMjMwMDMyMTUzMDA3MCIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE5MTNhN2ExLTIyN2UtNDkxNS04NGJmLTBhMjZkZGVhMWM1YSIsImNsaWVudFNlY3JldCI6IlRSWHBNd0pyWUd4c1NCdEYifQ.C3qq5S199MCVR2m1m1Hpet84K9KY3GpKUYMtTCMhd3Q";
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

export const Log = async (stack, level, pkg, message) => {
    try {
        const response = await fetch(LOG_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN
            },
            body: JSON.stringify({
                stack: stack,
                level: level,
                package: pkg,
                message: message
            })
        });
        
        if (!response.ok) {
            console.error("Failed to send log to evaluation server");
        }
    } catch (error) {
        console.error("Logging service error:", error);
    }
};