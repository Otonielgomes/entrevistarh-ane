import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomQuestion } from "@/types/job";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomQuestionsManagerProps {
  questions: CustomQuestion[];
  onQuestionsChange: (questions: CustomQuestion[]) => void;
  jobContext?: string;
}

export const CustomQuestionsManager = ({ 
  questions, 
  onQuestionsChange,
  jobContext 
}: CustomQuestionsManagerProps) => {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    category: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = [
    'Técnica Específica',
    'Experiência Profissional', 
    'Situacional',
    'Comportamental',
    'Conhecimento do Negócio',
    'Soft Skills',
    'Cultura Organizacional'
  ];

  const addQuestion = () => {
    if (!newQuestion.question.trim() || !newQuestion.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a pergunta e selecione uma categoria.",
        variant: "destructive"
      });
      return;
    }

    const customQuestion: CustomQuestion = {
      id: `custom-${Date.now()}`,
      question: newQuestion.question.trim(),
      category: newQuestion.category
    };

    onQuestionsChange([...questions, customQuestion]);
    setNewQuestion({ question: '', category: '' });
    
    toast({
      title: "Pergunta adicionada! ✅",
      description: "A pergunta complementar foi adicionada com sucesso."
    });
  };

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
    toast({
      title: "Pergunta removida",
      description: "A pergunta foi removida da lista."
    });
  };

  const startEdit = (question: CustomQuestion) => {
    setEditingId(question.id);
    setNewQuestion({
      question: question.question,
      category: question.category
    });
  };

  const saveEdit = () => {
    if (!newQuestion.question.trim() || !newQuestion.category || !editingId) return;

    const updatedQuestions = questions.map(q => 
      q.id === editingId 
        ? { ...q, question: newQuestion.question.trim(), category: newQuestion.category }
        : q
    );
    
    onQuestionsChange(updatedQuestions);
    setEditingId(null);
    setNewQuestion({ question: '', category: '' });
    
    toast({
      title: "Pergunta atualizada! ✏️",
      description: "A pergunta foi editada com sucesso."
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewQuestion({ question: '', category: '' });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Perguntas Complementares da Recrutadora
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione perguntas específicas para avaliar aspectos únicos desta vaga.
          {jobContext && " Considere o contexto da vaga ao elaborar as perguntas."}
        </p>
      </div>

      {/* Formulário de nova pergunta */}
      <Card className="p-4 bg-gradient-card shadow-card border-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-question">
              {editingId ? "Editar Pergunta" : "Nova Pergunta Complementar"}
            </Label>
            <Textarea
              id="custom-question"
              placeholder="Ex: Como você aplicaria metodologias ágeis no contexto específico desta posição?"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-category">Categoria</Label>
            <Select 
              value={newQuestion.category} 
              onValueChange={(value) => setNewQuestion(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria da pergunta" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <Button onClick={saveEdit} size="sm" className="bg-gradient-primary hover:shadow-hover">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Salvar Edição
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={addQuestion} size="sm" className="bg-gradient-primary hover:shadow-hover">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Pergunta
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de perguntas */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">
            Perguntas Adicionadas ({questions.length})
          </h4>
          {questions.map((question, index) => (
            <Card key={question.id} className="p-4 bg-gradient-card shadow-card border-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Pergunta {index + 1}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {question.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">
                    {question.question}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(question)}
                    disabled={editingId === question.id}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {questions.length === 0 && (
        <Card className="p-8 text-center bg-gradient-card shadow-card border-0">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Nenhuma pergunta complementar adicionada ainda.
            <br />
            Adicione perguntas específicas para esta vaga.
          </p>
        </Card>
      )}
    </div>
  );
};