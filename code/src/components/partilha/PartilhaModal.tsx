import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { PartilhaModalProps, Todo } from '../../types/partilha';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function PartilhaModal({ open, onClose, partilha }: PartilhaModalProps) {
    const [editMode, setEditMode] = useState(false);
    const [herdeiros, setHerdeiros] = useState(partilha.herdeiros);
    const [todos, setTodos] = useState(partilha.todos || []);
    const [novoTodo, setNovoTodo] = useState('');
    const [expanded, setExpanded] = useState<string | false>('pendentes');

    const handleTodoStatusChange = (herdeiroId: string, todoId: string) => {
        setHerdeiros(prev => prev.map(h => 
            h.id === herdeiroId 
                ? { 
                    ...h, 
                    todosConcluidos: { 
                        ...h.todosConcluidos, 
                        [todoId]: !h.todosConcluidos[todoId] 
                    } 
                } 
                : h
        ));
    };

    const handleToggleTodoLock = (todoId: string) => {
        if (!editMode) return;
        setTodos(prev => prev.map(todo =>
            todo.id === todoId ? { ...todo, bloqueado: !todo.bloqueado } : todo
        ));
    };

    const handleAddTodo = () => {
        if (!novoTodo.trim() || !editMode) return;
        
        const novoTodoItem: Todo = {
            id: uuidv4(),
            descricao: novoTodo.trim(),
            bloqueado: false
        };
        
        setTodos(prev => [...prev, novoTodoItem]);
        setNovoTodo('');
    };

    const totalAssinaturas = herdeiros.length;
    const assinaturasColetadas = herdeiros.filter(h => 
        todos.every(t => h.todosConcluidos[t.id])
    ).length;

    const todosPendentes = todos.filter(todo => 
        herdeiros.some(h => !h.todosConcluidos[todo.id])
    );

    const todosCompletos = todos.filter(todo => 
        herdeiros.every(h => h.todosConcluidos[todo.id])
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Partilha - {partilha.falecido}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label={`${assinaturasColetadas}/${totalAssinaturas} concluídos`}
                            color={assinaturasColetadas === totalAssinaturas ? "success" : "warning"}
                        />
                        <IconButton 
                            color={editMode ? "primary" : "default"}
                            onClick={() => setEditMode(!editMode)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    {editMode && (
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Adicionar nova tarefa..."
                                value={novoTodo}
                                onChange={(e) => setNovoTodo(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddTodo}
                            >
                                Adicionar
                            </Button>
                        </Stack>
                    )}

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Herdeiro</TableCell>
                                    <TableCell>Ramo</TableCell>
                                    {todos.map((todo, index) => (
                                        <TableCell key={todo.id} align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2">
                                                    {index + 1}
                                                </Typography>
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleToggleTodoLock(todo.id)}
                                                    disabled={!editMode}
                                                >
                                                    {todo.bloqueado ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} />
                                    {todos.map((todo) => (
                                        <TableCell key={todo.id} align="center">
                                            <Typography variant="caption" display="block">
                                                {todo.descricao}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {herdeiros.map((herdeiro) => (
                                    <TableRow key={herdeiro.id}>
                                        <TableCell>{herdeiro.nome}</TableCell>
                                        <TableCell>{herdeiro.ramo}</TableCell>
                                        {todos.map((todo) => (
                                            <TableCell key={todo.id} align="center">
                                                <Checkbox
                                                    checked={!!herdeiro.todosConcluidos[todo.id]}
                                                    onChange={() => handleTodoStatusChange(herdeiro.id, todo.id)}
                                                    disabled={todo.bloqueado}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Accordion 
                        expanded={expanded === 'pendentes'} 
                        onChange={() => setExpanded(expanded === 'pendentes' ? false : 'pendentes')}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>TODOs Pendentes</Typography>
                                <Chip 
                                    label={todosPendentes.length} 
                                    color="warning" 
                                    size="small" 
                                />
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {todosPendentes.map((todo, index) => (
                                    <ListItem key={todo.id}>
                                        <ListItemIcon>
                                            <Typography color="warning.main">⏳</Typography>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${todos.findIndex(t => t.id === todo.id) + 1}. ${todo.descricao}`}
                                            secondary={`${herdeiros.filter(h => !h.todosConcluidos[todo.id]).length} herdeiros pendentes`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion 
                        expanded={expanded === 'completos'} 
                        onChange={() => setExpanded(expanded === 'completos' ? false : 'completos')}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>TODOs Completos</Typography>
                                <Chip 
                                    label={todosCompletos.length} 
                                    color="success" 
                                    size="small" 
                                />
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {todosCompletos.map((todo, index) => (
                                    <ListItem key={todo.id}>
                                        <ListItemIcon>
                                            <Typography color="success.main">✅</Typography>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${todos.findIndex(t => t.id === todo.id) + 1}. ${todo.descricao}`}
                                            secondary="Todos os herdeiros concluíram"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Fechar
                </Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={onClose}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
} 