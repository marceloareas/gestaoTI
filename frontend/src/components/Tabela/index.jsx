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
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Modal, Box, Typography } from '@mui/material';
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

export default function TabelaEquipamentos() {
  const [data, setData] = useState([]);

  // estados auxiliares
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // --- MODAIS adicionar/editar/excluir ---
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedEq, setSelectedEq] = useState(null);
  const [eqToDelete, setEqToDelete] = useState(null);

  // formulários
  const [formAdd, setFormAdd] = useState({
    numeroSerie: '',
    modeloEquipamentoId: '',
    categoriaId: '',
    dataCompra: '',
    dataFimGarantia: '',
    precoCompra: '',
    observacoes: '',
  });
  const [formEdit, setFormEdit] = useState({
    numero_serie: '',
    marca: '',
    modelo: ''
  });

  // loadings de ações
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    eq.status !== "Descartado" &&
    (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // payload p/ editar
  const buildEquipamentoPayload = (orig, form) => ({
    numeroSerie: form.numero_serie ?? orig.numeroSerie,
    dataCompra: orig.dataCompra ?? null,
    dataFimGarantia: orig.dataFimGarantia ?? null,
    precoCompra: orig.precoCompra ?? null,
    observacoes: orig.observacoes ?? null,
    ...(orig.modeloEquipamentoId != null && { modeloEquipamentoId: orig.modeloEquipamentoId }),
    ...(orig.categoriaId != null && { categoriaId: orig.categoriaId }),
  });

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

  // EXCLUIR: abre modal confirmação
  const handleExcluir = (eq) => {
    setEqToDelete(eq);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!eqToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/equipamentos/${eqToDelete.id}`);
      setData(list => list.filter(item => item.id !== eqToDelete.id));
      setOpenDelete(false);
      setEqToDelete(null);
    } catch (e) {
      console.error("Falha ao excluir equipamento:", e);
      alert("Não foi possível excluir o equipamento.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setOpenDelete(false);
    setEqToDelete(null);
  };

  // Adicionar
  const handleOpenAdd = () => {
    setFormAdd({
      numeroSerie: '',
      modeloEquipamentoId: '',
      categoriaId: '',
      dataCompra: '',
      dataFimGarantia: '',
      precoCompra: '',
      observacoes: '',
    });
    setOpenAdd(true);
  };
  const handleCloseAdd = () => setOpenAdd(false);

  // Editar
  const handleCloseEdit = () => setOpenEdit(false);

  // SUBMIT: ADICIONAR (integrado ao backend)
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    // monta payload no formato exato esperado
    const payload = {
      numeroSerie: String(formAdd.numeroSerie || '').trim(),
      modeloEquipamentoId: formAdd.modeloEquipamentoId ? Number(formAdd.modeloEquipamentoId) : null,
      categoriaId: formAdd.categoriaId ? Number(formAdd.categoriaId) : null,
      dataCompra: formAdd.dataCompra || null,
      dataFimGarantia: formAdd.dataFimGarantia || null,
      precoCompra: formAdd.precoCompra !== '' ? Number(formAdd.precoCompra) : null,
      observacoes: formAdd.observacoes || null,
    };

    // validação simples
    if (!payload.numeroSerie) {
      alert("Informe o número de série.");
      return;
    }
    if (!payload.modeloEquipamentoId || !payload.categoriaId) {
      alert("Informe modeloEquipamentoId e categoriaId (IDs válidos).");
      return;
    }

    try {
      setSavingAdd(true);
      await api.post("/equipamentos", payload);

      // recarrega a lista para refletir joins (marca/modelo/categoria/status)
      const r = await api.get("/equipamentos");
      setData(r.data);

      setOpenAdd(false);
    } catch (e) {
      console.error("Falha ao criar equipamento:", e);
      alert("Não foi possível criar o equipamento.");
    } finally {
      setSavingAdd(false);
    }
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

      // atualiza visualmente (para numeroSerie)
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

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);


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

                <StyledTableCell align="center">
                  <ModeEditOutlineRoundedIcon
                    onClick={() => handleDetalhes(eq)}
                    style={{ cursor: 'pointer' }}
                  />
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

      {/* MODAL: ADICIONAR */}
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-add"
        slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }
        }}
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 24, width: 480
        }}>
          <Typography id="modal-add" variant="h6" gutterBottom>
            Adicionar Equipamento
          </Typography>

          <form onSubmit={handleSubmitAdd}>
            <TextField
              label="Número de Série"
              fullWidth size="small" margin="dense"
              value={formAdd.numeroSerie}
              onChange={(e) => setFormAdd(v => ({ ...v, numeroSerie: e.target.value }))}
            />

            <TextField
              label="Modelo Equipamento ID"
              type="number"
              fullWidth size="small" margin="dense"
              value={formAdd.modeloEquipamentoId}
              onChange={(e) => setFormAdd(v => ({ ...v, modeloEquipamentoId: e.target.value }))}
              helperText="ID do modelo (ex.: 2)"
            />

            <TextField
              label="Categoria ID"
              type="number"
              fullWidth size="small" margin="dense"
              value={formAdd.categoriaId}
              onChange={(e) => setFormAdd(v => ({ ...v, categoriaId: e.target.value }))}
              helperText="ID da categoria (ex.: 2)"
            />

            <TextField
              label="Data de Compra"
              type="date"
              fullWidth size="small" margin="dense"
              value={formAdd.dataCompra}
              onChange={(e) => setFormAdd(v => ({ ...v, dataCompra: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Data Fim Garantia"
              type="date"
              fullWidth size="small" margin="dense"
              value={formAdd.dataFimGarantia}
              onChange={(e) => setFormAdd(v => ({ ...v, dataFimGarantia: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Preço de Compra"
              type="number" inputProps={{ step: "0.01" }}
              fullWidth size="small" margin="dense"
              value={formAdd.precoCompra}
              onChange={(e) => setFormAdd(v => ({ ...v, precoCompra: e.target.value }))}
            />

            <TextField
              label="Observações"
              fullWidth size="small" margin="dense" multiline minRows={2}
              value={formAdd.observacoes}
              onChange={(e) => setFormAdd(v => ({ ...v, observacoes: e.target.value }))}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleCloseAdd}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={savingAdd}>
                {savingAdd ? "Salvando..." : "Salvar"}
              </Button>
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
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }
        }}
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 24, width: 420
        }}>
          <Typography id="modal-edit" variant="h6" gutterBottom>
            Editar Equipamento
          </Typography>

          <form onSubmit={handleSubmitEdit}>
            <TextField
              label="Número de Série"
              fullWidth size="small" margin="dense"
              value={formEdit.numero_serie}
              onChange={(e) => setFormEdit(v => ({ ...v, numero_serie: e.target.value }))}
            />
            <TextField
              label="Marca"
              fullWidth size="small" margin="dense"
              value={formEdit.marca}
              onChange={(e) => setFormEdit(v => ({ ...v, marca: e.target.value }))}
            />
            <TextField
              label="Modelo"
              fullWidth size="small" margin="dense"
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

      {/* MODAL: CONFIRMAR EXCLUSÃO */}
      <Modal
        open={openDelete}
        onClose={cancelDelete}
        aria-labelledby="modal-delete"
        slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }
        }}
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 24, width: 420
        }}>
          <Typography id="modal-delete" variant="h6" gutterBottom>
            Confirmar exclusão
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Tem certeza que deseja excluir o equipamento{" "}
            <strong>{eqToDelete?.numeroSerie}</strong>?
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={cancelDelete}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
