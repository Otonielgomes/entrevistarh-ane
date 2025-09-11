import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Job, AIQuestion, CustomQuestion } from "@/types/job";
import { AIJobAnalyzer } from "./AIJobAnalyzer";
import { CustomQuestionsManager } from "./CustomQuestionsManager";
import { AIConfigManager } from "./AIConfigManager";
import { InterviewLinkSender } from "./InterviewLinkSender";
import { PlusCircle, Briefcase, Users, Calendar, Settings, Brain, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobManagerProps {
  jobs: Job[];
  onJobCreate: (job: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'>) => void;
  onJobUpdate: (jobId: string, updates: Partial<Job>) => void;
}

export const JobManager = ({ jobs, onJobCreate, onJobUpdate }: JobManagerProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    description: '',
    level: '',
    contractType: ''
  });
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleCreateJob = async () => {
    if (!formData.title || !formData.area || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive"
      });
      return;
    }

    const newJob: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'> = {
      title: formData.title,
      area: formData.area,
      description: formData.description,
      level: formData.level as Job['level'],
      contractType: formData.contractType as Job['contractType'],
      requirements: [],
      aiGeneratedQuestions: aiQuestions,
      customQuestions: customQuestions,
      status: 'Ativa'
    };

    onJobCreate(newJob);
    setFormData({ title: '', area: '', description: '', level: '', contractType: '' });
    setAiQuestions([]);
    setCustomQuestions([]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Vaga criada com sucesso! 🎉",
      description: "A vaga foi criada e as perguntas foram geradas pela IA."
    });
  };

  const generateInterviewLink = (jobId: string) => {
    const link = `${window.location.origin}/interview?job=${jobId}&token=candidate-${Date.now()}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link gerado! 📋",
      description: "Link da entrevista copiado para a área de transferência."
    });
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Ativa': return 'bg-success/10 text-success';
      case 'Pausada': return 'bg-accent/10 text-accent';
      case 'Finalizada': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Vagas</h2>
          <p className="text-muted-foreground">Crie vagas inteligentes com perguntas geradas por IA</p>
        </div>
        <div className="flex gap-2">
          <AIConfigManager />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-hover">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Criar Nova Vaga
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Desenvolvedor Full Stack"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="RH">Recursos Humanos</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Vaga *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente as responsabilidades, requisitos técnicos, experiência necessária e habilidades desejadas..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nível</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Júnior">Júnior</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Sênior">Sênior</SelectItem>
                      <SelectItem value="Especialista">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractType">Tipo de Contrato</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, contractType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                      <SelectItem value="Estágio">Estágio</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.description && (
                <>
                  <Separator />
                  <AIJobAnalyzer 
                    jobDescription={formData.description}
                    jobTitle={formData.title}
                    jobLevel={formData.level}
                    onQuestionsGenerated={setAiQuestions}
                    isAnalyzing={isAnalyzing}
                    onAnalyzingChange={setIsAnalyzing}
                  />
                </>
              )}

              {(aiQuestions.length > 0 || formData.description) && (
                <>
                  <Separator />
                  <CustomQuestionsManager
                    questions={customQuestions}
                    onQuestionsChange={setCustomQuestions}
                    jobContext={formData.description}
                  />
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateJob} 
                  disabled={isAnalyzing || !formData.title || !formData.area || !formData.description}
                  className="bg-gradient-primary hover:shadow-hover"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Vaga
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.area} • {job.level}</p>
                </div>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {job.candidatesApplied} candidatos
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Brain className="h-4 w-4 mr-2" />
                  {job.aiGeneratedQuestions.length} IA + {job.customQuestions.length} personalizadas
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <InterviewLinkSender 
                  jobId={job.id}
                  jobTitle={job.title}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => generateInterviewLink(job.id)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="p-12 text-center bg-gradient-card shadow-card border-0">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma vaga criada ainda</h3>
          <p className="text-muted-foreground mb-6">Crie sua primeira vaga e deixe a IA gerar perguntas personalizadas para o processo seletivo.</p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-primary hover:shadow-hover"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Primeira Vaga
          </Button>
        </Card>
      )}
    </div>
  );
};