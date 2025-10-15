import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material'; // Importado TextField
import InfoIcon from '@mui/icons-material/Info';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchIcon from '@mui/icons-material/Search'; // Importado ícone de pesquisa
import InputAdornment from '@mui/material/InputAdornment'; // Importado para colocar o ícone no input


const DADOS_EQUIPAMENTOS_INICIAIS = [
    // Seus dados...
    {
        id: 1,
        numero_serie: "EQP-2025-001",
        modelo_equipamento_id: 3,
        categoria_id: 1,
        data_compra: "2023-06-15",
        data_fim_garantia: "2025-06-15",
        preco_compra: 4599.99,
        observacoes: "Equipamento em bom estado",
        data_criacao: "2023-06-15 10:23:00",
        status: "Em uso"
    },
    {
        id: 2,
        numero_serie: "EQP-2025-002",
        modelo_equipamento_id: 2,
        categoria_id: 2,
        data_compra: "2022-01-10",
        data_fim_garantia: "2024-01-10",
        preco_compra: 2899.50,
        observacoes: "Com pequenos arranhões",
        data_criacao: "2022-01-11 09:12:00",
        status: "Em uso"
    },
    {
        id: 3,
        numero_serie: "EQP-2025-003",
        modelo_equipamento_id: 5,
        categoria_id: 3,
        data_compra: "2021-12-20",
        data_fim_garantia: "2023-12-20",
        preco_compra: 699.00,
        observacoes: "Apresentou problemas na primeira semana de uso",
        data_criacao: "2021-12-21 14:45:00",
        status: "Em estoque"
    },
];

// ... (StyledTableCellAction, StyledTableCell, StyledTableRow) - Manter inalterado

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
    const [equipamentos] = React.useState(DADOS_EQUIPAMENTOS_INICIAIS);
    // 1. Novo estado para o termo de pesquisa
    const [searchTerm, setSearchTerm] = React.useState('');

    // 2. Lógica de Filtragem
    const equipamentosFiltrados = equipamentos.filter(eq =>
        eq.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDetalhes = (equipamento) => {
        alert(`Detalhes do equipamento ${equipamento.numero_serie}`);
    };

    const handleExcluir = (equipamento) => {
        alert(`Deseja excluir equipamento com o número de série ${equipamento.numero_serie} ?`);
    };

    return (
        <TableContainer component={Paper}>
                  <Button variant="outlined" size="large" sx={{ margin: 2, width: 300 }}>
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
                        <StyledTableCell> Marca (ID)</StyledTableCell>
                        <StyledTableCell> Categoria (ID)</StyledTableCell>
                        <StyledTableCell>Fim da Garantia</StyledTableCell>
                        <StyledTableCell align="right">Preço de Compra</StyledTableCell>
                        <StyledTableCell>Observações</StyledTableCell>
                        <StyledTableCell>Data de Criação</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                        <StyledTableCell align="center">Ações</StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* USANDO O ARRAY FILTRADO */}
                    {equipamentosFiltrados.map((eq) => (
                        <StyledTableRow key={eq.id}>
                            <StyledTableCell>{eq.numero_serie}</StyledTableCell>
                            <StyledTableCell>{eq.modelo_equipamento_id}</StyledTableCell>
                            <StyledTableCell>{eq.categoria_id}</StyledTableCell>
                            <StyledTableCell>{new Date(eq.data_fim_garantia).toLocaleDateString('pt-BR')}</StyledTableCell>
                            <StyledTableCell align="right">
                                {eq.preco_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </StyledTableCell>
                            <StyledTableCell>{eq.observacoes}</StyledTableCell>
                            <StyledTableCell>{new Date(eq.data_criacao).toLocaleString('pt-BR')}</StyledTableCell>
                            
                            {/* Célula de Status (Ajustada para o seu requisito de 'menor que small' com string status) */}
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
                                ) : eq.status === "Em uso" ?(
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

                            {/* Célula de Ações (Usando StyledTableCellAction para flexbox) */}
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
                    {/* Mensagem se não houver resultados */}
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
    );
}