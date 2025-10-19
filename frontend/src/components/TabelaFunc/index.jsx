import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';


import { api } from "@/services/api";

// ... (StyledTableCell, StyledTableRow) - Mantidos
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

export default function TabelaFunc() {
  const [data, setData] = useState([]);

  // estados auxiliares
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;


  useEffect(() => {
    api.get("/funcionarios")
      .then((r) => setData(r.data))
      .catch((e) => setErr(e?.message || "Erro ao buscar funcionarios"))
      .finally(() => setLoading(false));
  }, []);

  // busca
  const [searchTerm, setSearchTerm] = useState('');

  // filtragem
    const funcFiltrados = data.filter(func =>
    (func.nome ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const funcPaginados = funcFiltrados.slice(startIndex, endIndex);


  return (
    <>
      <TableContainer component={Paper}>
        {/* BARRA DE PESQUISA */}
        <TextField
          label="Buscar por Nome"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ margin: 2, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/* FIM DA BARRA DE PESQUISA */}

        <Table sx={{ minWidth: 900 }} aria-label="tabela de equipamentos">
          <TableHead backgroundColor>
            <TableRow>
              <StyledTableCell> Nome </StyledTableCell>
              <StyledTableCell> Número de Registro </StyledTableCell>
              <StyledTableCell> Cargo </StyledTableCell>
              <StyledTableCell> Email </StyledTableCell>
              <StyledTableCell> Telefone </StyledTableCell>
              <StyledTableCell align="center"> Ativo </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {funcPaginados.map((func) => (
              <StyledTableRow key={func.id}>
                <StyledTableCell>{func.nome}</StyledTableCell>
                <StyledTableCell>{func.numeroRegistro}</StyledTableCell>
                <StyledTableCell>{func.cargoId}</StyledTableCell>
                <StyledTableCell>{func.email}</StyledTableCell>
                <StyledTableCell>{func.telefone}</StyledTableCell>
                <StyledTableCell>{ "Sim(Hardcode)" }</StyledTableCell>
              </StyledTableRow>
            ))}

            {funcPaginados.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">
                  Nenhum Funcionário encontrado com "{searchTerm}".
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={Math.ceil(funcPaginados.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </>
  );
}
