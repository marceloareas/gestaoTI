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
import InfoIcon from '@mui/icons-material/Info';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Modal, Box, Typography } from '@mui/material';

import { api } from "@/services/api";

// ... (StyledTableCellAction, StyledTableCell, StyledTableRow) - Mantidos

const StyledTableCellAction = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  alignItems: 'center',
}));

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': { border: 0 },
}));

export default function TabelaEquipamentos() {
  const [data, setData] = useState([]);

  // estados auxiliares para requisição inicial (evitar erros)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // --- ESTADOS DOS MODAIS ---
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEq, setSelectedEq] = useState(null);

  // formulários (simples) para os modais
  const [formAdd, setFormAdd] = useState({
    numero_serie: '',
    marca: '',
    modelo: ''
  });
  const [formEdit, setFormEdit] = useState({
    numero_serie: '',
    marca: '',
    modelo: ''
  });

  // loading do submit de edição
  const [savingEdit, setSavingEdit] = useState(false);

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
    (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buildEquipamentoPayload = (orig, form) => {
    return {
      numeroSerie: form.numero_serie ?? orig.numeroSerie,
      // manter valores atuais, se existirem
      dataCompra: orig.dataCompra ?? null,
      dataFimGarantia: orig.dataFimGarantia ?? null,
      precoCompra: orig.precoCompra ?? null,
      observacoes: orig.observacoes ?? null,
      ...(orig.modeloEquipamentoId != null && { modeloEquipamentoId: orig.modeloEquipamentoId }),
      ...(orig.categoriaId != null && { categoriaId: orig.categoriaId }),
    };
  };

  // EDITAR: abre modal e carrega dados no form
  const handleDetalhes = (eq) => {
    setSelectedEq(eq);
    setFormEdit({
      numero_serie: eq.numeroSerie ?? '',
      marca: eq.marca ?? '',
      modelo: eq.modelo ?? '',
    });
    setOpenEdit(true);
  };

  const handleExcluir = (eq) => {
    alert(`Deseja excluir equipamento com o número de série ${eq.numeroSerie} ?`);
  };

  // Adicionar
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  // Editar
  const handleCloseEdit = () => setOpenEdit(false);

  // SUBMIT: ADICIONAR (sem integração ainda)
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    console.log('Adicionar:', formAdd);
    setOpenAdd(false);
  };

  // SUBMIT: EDITAR (integrado ao backend)
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedEq) return;

    try {
      setSavingEdit(true);

      const id = selectedEq.id;
      const payload = buildEquipamentoPayload(selectedEq, formEdit);

      await api.put(`/equipamentos/${id}`, payload);

      // Atualiza linha em memória 
      setData((list) =>
        list.map((it) =>
          it.id === id
            ? {
                ...it,
                numeroSerie: payload.numeroSerie,
                marca: formEdit.marca,
                modelo: formEdit.modelo,
              }
            : it
        )
      );

      setOpenEdit(false);
    } catch (err) {
      console.error("Falha ao atualizar equipamento:", err);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Button variant="outlined" size="large" sx={{ margin: 2, width: 300 }} onClick={handleOpenAdd}>
          Adicionar equipamento
        </Button>

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
              <StyledTableCell>Data de Compra</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Ações</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {equipamentosFiltrados.map((eq) => (
              <StyledTableRow key={eq.id}>
                <StyledTableCell>{eq.numeroSerie}</StyledTableCell>
                <StyledTableCell>{eq.marca}</StyledTableCell>
                <StyledTableCell>{eq.modelo}</StyledTableCell>
                <StyledTableCell>{eq.categoria}</StyledTableCell>
                <StyledTableCell>{new Date(eq.dataFimGarantia).toLocaleDateString('pt-BR')}</StyledTableCell>
                <StyledTableCell align="right">
                  {eq.precoCompra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </StyledTableCell>
                <StyledTableCell>{eq.observacoes}</StyledTableCell>
                <StyledTableCell>{new Date(eq.dataCompra).toLocaleString('pt-BR')}</StyledTableCell>

                <StyledTableCell align="center">
                  {eq.status === "Em estoque" ? (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 0, height: 20 }}
                    >
                      Em Estoque
                    </Button>
                  ) : eq.status === "Em uso" ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 0, height: 20 }}
                    >
                      Em Uso
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      sx={{ padding: '2px 6px', fontSize: '0.65rem', minWidth: 0, height: 20 }}
                    >
                      {eq.status || 'Outro Status'}
                    </Button>
                  )}
                </StyledTableCell>

                <StyledTableCellAction align="center">
                  <ModeEditOutlineRoundedIcon
                    onClick={() => handleDetalhes(eq)}
                    style={{ cursor: 'pointer' }}
                  />
                  <DeleteRoundedIcon
                    onClick={() => handleExcluir(eq)}
                    style={{ cursor: 'pointer' }}
                  />
                </StyledTableCellAction>
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

      {/* MODAL: ADICIONAR */}
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-add"
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#fff',
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: 420,
          }}
        >
          <Typography id="modal-add" variant="h6" gutterBottom>
            Adicionar Equipamento
          </Typography>

          <form onSubmit={handleSubmitAdd}>
            <TextField
              label="Número de Série"
              fullWidth
              size="small"
              margin="dense"
              value={formAdd.numero_serie}
              onChange={(e) => setFormAdd(v => ({ ...v, numero_serie: e.target.value }))}
            />
            <TextField
              label="Marca"
              fullWidth
              size="small"
              margin="dense"
              value={formAdd.marca}
              onChange={(e) => setFormAdd(v => ({ ...v, marca: e.target.value }))}
            />
            <TextField
              label="Modelo"
              fullWidth
              size="small"
              margin="dense"
              value={formAdd.modelo}
              onChange={(e) => setFormAdd(v => ({ ...v, modelo: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleCloseAdd}>Cancelar</Button>
              <Button type="submit" variant="contained">Salvar</Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* MODAL: EDITAR */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-edit"
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#fff',
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: 420,
          }}
        >
          <Typography id="modal-edit" variant="h6" gutterBottom>
            Editar Equipamento
          </Typography>

          <form onSubmit={handleSubmitEdit}>
            <TextField
              label="Número de Série"
              fullWidth
              size="small"
              margin="dense"
              value={formEdit.numero_serie}
              onChange={(e) => setFormEdit(v => ({ ...v, numero_serie: e.target.value }))}
            />
            <TextField
              label="Marca"
              fullWidth
              size="small"
              margin="dense"
              value={formEdit.marca}
              onChange={(e) => setFormEdit(v => ({ ...v, marca: e.target.value }))}
            />
            <TextField
              label="Modelo"
              fullWidth
              size="small"
              margin="dense"
              value={formEdit.modelo}
              onChange={(e) => setFormEdit(v => ({ ...v, modelo: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleCloseEdit}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={savingEdit}>
                {savingEdit ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
