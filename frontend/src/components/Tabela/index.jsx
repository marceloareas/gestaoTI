import  React, { useEffect, useState }  from 'react';
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

import { api } from "@/services/api"

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
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get("/equipamentos")
          .then((r) => setData(r.data))
          .catch((e) => setErr(e?.message || "Erro ao buscar equipamentos"))
      }, []);
    // 1. Novo estado para o termo de pesquisa
    const [searchTerm, setSearchTerm] = React.useState('');

    // 2. Lógica de Filtragem
    const equipamentosFiltrados = data.filter(eq =>
        eq.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDetalhes = (data) => {
        alert(`Detalhes do equipamento ${data.numeroSerie}`);
    };

    const handleExcluir = (data) => {
        alert(`Deseja excluir equipamento com o número de série ${data.numeroSerie} ?`);
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
                    {/* USANDO O ARRAY FILTRADO */}
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