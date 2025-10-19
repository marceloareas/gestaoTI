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

export default function TabelaDescartados() {
  const [data, setData] = useState([]);

  // estados auxiliares
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;


  useEffect(() => {
    api.get("/equipamentos")
      .then((r) => setData(r.data))
      .catch((e) => setErr(e?.message || "Erro ao buscar equipamentos"))
      .finally(() => setLoading(false));
  }, []);

  // busca
  const [searchTerm, setSearchTerm] = useState('');

  // filtragem
  const equipamentosFiltrados = data.filter(eq =>
    eq.status == "Descartado" &&
    (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);


  return (
    <>
      <TableContainer component={Paper}>
        {/* BARRA DE PESQUISA */}
        <TextField
          label="Buscar por Identificador"
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
              <StyledTableCell>Identificador</StyledTableCell>
              <StyledTableCell> Marca </StyledTableCell>
              <StyledTableCell> Modelo </StyledTableCell>
              <StyledTableCell> Categoria </StyledTableCell>
              <StyledTableCell>Fim da Garantia</StyledTableCell>
              <StyledTableCell align="right">Preço de Compra</StyledTableCell>
              <StyledTableCell>Observações</StyledTableCell>
              <StyledTableCell>Data de Descarte</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {equipamentosPaginados.map((eq) => (
              <StyledTableRow key={eq.id}>
                <StyledTableCell>{eq.numeroSerie}</StyledTableCell>
                <StyledTableCell>{eq.marca}</StyledTableCell>
                <StyledTableCell>{eq.modelo}</StyledTableCell>
                <StyledTableCell>{eq.categoria}</StyledTableCell>
                <StyledTableCell>{new Date(eq.dataFimGarantia).toLocaleDateString('pt-BR')}</StyledTableCell>
                <StyledTableCell align="right">
                  {Number(eq.precoCompra ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </StyledTableCell>
                <StyledTableCell>{eq.observacoes}</StyledTableCell>
                <StyledTableCell>{new Date(eq.dataCompra).toLocaleString('pt-BR')}</StyledTableCell>

                <StyledTableCell align="center">
                  {eq.status === "Em estoque" ? (
                    <Button variant="contained" color="success" size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 'fit-content', height: 30, pointerEvents: 'none' }}>
                      Em Estoque
                    </Button>
                  ) : eq.status === "Em uso" ? (
                    <Button variant="contained" color="error" size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 'fit-content', height: 30, pointerEvents: 'none' }}>
                      Em Uso
                    </Button>
                  ) : (
                    <Button variant="contained" color="warning" size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 0, height: 30, pointerEvents: 'none' }}>
                      {eq.status || 'Outro Status'}
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {equipamentosFiltrados.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">
                  Nenhum equipamento encontrado com o identificador "{searchTerm}".
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={Math.ceil(equipamentosFiltrados.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </>
  );
}
