import React, { useState } from "react";
import { Plus, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export interface CustomQuestion {
  id: string;
  question: string;
  category: string;
}

interface QuestionManagerProps {
  questions: CustomQuestion[];
  onAddQuestion: (question: CustomQuestion) => void;
  onRemoveQuestion: (id: string) => void;
  onEditQuestion: (id: string, question: CustomQuestion) => void;
}

const QuestionManager = ({ questions, onAddQuestion, onRemoveQuestion, onEditQuestion }: QuestionManagerProps) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: CustomQuestion = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      category: newCategory.trim() || 'Geral'
    };

    onAddQuestion(question);
    setNewQuestion('');
    setNewCategory('');
  };

  const handleEditQuestion = () => {
    if (!editingQuestion || !editingQuestion.question.trim()) return;

    onEditQuestion(editingQuestion.id, editingQuestion);
    setEditingQuestion(null);
  };

  const categories = [...new Set(questions.map(q => q.category))];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <Edit2 className="h-4 w-4 mr-2" />
          Gerenciar Perguntas ({questions.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perguntas Personalizadas da Entrevista</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Adicionar Nova Pergunta */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Adicionar Nova Pergunta</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Técnico, Comportamental, Experiência..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pergunta</label>
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Digite a pergunta que deseja adicionar..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddQuestion} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>
          </Card>

          {/* Lista de Perguntas por Categoria */}
          <div className="space-y-4">
            <h3 className="font-semibold">Perguntas Cadastradas</h3>
            {categories.map(category => (
              <Card key={category} className="p-4">
                <h4 className="font-medium text-primary mb-3">{category}</h4>
                <div className="space-y-2">
                  {questions
                    .filter(q => q.category === category)
                    .map(question => (
                      <div key={question.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm flex-1 pr-3">{question.question}</p>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingQuestion(question)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveQuestion(question.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>

          {questions.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma pergunta personalizada cadastrada ainda.
                <br />
                Adicione perguntas específicas para esta entrevista usando o formulário acima.
              </p>
            </Card>
          )}
        </div>
      </DialogContent>

      {/* Modal de Edição */}
      {editingQuestion && (
        <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Pergunta</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={editingQuestion.category}
                  onChange={(e) => setEditingQuestion({...editingQuestion, category: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pergunta</label>
                <Textarea
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleEditQuestion} className="bg-gradient-primary">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default QuestionManager;