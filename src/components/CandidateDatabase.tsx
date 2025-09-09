import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateResult } from "@/types/job";
import { Search, User, Trophy, Calendar, BarChart3, MessageSquare, Star, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateDatabaseProps {
  candidates: CandidateResult[];
  availableJobs: { id: string; title: string; }[];
  onReuseCandidateForJob: (candidateId: string, jobId: string) => void;
}

export const CandidateDatabase = ({ candidates, availableJobs, onReuseCandidateForJob }: CandidateDatabaseProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || candidate.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: CandidateResult['status']) => {
    switch (status) {
      case 'Aprovado': return 'bg-success/10 text-success';
      case 'Em análise': return 'bg-accent/10 text-accent';
      case 'Reprovado': return 'bg-destructive/10 text-destructive';
      case 'Aguardando': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-accent';
    return 'text-destructive';
  };

  const handleReuseCandidate = (candidateId: string, jobId: string) => {
    onReuseCandidateForJob(candidateId, jobId);
    toast({
      title: "Candidato adicionado! ✨",
      description: "O candidato foi adicionado à nova vaga com base em seu histórico."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Base de Candidatos</h2>
          <p className="text-muted-foreground">Histórico completo com escores e reutilização para novas vagas</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {candidates.length} candidatos
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou vaga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Aprovado', 'Em análise', 'Reprovado'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Todos' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Escore Geral</span>
                  <span className={`font-bold ${getScoreColor(candidate.overallScore)}`}>
                    {candidate.overallScore.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Perfil DISC</span>
                  <Badge variant="outline">{candidate.discProfile}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vaga Original</span>
                  <span className="text-sm font-medium">{candidate.jobTitle}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded">
                  <div className="text-sm font-medium text-foreground">{candidate.technicalScore}</div>
                  <div className="text-xs text-muted-foreground">Técnico</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-sm font-medium text-foreground">{candidate.behavioralScore}</div>
                  <div className="text-xs text-muted-foreground">Comportamental</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-sm font-medium text-foreground">{candidate.communicationScore}</div>
                  <div className="text-xs text-muted-foreground">Comunicação</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {candidate.name} - Perfil Completo
                      </DialogTitle>
                    </DialogHeader>
                    
                    <Tabs defaultValue="overview" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="scores">Escores</TabsTrigger>
                        <TabsTrigger value="responses">Respostas</TabsTrigger>
                        <TabsTrigger value="reuse">Reutilizar</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">Resumo da Entrevista</h4>
                          <p className="text-sm text-muted-foreground">{candidate.summary}</p>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4">
                            <h4 className="font-semibold mb-2 text-success">Pontos Fortes</h4>
                            <ul className="space-y-1">
                              {candidate.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Star className="h-3 w-3 text-success" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </Card>
                          
                          <Card className="p-4">
                            <h4 className="font-semibold mb-2 text-accent">Áreas de Melhoria</h4>
                            <ul className="space-y-1">
                              {candidate.areasForImprovement.map((area, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Trophy className="h-3 w-3 text-accent" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="scores">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: 'Escore Geral', value: candidate.overallScore, max: 10 },
                            { label: 'Técnico', value: candidate.technicalScore, max: 10 },
                            { label: 'Comportamental', value: candidate.behavioralScore, max: 10 },
                            { label: 'Comunicação', value: candidate.communicationScore, max: 10 }
                          ].map((score, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{score.label}</span>
                                <span className={`font-bold ${getScoreColor(score.value)}`}>
                                  {score.value}/10
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(score.value / score.max) * 100}%` }}
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="responses">
                        <div className="space-y-4">
                          {candidate.responses.map((response, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{response.question}</h4>
                                <Badge className={getScoreColor(response.score) + ' bg-opacity-10'}>
                                  {response.score}/10
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{response.answer}</p>
                              <p className="text-xs text-accent">{response.analysis}</p>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="reuse">
                        <div className="space-y-4">
                          <div className="text-center space-y-2">
                            <RefreshCw className="h-12 w-12 text-primary mx-auto" />
                            <h3 className="text-lg font-semibold">Reutilizar Candidato</h3>
                            <p className="text-sm text-muted-foreground">
                              Adicione este candidato a uma nova vaga baseado em seu histórico e escore
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            {availableJobs.map((job) => (
                              <Card key={job.id} className="p-4 hover:shadow-hover transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{job.title}</span>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleReuseCandidate(candidate.id, job.id)}
                                  >
                                    Adicionar à Vaga
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                {candidate.reuseForOtherJobs && (
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(candidate.interviewDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="p-12 text-center bg-gradient-card shadow-card border-0">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || filterStatus !== 'all' ? 'Nenhum candidato encontrado' : 'Nenhum candidato ainda'}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== 'all' 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Os candidatos aparecerão aqui após realizarem entrevistas.'
            }
          </p>
        </Card>
      )}
    </div>
  );
};