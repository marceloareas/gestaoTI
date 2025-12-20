import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField, Box, Pagination, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

export default function TabelaProximosGarantia() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [diasAntesFim, setDiasAntesFim] = useState(30); // novo campo configurável
  const rowsPerPage = 5;

  useEffect(() => {
    api.get("/equipamentos")
      .then((r) => setData(r.data))
      .catch((e) => setErr(e?.message || "Erro ao buscar equipamentos"))
      .finally(() => setLoading(false));
  }, []);

  const hoje = new Date();
  const limiteGarantia = new Date();
  limiteGarantia.setDate(hoje.getDate() + Number(diasAntesFim));

  const equipamentosFiltrados = data.filter(eq => {
    const fimGarantia = new Date(eq.dataFimGarantia);
    return (
      eq.status !== "Descartado" &&
      fimGarantia >= hoje &&
      fimGarantia <= limiteGarantia &&
      (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);

  const calcularDiasRestantes = (dataFim) => {
    const fim = new Date(dataFim);
    const diff = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <>
      <div className="container">
        <div className="tabela">
          <TableContainer component={Paper} sx={{ p: 2 }}>
            {/* Controles superiores: busca + campo de dias */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="Buscar por Identificador"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Dias antes do fim da garantia"
                type="number"
                variant="outlined"
                size="small"
                value={diasAntesFim}
                onChange={(e) => setDiasAntesFim(e.target.value)}
                sx={{ width: 240 }}
                inputProps={{ min: 1 }}
              />
            </Box>

            <Table sx={{ minWidth: 950 }} aria-label="tabela de equipamentos">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Identificador</StyledTableCell>
                  <StyledTableCell>Marca</StyledTableCell>
                  <StyledTableCell>Modelo</StyledTableCell>
                  <StyledTableCell>Categoria</StyledTableCell>
                  <StyledTableCell>Fim da Garantia</StyledTableCell>
                  <StyledTableCell>Dias Restantes</StyledTableCell>
                  <StyledTableCell align="right">Preço de Compra</StyledTableCell>
                  <StyledTableCell>Observações</StyledTableCell>
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
                    <StyledTableCell>
                      {new Date(eq.dataFimGarantia).toLocaleDateString('pt-BR')}
                    </StyledTableCell>
                    <StyledTableCell>
                      {calcularDiasRestantes(eq.dataFimGarantia)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {Number(eq.precoCompra ?? 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </StyledTableCell>
                    <StyledTableCell>{eq.observacoes}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{
                          padding: '2px 6px',
                          fontSize: '0.65rem',
                          minWidth: 'fit-content',
                          height: 30,
                          pointerEvents: 'none'
                        }}
                      >
                        {eq.status}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}

                {equipamentosFiltrados.length === 0 && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={9} align="center">
                      Nenhum equipamento com garantia a vencer em {diasAntesFim} dias.
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Paginação abaixo da tabela */}
        <div className="paginacao">
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Pagination
              count={Math.ceil(equipamentosFiltrados.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </div>
      </div>
    </>
  );
}
