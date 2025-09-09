import { Trophy, Star, User, MessageSquare, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Candidate {
  id: string;
  name: string;
  position: string;
  score: number;
  discProfile: string;
  skills: string[];
  status: 'Entrevistado' | 'Aguardando' | 'Em andamento';
  interviewDate: string;
  summary: string;
}

const CandidateRanking = () => {
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Maria Silva Santos',
      position: 'Desenvolvedor Full Stack',
      score: 9.2,
      discProfile: 'Dominante-Influente',
      skills: ['React', 'Node.js', 'TypeScript', 'Liderança'],
      status: 'Entrevistado',
      interviewDate: '2024-01-15',
      summary: 'Perfil técnico excepcional com forte capacidade de liderança. Demonstrou excelente conhecimento em tecnologias modernas e boa comunicação.'
    },
    {
      id: '2',
      name: 'João Pedro Costa',
      position: 'Desenvolvedor Full Stack',
      score: 8.7,
      discProfile: 'Consciente-Estável',
      skills: ['Vue.js', 'Python', 'PostgreSQL', 'Análise'],
      status: 'Entrevistado',
      interviewDate: '2024-01-14',
      summary: 'Candidato com ótima base técnica e perfil analítico. Mostrou-se detalhista e organizado durante a entrevista com a Ane.'
    },
    {
      id: '3',
      name: 'Ana Paula Oliveira',
      position: 'Desenvolvedor Full Stack',
      score: 8.4,
      discProfile: 'Influente-Estável',
      skills: ['Angular', 'Java', 'MongoDB', 'Comunicação'],
      status: 'Em andamento',
      interviewDate: '2024-01-16',
      summary: 'Excelente capacidade de comunicação e trabalho em equipe. Experiência sólida em desenvolvimento web.'
    },
    {
      id: '4',
      name: 'Carlos Eduardo Lima',
      position: 'Desenvolvedor Full Stack',
      score: 7.9,
      discProfile: 'Dominante-Consciente',
      skills: ['React Native', 'GraphQL', 'AWS', 'Gestão'],
      status: 'Aguardando',
      interviewDate: '2024-01-17',
      summary: 'Perfil com experiência em mobile e cloud. Demonstrou interesse em crescimento e aprendizado contínuo.'
    }
  ];

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <Star className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entrevistado':
        return 'bg-success/10 text-success border-success/20';
      case 'Em andamento':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Aguardando':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ranking de Candidatos</h2>
          <p className="text-muted-foreground">Vaga: Desenvolvedor Full Stack - Em ordem decrescente por pontuação</p>
        </div>
        <Button variant="hero" className="transition-smooth">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ver Todas as Entrevistas
        </Button>
      </div>

      <div className="grid gap-4">
        {candidates.map((candidate, index) => (
          <Card key={candidate.id} className="p-6 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full">
                    {getRankIcon(index)}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                </div>
                
                <Avatar className="bg-success">
                  <AvatarFallback className="text-white font-semibold">
                    {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-bold text-primary">{candidate.score}</span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                    
                    <Badge variant="outline" className={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                    
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(candidate.interviewDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">{candidate.summary}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        DISC: {candidate.discProfile}
                      </Badge>
                      {candidate.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button variant="default" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Ver Perfil
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Entrevista
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-gradient-to-r from-success/10 to-primary/10 border-0">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">🎯 Recomendação da Ane</h3>
          <p className="text-sm text-muted-foreground">
            Com base nas entrevistas realizadas, <strong>Maria Silva Santos</strong> apresentou o melhor desempenho geral, 
            combinando excelência técnica com perfil de liderança ideal para a posição.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CandidateRanking;