import { TrendingUp, TrendingDown, Target, Clock, Users2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MetricsPanel = () => {
  const performanceMetrics = [
    {
      title: "Taxa de Aprovação",
      value: "73%",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-success"
    },
    {
      title: "Tempo Médio de Entrevista",
      value: "18min",
      change: "-3min",
      trend: "down",
      icon: Clock,
      color: "text-primary"
    },
    {
      title: "Satisfação dos Candidatos",
      value: "4.8",
      change: "+0.3",
      trend: "up",
      icon: Users2,
      color: "text-accent"
    },
    {
      title: "Entrevistas por Dia",
      value: "24",
      change: "+6",
      trend: "up",
      icon: MessageCircle,
      color: "text-success"
    }
  ];

  const jobCategories = [
    { name: "Tecnologia", count: 45, percentage: 60, color: "bg-primary" },
    { name: "Marketing", count: 18, percentage: 24, color: "bg-success" },
    { name: "Vendas", count: 9, percentage: 12, color: "bg-accent" },
    { name: "Outros", count: 3, percentage: 4, color: "bg-muted-foreground" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor = metric.trend === 'up' ? 'text-success' : 'text-destructive';
          
          return (
            <Card key={index} className="p-4 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${metric.color}`} />
                <div className={`flex items-center space-x-1 ${trendColor}`}>
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Área</h3>
          <div className="space-y-4">
            {jobCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.count} vagas</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color} transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Insights da Ane</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">💡 Recomendação Principal</h4>
              <p className="text-sm text-muted-foreground">
                Candidatos com perfil DISC "Dominante-Influente" têm 23% maior taxa de aprovação 
                para vagas de liderança.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">📊 Tendência Identificada</h4>
              <p className="text-sm text-muted-foreground">
                Entrevistas realizadas às terças e quartas apresentam respostas mais detalhadas 
                dos candidatos.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-success/10 to-accent/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">🎯 Oportunidade</h4>
              <p className="text-sm text-muted-foreground">
                Considere adicionar perguntas sobre experiência remota - 87% dos candidatos 
                mencionam interesse nessa modalidade.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MetricsPanel;