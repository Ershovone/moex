import { FC, useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import SystemCard from "../../components/features/systems/SystemCard";

interface System {
  id: string;
  name: string;
  description: string;
  url: string;
}

// Моковые данные из ТЗ
const MOCK_SYSTEMS: System[] = [
  {
    id: "1",
    name: "ITSM",
    description: "Небольшое описание в две строки очень кратко и лаконично",
    url: "#",
  },
  {
    id: "2",
    name: "MPG (ESM + Finance)",
    description: "Небольшое описание в две строки очень кратко и лаконично",
    url: "#",
  },
  {
    id: "3",
    name: "HRSM",
    description: "Небольшое описание в две строки очень кратко и лаконично",
    url: "#",
  },
  {
    id: "4",
    name: "Progress",
    description: "Небольшое описание в две строки очень кратко и лаконично",
    url: "#",
  },
];

const SystemsCatalog: FC = () => {
  const [systems, setSystems] = useState<System[]>(MOCK_SYSTEMS);
  const [searchQuery, setSearchQuery] = useState("");

  const filterSystems = (query: string) => {
    if (!query) {
      setSystems(MOCK_SYSTEMS);
      return;
    }

    const filtered = MOCK_SYSTEMS.filter(
      (system) =>
        system.name.toLowerCase().includes(query.toLowerCase()) ||
        system.description.toLowerCase().includes(query.toLowerCase())
    );
    setSystems(filtered);
  };

  useEffect(() => {
    filterSystems(searchQuery);
  }, [searchQuery]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог систем
        </Typography>
        <TextField
          fullWidth
          placeholder="Поиск системы по названию или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
        <Grid container spacing={3}>
          {systems.map((system) => (
            <Grid item xs={12} sm={6} md={4} key={system.id}>
              <SystemCard
                name={system.name}
                description={system.description}
                url={system.url}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SystemsCatalog;
