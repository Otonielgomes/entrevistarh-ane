import { TrendingUp, Users, MessageSquare, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import MetricsPanel from "./MetricsPanel";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total de Vagas",
      value: "12",
      change: "+3 esta semana",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Candidatos Ativos",
      value: "47",
      change: "+12 novos",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Entrevistas Realizadas",
      value: "128",
      change: "+24 hoje",
      icon: MessageSquare,
      color: "text-accent"
    },
    {
      title: "Selecionados",
      value: "8",
      change: "+2 esta semana",
      icon: CheckCircle,
      color: "text-success"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
                  <p className="text-sm text-success mt-1">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-primary ${metric.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Painel de Métricas Avançadas */}
      <MetricsPanel />
      
      {/* Cards de Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vagas Recentes</h3>
          <div className="space-y-4">
            {[
              { title: "Desenvolvedor Full Stack", candidates: 15, status: "Ativa", priority: "Alta" },
              { title: "Analista de Marketing Digital", candidates: 23, status: "Ativa", priority: "Média" },
              { title: "Gerente de Vendas", candidates: 9, status: "Em andamento", priority: "Alta" }
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.candidates} candidatos • Prioridade {job.priority}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Melhores Performances com Ane</h3>
          <div className="space-y-4">
            {[
              { candidate: "Maria Silva", position: "UX Designer", score: 9.2, status: "Aprovada", profile: "D-I" },
              { candidate: "João Santos", position: "Dev Frontend", score: 8.7, status: "Em análise", profile: "C-S" },
              { candidate: "Ana Costa", position: "Analista RH", score: 8.4, status: "Aprovada", profile: "I-S" }
            ].map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{interview.candidate}</p>
                  <p className="text-sm text-muted-foreground">{interview.position} • DISC: {interview.profile}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{interview.score}/10</p>
                  <p className="text-xs text-muted-foreground">{interview.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;