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
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Pagination from '@mui/material/Pagination';

import { api } from "@/services/api";

/* ===== helpers de formatação (evitam RangeError quando valor é inválido) ===== */
const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
};
const fmtDateTime = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('pt-BR');
};
const fmtMoneyBRL = (v) =>
  Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ===== estilos ===== */
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

  // auxiliares
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // modais
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedEq, setSelectedEq] = useState(null);
  const [eqToDelete, setEqToDelete] = useState(null);

  // formulários
  const [formAdd, setFormAdd] = useState({
    numeroSerie: '',
    modeloEquipamentoId: '',
    categoriaId: '',     // aqui guardará o id do TIPO (por pedido)
    dataCompra: '',
    dataFimGarantia: '',
    precoCompra: '',
    observacoes: '',
  });

  const [formEdit, setFormEdit] = useState({
    numeroSerie: '',
    categoriaId: '',
    modeloEquipamentoId: '',
    dataFimGarantia: '',
    precoCompra: '',
    observacoes: '',
    // campos informativos (não enviados)
    marca: '',
    modelo: '',
  });

  // listas p/ selects
  const [tipos, setTipos] = useState([]);     // tipo_equipamento
  const [modelos, setModelos] = useState([]); // modelo_equipamento
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);

  // ações
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // paginação & busca
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  /* ===== carregar tabela ===== */
  useEffect(() => {
    api.get("/equipamentos")
      .then((r) => setData(r.data))
      .catch((e) => setErr(e?.message || "Erro ao buscar equipamentos"))
      .finally(() => setLoading(false));
  }, []);

  /* ===== filtragem ===== */
  const equipamentosFiltrados = data.filter(eq =>
    eq.status !== "Descartado" &&
    (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ===== selects do ADD ===== */
  useEffect(() => {
    if (!openAdd) return;
    (async () => {
      try {
        setLoadingTipos(true);
        const { data } = await api.get('/tipos-equipamento');
        setTipos(data || []);
      } catch (e) {
        console.error('Erro ao listar tipos_equipamento', e);
        setTipos([]);
      } finally {
        setLoadingTipos(false);
      }
    })();
  }, [openAdd]);

  useEffect(() => {
    if (!openAdd) return;
    const tipoId = formAdd.categoriaId;
    if (!tipoId) { setModelos([]); return; }

    (async () => {
      try {
        setLoadingModelos(true);
        const { data } = await api.get('/modelos-equipamento', { params: { tipoId } });
        setModelos(data || []);
      } catch (e) {
        console.error('Erro ao listar modelos_equipamento', e);
        setModelos([]);
      } finally {
        setLoadingModelos(false);
      }
    })();
  }, [openAdd, formAdd.categoriaId]);

  /* ===== ADD: submit ===== */
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    const payload = {
      numeroSerie: String(formAdd.numeroSerie || '').trim(),
      modeloEquipamentoId: formAdd.modeloEquipamentoId ? Number(formAdd.modeloEquipamentoId) : null,
      categoriaId: formAdd.categoriaId ? Number(formAdd.categoriaId) : null, // aqui vai o id do TIPO (por pedido)
      dataCompra: formAdd.dataCompra || null,
      dataFimGarantia: formAdd.dataFimGarantia || null,
      precoCompra: formAdd.precoCompra !== '' ? Number(formAdd.precoCompra) : null,
      observacoes: formAdd.observacoes || null,
    };

    if (!payload.numeroSerie) return alert("Informe o número de série.");
    if (!payload.categoriaId) return alert("Selecione o Tipo de Equipamento.");
    if (!payload.modeloEquipamentoId) return alert("Selecione o Modelo do Equipamento.");

    try {
      setSavingAdd(true);
      await api.post("/equipamentos", payload);

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

  /* ===== EDIT: abrir modal, buscar detalhes e listas ===== */
  const handleDetalhes = async (eq) => {
    try {
      setSelectedEq(eq);

      // tenta buscar detalhes pelo id (para obter categoriaId e modeloEquipamentoId)
      let det = null;
      try {
        const { data } = await api.get(`/equipamentos/${eq.id}`);
        det = data;
      } catch {
        // se não existir endpoint, segue com o que temos na linha
      }

      const numeroSerie = det?.numeroSerie ?? eq.numeroSerie ?? '';
      const categoriaId = det?.categoriaId ?? '';            // id do tipo
      const modeloEquipamentoId = det?.modeloEquipamentoId ?? '';
      const dataFimGarantia = det?.dataFimGarantia ?? eq.dataFimGarantia ?? '';
      const precoCompra = det?.precoCompra ?? eq.precoCompra ?? '';
      const observacoes = det?.observacoes ?? eq.observacoes ?? '';

      setFormEdit({
        numeroSerie,
        categoriaId,
        modeloEquipamentoId,
        dataFimGarantia,
        precoCompra,
        observacoes,
        marca: det?.marca ?? eq.marca ?? '',
        modelo: det?.modelo ?? eq.modelo ?? '',
      });

      // carrega tipos
      setLoadingTipos(true);
      const { data: tiposData } = await api.get('/tipos-equipamento');
      setTipos(tiposData || []);
      setLoadingTipos(false);

      // se já existir tipo, carrega modelos filtrados
      if (categoriaId) {
        setLoadingModelos(true);
        const { data: modelosData } = await api.get('/modelos-equipamento', { params: { tipoId: categoriaId } });
        setModelos(modelosData || []);
        setLoadingModelos(false);
      } else {
        setModelos([]);
      }

      setOpenEdit(true);
    } catch (e) {
      console.error('Erro ao abrir edição:', e);
      alert('Não foi possível carregar os dados para edição.');
    }
  };

  // quando trocar tipo no EDIT, recarrega modelos
  useEffect(() => {
    if (!openEdit) return;
    const tipoId = formEdit.categoriaId;
    if (!tipoId) { setModelos([]); return; }

    (async () => {
      try {
        setLoadingModelos(true);
        const { data } = await api.get('/modelos-equipamento', { params: { tipoId } });
        setModelos(data || []);
      } catch (e) {
        console.error('Erro ao listar modelos (editar)', e);
        setModelos([]);
      } finally {
        setLoadingModelos(false);
      }
    })();
  }, [openEdit, formEdit.categoriaId]);

  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);

  /* ===== EDIT: submit ===== */
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedEq) return;

    const payload = {
      numeroSerie: (formEdit.numeroSerie || '').trim(),
      modeloEquipamentoId: formEdit.modeloEquipamentoId ? Number(formEdit.modeloEquipamentoId) : null,
      categoriaId: formEdit.categoriaId ? Number(formEdit.categoriaId) : null,
      dataFimGarantia: formEdit.dataFimGarantia || null,
      precoCompra: formEdit.precoCompra !== '' ? Number(formEdit.precoCompra) : null,
      observacoes: formEdit.observacoes || null,
    };

    if (!payload.numeroSerie) return alert("Informe o número de série.");
    if (!payload.categoriaId) return alert("Selecione o Tipo de Equipamento.");
    if (!payload.modeloEquipamentoId) return alert("Selecione o Modelo do Equipamento.");

    try {
      setSavingEdit(true);
      await api.put(`/equipamentos/${selectedEq.id}`, payload);

      // atualiza em memória
      setData((list) =>
        list.map((it) =>
          it.id === selectedEq.id
            ? {
                ...it,
                numeroSerie: payload.numeroSerie,
                dataFimGarantia: payload.dataFimGarantia ?? it.dataFimGarantia,
                precoCompra: payload.precoCompra ?? it.precoCompra,
                observacoes: payload.observacoes ?? it.observacoes,
                // ajusta marca/modelo/categoria com base nas listas
                marca: (modelos.find((m) => m.id === payload.modeloEquipamentoId)?.marca) ?? it.marca,
                modelo: (modelos.find((m) => m.id === payload.modeloEquipamentoId)?.modelo) ?? it.modelo,
                categoria: (tipos.find((t) => t.id === payload.categoriaId)?.nome) ?? it.categoria,
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

  /* ===== excluir ===== */
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

  /* ===== paginação ===== */
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          variant="outlined"
          size="large"
          sx={{ margin: 2, width: 300 }}
          onClick={() => {
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
          }}
        >
          Adicionar equipamento
        </Button>

        {/* busca */}
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

        <Table sx={{ minWidth: 900 }} aria-label="tabela de equipamentos">
          {/* corrige o warning: não usar prop 'backgroundColor' direto */}
          <TableHead sx={{ backgroundColor: 'grey.900' }}>
            <TableRow>
              <StyledTableCell>Identificador</StyledTableCell>
              <StyledTableCell>Marca</StyledTableCell>
              <StyledTableCell>Modelo</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
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
                <StyledTableCell>{fmtDate(eq.dataFimGarantia)}</StyledTableCell>
                <StyledTableCell align="right">{fmtMoneyBRL(eq.precoCompra)}</StyledTableCell>
                <StyledTableCell>{eq.observacoes}</StyledTableCell>
                <StyledTableCell>{fmtDateTime(eq.dataCompra)}</StyledTableCell>

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
          count={Math.ceil(equipamentosFiltrados.length / rowsPerPage) || 1}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* MODAL: ADICIONAR */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
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

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-categoria">Tipo de Equipamento</InputLabel>
              <Select
                labelId="lbl-categoria"
                label="Tipo de Equipamento"
                value={formAdd.categoriaId || ''}
                onChange={(e) => {
                  const idTipo = e.target.value;
                  setFormAdd(v => ({ ...v, categoriaId: idTipo, modeloEquipamentoId: '' }));
                }}
                disabled={loadingTipos}
              >
                {tipos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-modelo">Modelo do Equipamento</InputLabel>
              <Select
                labelId="lbl-modelo"
                label="Modelo do Equipamento"
                value={formAdd.modeloEquipamentoId || ''}
                onChange={(e) => setFormAdd(v => ({ ...v, modeloEquipamentoId: e.target.value }))}
                disabled={!formAdd.categoriaId || loadingModelos}
              >
                {modelos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.marca} {m.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
              <Button onClick={() => setOpenAdd(false)}>Cancelar</Button>
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
          bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 24, width: 480
        }}>
          <Typography id="modal-edit" variant="h6" gutterBottom>
            Editar Equipamento
          </Typography>

          <form onSubmit={handleSubmitEdit}>
            <TextField
              label="Número de Série"
              fullWidth size="small" margin="dense"
              value={formEdit.numeroSerie}
              onChange={(e) => setFormEdit(v => ({ ...v, numeroSerie: e.target.value }))}
            />

            {/* SELECT: Tipo (usa formEdit.categoriaId) */}
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-categoria-edit">Tipo de Equipamento</InputLabel>
              <Select
                labelId="lbl-categoria-edit"
                label="Tipo de Equipamento"
                value={formEdit.categoriaId || ''}
                onChange={(e) => {
                  const idTipo = e.target.value;
                  // ao mudar o tipo, zera o modelo para obrigar nova seleção
                  setFormEdit(v => ({ ...v, categoriaId: idTipo, modeloEquipamentoId: '' }));
                }}
                disabled={loadingTipos}
              >
                {tipos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* SELECT: Modelo (filtra por tipo escolhido) */}
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-modelo-edit">Modelo do Equipamento</InputLabel>
              <Select
                labelId="lbl-modelo-edit"
                label="Modelo do Equipamento"
                value={formEdit.modeloEquipamentoId || ''}
                onChange={(e) => setFormEdit(v => ({ ...v, modeloEquipamentoId: e.target.value }))}
                disabled={!formEdit.categoriaId || loadingModelos}
              >
                {modelos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.marca} {m.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Data Fim Garantia"
              type="date"
              fullWidth size="small" margin="dense"
              value={formEdit.dataFimGarantia || ''}
              onChange={(e) => setFormEdit(v => ({ ...v, dataFimGarantia: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Preço de Compra"
              type="number" inputProps={{ step: "0.01" }}
              fullWidth size="small" margin="dense"
              value={formEdit.precoCompra ?? ''}
              onChange={(e) => setFormEdit(v => ({ ...v, precoCompra: e.target.value }))}
            />

            <TextField
              label="Observações"
              fullWidth size="small" margin="dense" multiline minRows={2}
              value={formEdit.observacoes || ''}
              onChange={(e) => setFormEdit(v => ({ ...v, observacoes: e.target.value }))}
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
