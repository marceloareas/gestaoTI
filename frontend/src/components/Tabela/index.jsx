import React, { useEffect, useMemo, useState } from 'react';
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
import { schemaAdd, schemaEdit } from '../schemas';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/services/api";

/* ===== helpers de formatação ===== */
const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
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

/* ===== CSS dos botões da coluna ações ===== */
const actionWrapSx = {
  display: 'flex',
  gap: 0.8,
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  py: 0.5,
};

const actionBtnSx = {
  height: 30,
  minHeight: 30,
  padding: '0 10px',
  fontSize: '0.72rem',
  borderRadius: 1.5,
  textTransform: 'none',
  lineHeight: 1,
  minWidth: 90,
};

export default function TabelaEquipamentos() {
  const [data, setData] = useState([]);

  // auxiliares
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // modais
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedEq, setSelectedEq] = useState(null);

  // modal de ações
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null, // 'emprestar' | 'devolver' | 'retornar' | 'descartar' | 'manutencao'
    eq: null,
  });

  // form do modal de ações
  const [actionForm, setActionForm] = useState({
    funcionarioRegistro: '',
    data: '',
    observacoes: '',
  });

  // formulários
  const [formAdd, setFormAdd] = useState({
    numeroSerie: '',
    modeloEquipamentoId: '',
    categoriaId: '1',
    tipo: '',
    dataCompra: '',
    dataFimGarantia: '',
    precoCompra: '',
    observacoes: '',
  });

  const [formEdit, setFormEdit] = useState({
    numeroSerie: '',
    tipo: '',
    modeloEquipamentoId: '',
    dataFimGarantia: '',
    precoCompra: '',
    observacoes: '',
    marca: '',
    modelo: '',
  });

  // listas p/ selects
  const [tipos, setTipos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);

  // ações
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);

  // paginação & busca
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  // validação
  const [errorsAdd, setErrorsAdd] = useState({});
  const [errorsEdit, setErrorsEdit] = useState({});

  /* ===== carregar tabela ===== */
  useEffect(() => {
    api.get("/equipamentos")
.then((r) => {
      console.log("✅ Resposta completa:", r);
      console.log("📦 Dados recebidos:", r.data);
      setData(r.data);})
      .catch((e) => {
        setErr(e?.message || "Erro ao buscar equipamentos");
        toast.error("Falha ao carregar equipamentos!", { position: "top-right" });
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== filtragem ===== */
  const equipamentosFiltrados = useMemo(() => (
    data.filter(eq =>
      eq.status !== "Descartado" &&
      (eq.numeroSerie ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [data, searchTerm]);

  /* ===== selects do ADD ===== */
  useEffect(() => {
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
  }, []);

useEffect(() => {
  (async () => {
    try {
      setLoadingCategoria(true);
      const { data } = await api.get('/categorias-uso');
      setCategoria(data || []);
    } catch (e) {
      console.error('Erro ao listar Categorias', e);
    } finally {
      setLoadingCategoria(false);
    }
  })();
}, []); // Carrega uma vez ao abrir a tela
  

  useEffect(() => {
    if (!openAdd) return;
    const tipoId = formAdd.tipo;
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
  }, [openAdd, formAdd.tipo]);

  /* ===== ADD: submit ===== */
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setErrorsAdd({});

    const payload = {
      numeroSerie: String(formAdd.numeroSerie || '').trim(),
      modeloEquipamentoId: formAdd.modeloEquipamentoId ? Number(formAdd.modeloEquipamentoId) : null,
      tipo: formAdd.tipo ? Number(formAdd.tipo) : null,
      categoriaId: formAdd.categoriaId ? Number(formAdd.categoriaId) : null,
      dataCompra: formAdd.dataCompra || null,
      dataFimGarantia: formAdd.dataFimGarantia || null,
      precoCompra: formAdd.precoCompra !== '' ? Number(formAdd.precoCompra) : null,
      observacoes: formAdd.observacoes || null,
    };
    console.log("dados: " + payload.data)
    try {
      await schemaAdd.validate(payload, { abortEarly: false });

      setSavingAdd(true);
      await api.post("/equipamentos", payload);

      const r = await api.get("/equipamentos");
      setData(r.data);

      setOpenAdd(false);
      toast.success("Equipamento adicionado com sucesso!", { position: "top-right" });
    } catch (err) {
      if (err?.name === "ValidationError") {
        console.error("❌ Erro de Validação do Schema:", err.inner);
        const fieldErrors = {};
        err.inner.forEach((e) => { fieldErrors[e.path] = e.message; });
        setErrorsAdd(fieldErrors);
        toast.warning("⚠️ Verifique os campos obrigatórios!", { position: "top-right" });
        return;
      }
      console.error("Falha ao criar equipamento:", err);
      toast.error("Não foi possível criar o equipamento. O número de série já existe.");
    } finally {
      setSavingAdd(false);
    }
  };

  /* ===== EDIT: abrir modal, buscar detalhes e listas ===== */
  const handleDetalhes = async (eq) => {
    try {
      setSelectedEq(eq);

      let det = null;
      try {
        const { data } = await api.get(`/equipamentos/${eq.id}`);
        det = data;
      } catch {
        // sem endpoint de detalhes
      }

      const numeroSerie = det?.numeroSerie ?? eq.numeroSerie ?? '';
      const categoriaId = det?.categoriaId ?? '';
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

      setLoadingTipos(true);
      const { data: tiposData } = await api.get('/tipos-equipamento');
      setTipos(tiposData || []);
      setLoadingTipos(false);

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
    console.error('Erro fatal ao abrir edição:', e);
    toast.error("Erro ao carnergar dados para edição.");
  }
};

  useEffect(() => {
    if (!openEdit) return;
    const tipoId = formEdit.tipo;
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
  }, [openEdit, formEdit.tipo]);

  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);

  /* ===== EDIT: submit ===== */
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedEq) return;
    setErrorsEdit({});

    const payload = {
      numeroSerie: (formEdit.numeroSerie || '').trim(),
      modeloEquipamentoId: formEdit.modeloEquipamentoId ? Number(formEdit.modeloEquipamentoId) : null,
      categoriaId: formEdit.categoriaId ? Number(formEdit.categoriaId) : null,
      tipo: formEdit.tipo ? Number(formEdit.tipo) : null,
      dataFimGarantia: formEdit.dataFimGarantia || null,
      precoCompra: formEdit.precoCompra !== '' ? Number(formEdit.precoCompra) : null,
      observacoes: formEdit.observacoes || null,
    };

    try {
      await schemaEdit.validate(payload, { abortEarly: false });

      setSavingEdit(true);
      await api.put(`/equipamentos/${selectedEq.id}`, payload);

      setData((list) =>
        list.map((it) =>
          it.id === selectedEq.id
            ? {
              ...it,
              ...payload,
              marca: modelos.find((m) => m.id === payload.modeloEquipamentoId)?.marca ?? it.marca,
              modelo: modelos.find((m) => m.id === payload.modeloEquipamentoId)?.modelo ?? it.modelo,
            }
            : it
        )
      );

      setOpenEdit(false);
      toast.success("Equipamento atualizado com sucesso!", { position: "top-right" });
    } catch (err) {
      if (err?.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => { fieldErrors[e.path] = e.message; });
        setErrorsEdit(fieldErrors);
        toast.warning("Selecione todos os campos!", { position: "top-right" });
        return;
      }
      console.error("Falha ao atualizar equipamento:", err);
      toast.error("Não foi possível salvar as alterações.", { position: "top-right" });
    } finally {
      setSavingEdit(false);
    }
  };

  /* ===== abrir modal de ação ===== */
  const openAction = (type, eq) => {
    setActionForm({
      funcionarioRegistro: '',
      data: '',
      observacoes: '',
    });
    setActionModal({ open: true, type, eq });
  };

  const closeAction = () => setActionModal({ open: false, type: null, eq: null });

  const actionTitle = useMemo(() => {
    switch (actionModal.type) {
      case 'emprestar': return 'Emprestar equipamento';
      case 'devolver': return 'Devolver equipamento';
      case 'retornar': return 'Retornar de manutenção';
      case 'manutencao': return 'Enviar para manutenção';
      case 'descartar': return 'Descartar equipamento';
      default: return 'Ação';
    }
  }, [actionModal.type]);

  /* ===== submit do modal de ação ===== */
  const handleSubmitAction = async (e) => {
    e.preventDefault();
    const eq = actionModal.eq;
    if (!eq) return;

    try {
      if (actionModal.type === 'emprestar') {
        await api.post('/emprestimos', {
          equipamentoId: eq.id,
          funcionarioId: Number(actionForm.funcionarioRegistro),
          tipoUso: 'emprestimo',
          dataRetirada: new Date().toISOString().slice(0, 10),
          observacoes: actionForm.observacoes || null,
        });
      }

      if (actionModal.type === 'devolver') {
        await api.post(`/equipamentos/${eq.id}/retornar`, {
          dataDevolucao: actionForm.data || null,
          observacoes: actionForm.observacoes || null,
        });
      }

      if (actionModal.type === 'retornar') {
        await api.post(`/equipamentos/${eq.id}/retornar`, {
          data: actionForm.data || null,
          observacoes: actionForm.observacoes || null,
        });
      }

      if (actionModal.type === 'manutencao') {
        await api.post(`/equipamentos/${eq.id}/manutencao`, {
          observacoes: actionForm.observacoes || null,
        });
      }

      if (actionModal.type === 'descartar') {
        await api.post(`/equipamentos/${eq.id}/descartar`, {
          observacoes: actionForm.observacoes || null,
        });
      }

      const r = await api.get('/equipamentos');
      setData(r.data);

      toast.success("Ação realizada com sucesso!");
      closeAction();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao executar ação");
    }
  };

  /* ===== paginação ===== */
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const equipamentosPaginados = equipamentosFiltrados.slice(startIndex, endIndex);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <TableContainer component={Paper}>
        <Button
          variant="outlined"
          size="large"
          sx={{ margin: 2, width: 300 }}
          onClick={() => {
            setFormAdd({
              numeroSerie: '',
              modeloEquipamentoId: '',
              tipo: '',
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
          <TableHead sx={{ backgroundColor: 'grey.900' }}>
            <TableRow>
              <StyledTableCell>Identificador</StyledTableCell>
              <StyledTableCell>Marca</StyledTableCell>
              <StyledTableCell>Modelo</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Fim da Garantia</StyledTableCell>
              <StyledTableCell align="right">Preço de Compra</StyledTableCell>
              <StyledTableCell>Observações</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Ações</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {equipamentosPaginados.map((eq) => {
              const podeMandarManutencao = eq.status !== "Em manutenção" && eq.status !== "Descartado";

              return (
                <StyledTableRow key={eq.id}>
                  <StyledTableCell>{eq.numeroSerie}</StyledTableCell>
                  <StyledTableCell>{eq.marca}</StyledTableCell>
                  <StyledTableCell>{eq.modelo}</StyledTableCell>
                  <StyledTableCell>{eq.categoria}</StyledTableCell>
                  <StyledTableCell>{fmtDate(eq.dataFimGarantia)}</StyledTableCell>
                  <StyledTableCell align="right">{fmtMoneyBRL(eq.precoCompra)}</StyledTableCell>
                  <StyledTableCell>{eq.observacoes}</StyledTableCell>

                  <StyledTableCell align="center">
                    {eq.status === "Em estoque" ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ ...actionBtnSx, pointerEvents: 'none', minWidth: 110 }}
                      >
                        Em Estoque
                      </Button>
                    ) : eq.status === "Em uso" ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ ...actionBtnSx, pointerEvents: 'none', minWidth: 110 }}
                      >
                        Em Uso
                      </Button>
                    ) : eq.status === "Em manutenção" ? (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ ...actionBtnSx, pointerEvents: 'none', minWidth: 110 }}
                      >
                        Em Manutenção
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ ...actionBtnSx, pointerEvents: 'none', minWidth: 110 }}
                      >
                        {eq.status || 'Outro Status'}
                      </Button>
                    )}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Box sx={actionWrapSx}>
                      <ModeEditOutlineRoundedIcon
                        onClick={() => handleDetalhes(eq)}
                        style={{ cursor: 'pointer' }}
                        titleAccess="Editar"
                      />

                      {/* Botão: Manutenção (para todos, exceto quem já está em manutenção) */}
                      {podeMandarManutencao && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="info"
                          sx={actionBtnSx}
                          onClick={() => openAction('manutencao', eq)}
                        >
                          Manutenção
                        </Button>
                      )}

                      {/* Ações por status */}
                      {eq.status === "Em uso" && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={actionBtnSx}
                            onClick={() => openAction('devolver', eq)}
                          >
                            Devolver
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={actionBtnSx}
                            onClick={() => openAction('descartar', eq)}
                          >
                            Descartar
                          </Button>
                        </>
                      )}

                      {eq.status === "Em estoque" && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={actionBtnSx}
                            onClick={() => openAction('emprestar', eq)}
                          >
                            Emprestar
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={actionBtnSx}
                            onClick={() => openAction('descartar', eq)}
                          >
                            Descartar
                          </Button>
                        </>
                      )}

                      {eq.status === "Em manutenção" && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={actionBtnSx}
                            onClick={() => openAction('retornar', eq)}
                          >
                            Retornar
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={actionBtnSx}
                            onClick={() => openAction('descartar', eq)}
                          >
                            Descartar
                          </Button>
                        </>
                      )}
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}

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
              error={!!errorsAdd.numeroSerie}
              helperText={errorsAdd.numeroSerie}
            />

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-tipo">Tipo de Equipamento</InputLabel>
              <Select
                labelId="lbl-tipo"
                label="Tipo de Equipamento"
                value={formAdd.tipo || ''}
                onChange={(e) => {
                  const idTipo = e.target.value;
                  setFormAdd(v => ({ ...v, tipo: idTipo, modeloEquipamentoId: '' }));
                }}
                disabled={loadingTipos}
              >
                {tipos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>
                ))}
              </Select>
              {errorsAdd.tipo && (
                <Typography variant="caption" color="error">{errorsAdd.tipo}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-modelo">Modelo do Equipamento</InputLabel>
              <Select
                labelId="lbl-modelo"
                label="Modelo do Equipamento"
                value={formAdd.modeloEquipamentoId || ''}
                onChange={(e) => setFormAdd(v => ({ ...v, modeloEquipamentoId: e.target.value }))}
                disabled={!formAdd.tipo || loadingModelos}
              >
                {modelos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.marca} {m.modelo}
                  </MenuItem>
                ))}
              </Select>
              {errorsAdd.modeloEquipamentoId && (
                <Typography variant="caption" color="error">{errorsAdd.modeloEquipamentoId}</Typography>
              )}
            </FormControl>

                      <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-categoria">Categoria de uso</InputLabel>
              <Select
                labelId="lbl-categoria"
                label="Categoria de uso"
                value={formAdd.categoriaId || ''}
                onChange={(e) => {
                  const catId = e.target.value;
                  setFormAdd(v => ({ ...v, categoriaId: catId }));
                }}
                disabled={loadingCategoria}
              >
                {categoria.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.descricao} 
                  </MenuItem>
                ))}
              </Select>
              {errorsAdd.categoriaId && (
                <Typography variant="caption" color="error">{errorsAdd.categoriaId}</Typography>
              )}
            </FormControl>


            <TextField
              label="Data de Compra"
              type="date"
              fullWidth size="small" margin="dense"
              value={formAdd.dataCompra}
              onChange={(e) => setFormAdd(v => ({ ...v, dataCompra: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              error={!!errorsAdd.dataCompra}
              helperText={errorsAdd.dataCompra}
            />

            <TextField
              label="Data Fim Garantia"
              type="date"
              fullWidth size="small" margin="dense"
              value={formAdd.dataFimGarantia}
              onChange={(e) => setFormAdd(v => ({ ...v, dataFimGarantia: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              error={!!errorsAdd.dataFimGarantia}
              helperText={errorsAdd.dataFimGarantia}
            />

            <TextField
              label="Preço de Compra"
              type="number" inputProps={{ step: "0.01" }}
              fullWidth size="small" margin="dense"
              value={formAdd.precoCompra}
              onChange={(e) => setFormAdd(v => ({ ...v, precoCompra: e.target.value }))}
              error={!!errorsAdd.precoCompra}
              helperText={errorsAdd.precoCompra}
            />

            <TextField
              label="Observações"
              fullWidth size="small" margin="dense" multiline minRows={2}
              value={formAdd.observacoes}
              onChange={(e) => setFormAdd(v => ({ ...v, observacoes: e.target.value }))}
              error={!!errorsAdd.observacoes}
              helperText={errorsAdd.observacoes}
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

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-tipo-edit">Tipo de Equipamento</InputLabel>
              <Select
                labelId="lbl-tipo-edit"
                label="Tipo de Equipamento"
                value={formEdit.tipo || ''}
                onChange={(e) => {
                  const idTipo = e.target.value;
                  setFormEdit(v => ({ ...v, tipo: idTipo, modeloEquipamentoId: '' }));
                }}
                disabled={loadingTipos}
              >
                {tipos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small">
              <InputLabel id="lbl-modelo-edit">Modelo do Equipamento</InputLabel>
              <Select
                labelId="lbl-modelo-edit"
                label="Modelo do Equipamento"
                value={formEdit.modeloEquipamentoId || ''}
                onChange={(e) => setFormEdit(v => ({ ...v, modeloEquipamentoId: e.target.value }))}
                disabled={!formEdit.tipo || loadingModelos}
              >
                {modelos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.marca} {m.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

                      
            <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="lbl-categoria-edit">Categoria de uso</InputLabel>
            <Select
              labelId="lbl-categoria-edit"
              label="Categoria de uso"
              value={formEdit.categoriaId || ''}
              onChange={(e) => setFormEdit(v => ({ ...v, categoriaId: e.target.value }))}
              disabled={loadingCategoria}
            >
              {categoria.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.descricao}
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

      {/* MODAL DE AÇÃO */}
      <Modal
        open={actionModal.open}
        onClose={closeAction}
        aria-labelledby="modal-action"
        slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }
        }}
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 24, width: 520
        }}>
          <Typography id="modal-action" variant="h6" gutterBottom>
            {actionTitle}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Equipamento: <strong>{actionModal.eq?.numeroSerie}</strong>
          </Typography>

          <form onSubmit={handleSubmitAction}>
            {actionModal.type === 'emprestar' && (
              <>
                <TextField
                  label="ID do funcionário (por enquanto)"
                  fullWidth size="small" margin="dense"
                  value={actionForm.funcionarioRegistro}
                  onChange={(e) => setActionForm(v => ({ ...v, funcionarioRegistro: e.target.value }))}
                />
                <TextField
                  label="Observações"
                  fullWidth size="small" margin="dense" multiline minRows={2}
                  value={actionForm.observacoes}
                  onChange={(e) => setActionForm(v => ({ ...v, observacoes: e.target.value }))}
                />
              </>
            )}

            {(actionModal.type === 'devolver' || actionModal.type === 'retornar') && (
              <>
                <TextField
                  label="Data (opcional)"
                  type="date"
                  fullWidth size="small" margin="dense"
                  value={actionForm.data}
                  onChange={(e) => setActionForm(v => ({ ...v, data: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Observações"
                  fullWidth size="small" margin="dense" multiline minRows={2}
                  value={actionForm.observacoes}
                  onChange={(e) => setActionForm(v => ({ ...v, observacoes: e.target.value }))}
                />
              </>
            )}

            {(actionModal.type === 'manutencao') && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Isso moverá o equipamento para <strong>Em manutenção</strong>.
                </Typography>
                <TextField
                  label="Motivo / Observações (opcional)"
                  fullWidth size="small" margin="dense" multiline minRows={2}
                  value={actionForm.observacoes}
                  onChange={(e) => setActionForm(v => ({ ...v, observacoes: e.target.value }))}
                />
              </>
            )}

            {actionModal.type === 'descartar' && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Tem certeza que deseja descartar este equipamento?
                </Typography>
                <TextField
                  label="Motivo / Observações"
                  fullWidth size="small" margin="dense" multiline minRows={2}
                  value={actionForm.observacoes}
                  onChange={(e) => setActionForm(v => ({ ...v, observacoes: e.target.value }))}
                />
              </>
            )}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={closeAction}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                color={actionModal.type === 'descartar' ? 'warning' : 'primary'}
              >
                Confirmar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
