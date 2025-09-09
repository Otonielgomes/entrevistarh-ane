import { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import CandidateRanking from "@/components/CandidateRanking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, BarChart3, MessageSquare, Share2, Brain, Target, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-card">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidatos
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Entrevistas
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Vagas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateRanking />
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

          <TabsContent value="jobs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-card shadow-card border-0">
                <h3 className="text-xl font-semibold text-foreground mb-4">Criar Nova Vaga</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Título da Vaga</label>
                      <input 
                        className="w-full mt-1 p-3 border border-border rounded-lg bg-white"
                        placeholder="Ex: Desenvolvedor Full Stack"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Área</label>
                      <select className="w-full mt-1 p-3 border border-border rounded-lg bg-white">
                        <option>Tecnologia</option>
                        <option>Marketing</option>
                        <option>Vendas</option>
                        <option>RH</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Descrição da Vaga</label>
                    <textarea 
                      className="w-full mt-1 p-3 border border-border rounded-lg bg-white h-24"
                      placeholder="Descreva as responsabilidades e requisitos..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Nível</label>
                      <select className="w-full mt-1 p-3 border border-border rounded-lg bg-white">
                        <option>Júnior</option>
                        <option>Pleno</option>
                        <option>Sênior</option>
                        <option>Especialista</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Tipo de Contrato</label>
                      <select className="w-full mt-1 p-3 border border-border rounded-lg bg-white">
                        <option>CLT</option>
                        <option>PJ</option>
                        <option>Estágio</option>
                        <option>Freelancer</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-primary hover:shadow-hover">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Vaga e Configurar Entrevistas
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card shadow-card border-0">
                <h3 className="text-xl font-semibold text-foreground mb-4">Vagas Ativas</h3>
                <div className="space-y-4">
                  {[
                    { title: "Desenvolvedor Full Stack", candidates: 15, interviews: 8 },
                    { title: "Analista de Marketing Digital", candidates: 23, interviews: 12 },
                    { title: "Gerente de Vendas", candidates: 9, interviews: 5 },
                  ].map((job, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.candidates} candidatos • {job.interviews} entrevistas
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={generateInterviewLink}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Seção de Testes Complementares */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 border-0 text-center">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Teste Vocacional
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Descubra as áreas profissionais que mais se adequam ao perfil do candidato através de perguntas geradas dinamicamente por IA
            </p>
            <Button 
              variant="hero" 
              onClick={() => navigate("/teste-vocacional")}
              className="w-full"
            >
              <Target className="h-4 w-4 mr-2" />
              Iniciar Teste Vocacional
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-success/10 to-accent/10 border-0 text-center">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Teste Comportamental
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Análise do perfil DISC do candidato para identificar características comportamentais e estilo de trabalho
            </p>
            <Button 
              variant="hero" 
              onClick={() => navigate("/teste-comportamental")}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              Iniciar Teste Comportamental
            </Button>
          </Card>
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
