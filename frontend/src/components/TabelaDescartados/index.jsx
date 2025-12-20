import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';

import { api } from "@/services/api";

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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState('');

  const fetchEquip = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await api.get("/equipamentos");
      setData(r.data);
    } catch (e) {
      setErr(e?.message || "Erro ao buscar equipamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquip();
  }, []);

  const equipamentosFiltrados = data.filter(eq =>
    eq.status === "Descartado" &&
    (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);

  const handleRestaurar = async (eq) => {
    const ok = window.confirm("Deseja restaurar este equipamento para o estoque?");
    if (!ok) return;

    try {
      await api.post(`/equipamentos/${eq.id}/restaurar-descarte`);
      await fetchEquip(); // atualiza tabela
    } catch (e) {
      alert(e?.message || "Erro ao restaurar equipamento");
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <TextField
          label="Buscar por Identificador"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          sx={{ margin: 2, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Table sx={{ minWidth: 900 }} aria-label="tabela de equipamentos">
          <TableHead>
            <TableRow>
              <StyledTableCell>Identificador</StyledTableCell>
              <StyledTableCell>Marca</StyledTableCell>
              <StyledTableCell>Modelo</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Fim da Garantia</StyledTableCell>
              <StyledTableCell align="right">Preço de Compra</StyledTableCell>
              <StyledTableCell>Observações</StyledTableCell>
              <StyledTableCell>Data de Descarte</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Ações</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {equipamentosPaginados.map((eq) => (
              <StyledTableRow key={eq.id}>
                <StyledTableCell>{eq.numeroSerie}</StyledTableCell>
                <StyledTableCell>{eq.marca}</StyledTableCell>
                <StyledTableCell>{eq.modelo}</StyledTableCell>
                <StyledTableCell>{eq.categoria}</StyledTableCell>
                <StyledTableCell>
                  {eq.dataFimGarantia ? new Date(eq.dataFimGarantia).toLocaleDateString('pt-BR') : '-'}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {Number(eq.precoCompra ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </StyledTableCell>
                <StyledTableCell>{eq.observacoes}</StyledTableCell>
                <StyledTableCell>
                  {eq.dataCompra ? new Date(eq.dataCompra).toLocaleDateString('pt-BR') : '-'}
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 0, height: 30, pointerEvents: 'none' }}
                  >
                    {eq.status}
                  </Button>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ py: 0.2, minHeight: 30, fontSize: '0.75rem' }}
                    onClick={() => handleRestaurar(eq)}
                  >
                    Restaurar
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {equipamentosFiltrados.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={10} align="center">
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

      {loading && <Box sx={{ textAlign: 'center', my: 2 }}>Carregando...</Box>}
      {err && <Box sx={{ textAlign: 'center', my: 2, color: 'red' }}>{err}</Box>}
    </>
  );
}
