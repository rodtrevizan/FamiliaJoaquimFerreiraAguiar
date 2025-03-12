import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useState } from 'react';
import { PartilhaModal } from './PartilhaModal';
import type { Partilha } from '../../types/partilha';

// Dados mockados para teste
const MOCK_PARTILHAS: Partilha[] = [
    {
        id: '1',
        falecido: 'Joaquim F. Aguiar',
        dataInicio: new Date(),
        status: 'PENDENTE',
        todos: [
            { id: '1', descricao: 'Assinar procuração', bloqueado: false },
            { id: '2', descricao: 'Enviar documentos pessoais (RG/CPF)', bloqueado: true },
            { id: '3', descricao: 'Confirmar recebimento da procuração', bloqueado: true },
            { id: '4', descricao: 'Assinar declaração de herdeiros', bloqueado: false },
            { id: '5', descricao: 'Enviar comprovante de residência', bloqueado: false },
            { id: '6', descricao: 'Reconhecer firma em cartório', bloqueado: true },
            { id: '7', descricao: 'Enviar certidão de casamento/nascimento', bloqueado: false }
        ],
        herdeiros: [
            { 
                id: '1', 
                nome: 'Maria Silva', 
                ramo: 'Família Silva',
                todosConcluidos: { 
                    '1': true, '2': false, '3': false, '4': true, 
                    '5': true, '6': false, '7': true 
                }
            },
            { 
                id: '2', 
                nome: 'João Aguiar', 
                ramo: 'Família Aguiar',
                todosConcluidos: { 
                    '1': true, '2': true, '3': false, '4': true, 
                    '5': true, '6': false, '7': false 
                }
            },
            { 
                id: '3', 
                nome: 'Pedro Santos', 
                ramo: 'Família Santos',
                todosConcluidos: { 
                    '1': false, '2': false, '3': false, '4': false, 
                    '5': false, '6': false, '7': false 
                }
            }
        ]
    },
    {
        id: '2',
        falecido: 'Maria C. Silva',
        dataInicio: new Date(),
        status: 'CONCLUIDO',
        todos: [
            { id: '4', descricao: 'Assinar termo', bloqueado: true },
            { id: '5', descricao: 'Reconhecer firma', bloqueado: true }
        ],
        herdeiros: [
            { 
                id: '4', 
                nome: 'Ana Silva', 
                ramo: 'Família Silva',
                todosConcluidos: { '4': true, '5': true }
            },
            { 
                id: '5', 
                nome: 'Carlos Silva', 
                ramo: 'Família Silva',
                todosConcluidos: { '4': true, '5': true }
            }
        ]
    }
];

export function PartilhaManager() {
    const [selectedPartilha, setSelectedPartilha] = useState<Partilha | null>(null);

    const handlePartilhaClick = (partilha: Partilha) => {
        setSelectedPartilha(partilha);
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6" component="div">
                            Gerenciamento de Partilha
                        </Typography>
                        
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            fullWidth
                        >
                            Nova Partilha
                        </Button>

                        <Divider />

                        <Typography variant="subtitle2" color="text.secondary">
                            Partilhas em Andamento
                        </Typography>

                        <List>
                            {MOCK_PARTILHAS.map((partilha) => (
                                <ListItem 
                                    key={partilha.id}
                                    onClick={() => handlePartilhaClick(partilha)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <ListItemText
                                        primary={`Partilha - ${partilha.falecido}`}
                                        secondary={`${partilha.herdeiros.filter(h => 
                                            !partilha.todos.every(t => h.todosConcluidos[t.id])
                                        ).length} herdeiros pendentes`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton 
                                            edge="end" 
                                            color={partilha.status === 'CONCLUIDO' ? "success" : "warning"}
                                        >
                                            {partilha.status === 'CONCLUIDO' ? <CheckCircleIcon /> : <PendingIcon />}
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </CardContent>
            </Card>

            {selectedPartilha && (
                <PartilhaModal
                    open={!!selectedPartilha}
                    onClose={() => setSelectedPartilha(null)}
                    partilha={selectedPartilha}
                />
            )}
        </>
    );
} 