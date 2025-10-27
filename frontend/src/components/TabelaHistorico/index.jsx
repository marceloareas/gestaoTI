import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, Chip, Tooltip, Box } from '@mui/material';
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
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

// Formata "2025-07-01T10:22:00" -> "01/07/2025 10:22"
function fmtDate(dt) {
  if (!dt) return '-';
  try {
    const d = new Date(dt);
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return String(dt); }
}

export default function TabelaHistorico() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // paginação no servidor
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // busca com debounce
  const [searchTerm, setSearchTerm] = useState('');
  const [typed, setTyped] = useState(''); // valor digitado
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(typed), 350);
    return () => clearTimeout(t);
  }, [typed]);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get('/historico', {
        params: { q: searchTerm, page, perPage, order: 'desc' },
      });
      setItens(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      setErr(e?.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  // carrega ao trocar página
  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page]);

  // carrega ao trocar o termo (e volta para página 1)
  useEffect(() => { setPage(1); fetchData(); /* eslint-disable-next-line */ }, [searchTerm]);

  const renderBadge = (item) => {
    if (item.tipoEvento === 'STATUS')   return <Chip label={item.statusEvento || 'Status'} size="small" />;
    if (item.tipoEvento === 'RETIRADA') return <Chip label="Retirada" size="small" />;
    if (item.tipoEvento === 'DEVOLUCAO')return <Chip label="Devolução" size="small" />;
    return <Chip label={item.tipoEvento || '-'} size="small" />;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <TextField
          label="Buscar (nº de série, funcionário, modelo, status...)"
          variant="outlined"
          size="small"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          sx={{ m: 2, width: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon /></InputAdornment>
            ),
          }}
        />

        <Table sx={{ minWidth: 1000 }} aria-label="tabela de histórico">
          <TableHead>
            <TableRow>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Nº de Série</StyledTableCell>
              <StyledTableCell>Modelo</StyledTableCell>
              <StyledTableCell>Tipo de Evento</StyledTableCell>
              <StyledTableCell>Detalhes</StyledTableCell>
              <StyledTableCell>Observações</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <StyledTableRow>
                <StyledTableCell colSpan={6}>Carregando...</StyledTableCell>
              </StyledTableRow>
            )}

            {!loading && err && (
              <StyledTableRow>
                <StyledTableCell colSpan={6} style={{ color: 'red' }}>{err}</StyledTableCell>
              </StyledTableRow>
            )}

            {!loading && !err && itens.map((item) => (
              <StyledTableRow key={item.idEvento}>
                <StyledTableCell>{fmtDate(item.dataEvento)}</StyledTableCell>

                <StyledTableCell>
                  <Tooltip title={`ID Equip.: ${item.equipamentoId || '-'}`}>
                    <span>{item.numeroSerie}</span>
                  </Tooltip>
                </StyledTableCell>

                <StyledTableCell>{item.marca} {item.modelo}</StyledTableCell>

                <StyledTableCell>{renderBadge(item)}</StyledTableCell>

                <StyledTableCell>
                  {item.tipoEvento === 'STATUS'
                    ? (item.statusEvento ?? '-')
                    : (<>
                        {item.funcionarioNome ?? '-'}
                        {item.tipoUso ? ` — ${item.tipoUso}` : ''}
                      </>)
                  }
                </StyledTableCell>

                <StyledTableCell>{item.observacoes || '-'}</StyledTableCell>
              </StyledTableRow>
            ))}

            {!loading && !err && itens.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  Nenhum evento encontrado{searchTerm ? ` para "${searchTerm}"` : ''}.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </>
  );
}
