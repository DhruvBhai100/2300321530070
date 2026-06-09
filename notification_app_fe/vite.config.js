proxy: {
      '/evaluation-service': {
        target: 'http://4.224.186.213',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Manually ensure the token is attached to the outgoing request
            proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaHJ1di4yM2IxNTMxMTA2QGFiZXMuYWMuaW4iLCJleHAiOjE3ODA5ODk1MTcsImlhdCI6MTc4MDk4ODYxNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImQ4MTAxNjhjLWE0MDctNGNlNC1hMzkwLTRhMzVmZWNmNGU4MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRocnV2IGd1cHRhIiwic3ViIjoiYTkxM2E3YTEtMjI3ZS00OTE1LTg0YmYtMGEyNmRkZWExYzVhIn0sImVtYWlsIjoiZGhydXYuMjNiMTUzMTEwNkBhYmVzLmFjLmluIiwibmFtZSI6ImRocnV2IGd1cHRhIiwicm9sbE5vIjoiMjMwMDMyMTUzMDA3MCIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE5MTNhN2ExLTIyN2UtNDkxNS04NGJmLTBhMjZkZGVhMWM1YSIsImNsaWVudFNlY3JldCI6IlRSWHBNd0pyWUd4c1NCdEYifQ.kQ9kbAdBsHWCsnN7qHKSgCizowh8SQCoqZm2hZkUcAE');
          });
        }
      }
    }