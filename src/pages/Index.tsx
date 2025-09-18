import { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import CandidateRanking from "@/components/CandidateRanking";
import { JobManager } from "@/components/JobManager";
import { CandidateDatabase } from "@/components/CandidateDatabase";
import { TestLinkSender } from "@/components/TestLinkSender";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, BarChart3, MessageSquare, Share2, Brain, Target, ClipboardList, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { jobs, candidates, addJob, updateJob, reuseCandidateForJob } = useAppContext();

  const generateInterviewLink = () => {
    const link = `${window.location.origin}/interview?job=dev-fullstack-001&token=candidate-${Date.now()}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link gerado com sucesso! 🎉",
      description: "Link da entrevista copiado para a área de transferência. Envie para o candidato via WhatsApp ou email.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Plataforma de Seleção Inteligente
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas vagas, conduza entrevistas com a Ane e encontre os melhores talentos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-card">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Vagas
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidatos
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Entrevistas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManager 
              jobs={jobs}
              onJobCreate={addJob}
              onJobUpdate={updateJob}
            />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateRanking />
          </TabsContent>

          <TabsContent value="database">
            <CandidateDatabase 
              candidates={candidates}
              availableJobs={jobs.map(j => ({ id: j.id, title: j.title }))}
              onReuseCandidateForJob={reuseCandidateForJob}
            />
          </TabsContent>

          <TabsContent value="interviews">
            <Card className="p-8 bg-gradient-card shadow-card border-0 text-center">
              <div className="space-y-4">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Ane - Sua Entrevistadora Virtual</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  A Ane conduz entrevistas personalizadas baseadas no perfil da vaga, 
                  avaliando critérios técnicos e comportamentais como DISC e People Skills.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button variant="hero" onClick={generateInterviewLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Gerar Link de Entrevista
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/teste-vocacional")}>
                    <Target className="h-4 w-4 mr-2" />
                    Teste Vocacional
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/teste-comportamental")}>
                    <Brain className="h-4 w-4 mr-2" />
                    Teste Comportamental
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ver Entrevistas Ativas
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Seção de Testes Complementares */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold text-foreground text-center">
            Avaliações de Perfil Profissional
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teste Vocacional */}
            <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-hover transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Teste Vocacional</h3>
                      <p className="text-sm text-muted-foreground">
                        Descubra suas áreas de afinidade profissional
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-foreground">
                    Avalie interesses e preferências para identificar carreiras que se alinham 
                    com o perfil do candidato usando 6 perguntas geradas por IA.
                  </p>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      15-20 min
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      6 perguntas IA
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate("/teste-vocacional")}
                  className="flex-1 bg-gradient-primary hover:shadow-hover"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Iniciar Teste
                </Button>
                <TestLinkSender testType="vocational" />
              </div>
            </Card>

            {/* Teste Comportamental */}
            <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-hover transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Teste Comportamental</h3>
                      <p className="text-sm text-muted-foreground">
                        Análise do perfil comportamental DISC
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-foreground">
                    Identifica padrões comportamentais baseados no modelo DISC para 
                    otimizar a adequação às vagas com 6 perguntas otimizadas.
                  </p>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      10-15 min
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      Modelo DISC
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate("/teste-comportamental")}
                  className="flex-1 bg-gradient-primary hover:shadow-hover"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Iniciar Teste
                </Button>
                <TestLinkSender testType="behavioral" />
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action para Entrevista Demo */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-success/10 border-0 text-center">
          <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            🚀 Experimente uma Entrevista com a Ane
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Teste o processo completo de entrevista virtual e veja como funciona na prática
          </p>
          <Button 
            variant="hero" 
            onClick={() => window.open('/interview?job=demo&token=test-candidate', '_blank')}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Fazer Entrevista Demo
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Index;
