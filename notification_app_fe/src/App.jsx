import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel, Button, Chip, CircularProgress } from '@mui/material';
import { Log } from '../../logging_middleware/logger.js';

// const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const API_URL = "/evaluation-service/notifications"; // Proxy setup 
//const TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaHJ1di4yM2IxNTMxMTA2QGFiZXMuYWMuaW4iLCJleHAiOjE3ODA5ODk1MTcsImlhdCI6MTc4MDk4ODYxNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImQ4MTAxNjhjLWE0MDctNGNlNC1hMzkwLTRhMzVmZWNmNGU4MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRocnV2IGd1cHRhIiwic3ViIjoiYTkxM2E3YTEtMjI3ZS00OTE1LTg0YmYtMGEyNmRkZWExYzVhIn0sImVtYWlsIjoiZGhydXYuMjNiMTUzMTEwNkBhYmVzLmFjLmluIiwibmFtZSI6ImRocnV2IGd1cHRhIiwicm9sbE5vIjoiMjMwMDMyMTUzMDA3MCIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE5MTNhN2ExLTIyN2UtNDkxNS04NGJmLTBhMjZkZGVhMWM1YSIsImNsaWVudFNlY3JldCI6IlRSWHBNd0pyWUd4c1NCdEYifQ.kQ9kbAdBsHWCsnN7qHKSgCizowh8SQCoqZm2hZkUcAE";

const weights = { 'Placement': 3, 'Result': 2, 'Event': 1 };

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('read_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('All');
  const [isPriority, setIsPriority] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { "Authorization": TOKEN }
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        setData(json.notifications || []);
        
        await Log("frontend", "info", "api", "notifications fetched");
      } catch (err) {
        console.error(err);
        await Log("frontend", "error", "page", "api fetch failed");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('read_notes', JSON.stringify(readIds));
  }, [readIds]);

  const markRead = async (id) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]); // Safe functional update
      await Log("frontend", "info", "state", `marked ${id} read`);
    }
  };

  // 1. Base data
  let displayData = data;

  // 2. Filter FIRST
  if (type !== 'All') {
    displayData = displayData.filter(item => item.Type === type);
  }

  // 3. Sort and Slice LAST (fixes the edge-case bug)
  if (isPriority) {
    displayData = [...displayData].sort((a, b) => {
      const wA = weights[a.Type] || 0;
      const wB = weights[b.Type] || 0;
      if (wB !== wA) return wB - wA;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    }).slice(0, limit);
  }

  const getColor = (t) => {
    if (t === 'Placement') return 'error';
    if (t === 'Result') return 'success';
    return 'primary';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
        Campus Notifications
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
        <Button 
          variant={isPriority ? "contained" : "outlined"} 
          color="secondary"
          onClick={async () => { 
            setIsPriority(!isPriority); 
            await Log("frontend", "info", "component", "toggled priority"); 
          }}
        >
          {isPriority ? "Show All" : "Priority Inbox"}
        </Button>

        {isPriority && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Limit</InputLabel>
            <Select value={limit} label="Limit" onChange={(e) => setLimit(Number(e.target.value))}>
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {displayData.map((item) => {
            const isRead = readIds.includes(item.ID);
            return (
              <Grid item xs={12} key={item.ID}>
                <Card 
                  onClick={() => markRead(item.ID)}
                  sx={{ 
                    cursor: 'pointer',
                    transition: '0.2s',
                    borderLeft: `5px solid ${isRead ? '#b0bec5' : '#1a237e'}`,
                    bgcolor: isRead ? '#fafafa' : '#fff',
                    opacity: isRead ? 0.75 : 1,
                    '&:hover': { transform: 'scale(1.01)', boxShadow: 3 }
                  }}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip label={item.Type} size="small" color={getColor(item.Type)} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.Timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: isRead ? 'normal' : 'bold' }}>
                        {item.Message}
                      </Typography>
                    </Box>
                    {isRead && <Chip label="Read" variant="outlined" size="small" />}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default App;