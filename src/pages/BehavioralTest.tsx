import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  type: "scale" | "choice";
  options?: { id: string; text: string; traits: Record<string, number> }[];
  scaleLabels?: { min: string; max: string };
  trait?: string;
}

interface TestResult {
  profile: {
    dominant: string;
    influence: string;
    steadiness: string;
    conscientiousness: string;
  };
  primaryType: string;
  description: string;
  strengths: string[];
  developmentAreas: string[];
  workStyle: string;
}

const BehavioralTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Perguntas baseadas no modelo DISC geradas dinamicamente
  const questions: Question[] = [
    {
      id: 1,
      text: "Como você prefere lidar com desafios no trabalho?",
      type: "choice",
      options: [
        { id: "a", text: "Assumo a liderança e tomo decisões rápidas", traits: { D: 3, I: 1, S: 0, C: 1 } },
        { id: "b", text: "Busco inspirar e envolver a equipe", traits: { D: 1, I: 3, S: 1, C: 0 } },
        { id: "c", text: "Prefiro colaborar e manter harmonia", traits: { D: 0, I: 1, S: 3, C: 1 } },
        { id: "d", text: "Analiso cuidadosamente antes de agir", traits: { D: 1, I: 0, S: 1, C: 3 } }
      ]
    },
    {
      id: 2,
      text: "Em uma reunião, você normalmente:",
      type: "choice",
      options: [
        { id: "a", text: "Domino a conversa e dirijo as discussões", traits: { D: 3, I: 1, S: 0, C: 0 } },
        { id: "b", text: "Compartilho ideias animadamente", traits: { D: 1, I: 3, S: 0, C: 1 } },
        { id: "c", text: "Escuto mais do que falo", traits: { D: 0, I: 0, S: 3, C: 2 } },
        { id: "d", text: "Faço perguntas detalhadas", traits: { D: 0, I: 1, S: 1, C: 3 } }
      ]
    },
    {
      id: 3,
      text: "Quando precisa tomar uma decisão importante:",
      type: "choice",
      options: [
        { id: "a", text: "Decido rapidamente baseado na intuição", traits: { D: 3, I: 2, S: 0, C: 0 } },
        { id: "b", text: "Consulto várias pessoas para ter diferentes perspectivas", traits: { D: 0, I: 3, S: 2, C: 1 } },
        { id: "c", text: "Considero o impacto em todas as pessoas envolvidas", traits: { D: 0, I: 1, S: 3, C: 1 } },
        { id: "d", text: "Pesquiso e analiso todos os dados disponíveis", traits: { D: 1, I: 0, S: 1, C: 3 } }
      ]
    },
    {
      id: 4,
      text: "Seu estilo de comunicação é:",
      type: "choice",
      options: [
        { id: "a", text: "Direto e objetivo", traits: { D: 3, I: 0, S: 0, C: 2 } },
        { id: "b", text: "Expressivo e entusiástico", traits: { D: 1, I: 3, S: 1, C: 0 } },
        { id: "c", text: "Calmo e paciente", traits: { D: 0, I: 1, S: 3, C: 1 } },
        { id: "d", text: "Preciso e detalhado", traits: { D: 1, I: 0, S: 1, C: 3 } }
      ]
    },
    {
      id: 5,
      text: "Em situações de pressão, você:",
      type: "choice",
      options: [
        { id: "a", text: "Fico mais focado e determinado", traits: { D: 3, I: 0, S: 0, C: 1 } },
        { id: "b", text: "Busco motivar e energizar os outros", traits: { D: 1, I: 3, S: 1, C: 0 } },
        { id: "c", text: "Mantenho a calma e apoio a equipe", traits: { D: 0, I: 1, S: 3, C: 1 } },
        { id: "d", text: "Analiso a situação sistematicamente", traits: { D: 0, I: 0, S: 1, C: 3 } }
      ]
    },
    {
      id: 6,
      text: "Prefere trabalhar em:",
      type: "choice",
      options: [
        { id: "a", text: "Ambiente competitivo com metas desafiadoras", traits: { D: 3, I: 1, S: 0, C: 1 } },
        { id: "b", text: "Ambiente social e colaborativo", traits: { D: 1, I: 3, S: 2, C: 0 } },
        { id: "c", text: "Ambiente estável e previsível", traits: { D: 0, I: 0, S: 3, C: 2 } },
        { id: "d", text: "Ambiente organizado e estruturado", traits: { D: 0, I: 0, S: 1, C: 3 } }
      ]
    }
  ];

  const profileDescriptions = {
    D: {
      name: "Dominância",
      description: "Perfil orientado a resultados, decisivo e direto. Gosta de desafios e tomar o controle das situações.",
      strengths: ["Liderança natural", "Tomada de decisões rápidas", "Orientação para resultados", "Confiança"],
      developmentAreas: ["Paciência", "Escuta ativa", "Delegação", "Empatia"],
      workStyle: "Prefere autonomia, metas claras e autoridade para tomar decisões."
    },
    I: {
      name: "Influência",
      description: "Perfil sociável, otimista e persuasivo. Gosta de interagir com pessoas e inspirar outros.",
      strengths: ["Comunicação", "Entusiasmo", "Criatividade", "Networking"],
      developmentAreas: ["Atenção a detalhes", "Organização", "Foco em tarefas", "Planejamento"],
      workStyle: "Prospera em ambientes sociais, com variedade e reconhecimento público."
    },
    S: {
      name: "Estabilidade",
      description: "Perfil cooperativo, paciente e confiável. Valoriza harmonia e estabilidade no ambiente de trabalho.",
      strengths: ["Trabalho em equipe", "Confiabilidade", "Paciência", "Lealdade"],
      developmentAreas: ["Assertividade", "Adaptação a mudanças", "Iniciativa", "Auto-promoção"],
      workStyle: "Prefere ambientes estáveis, relacionamentos duradouros e processos bem definidos."
    },
    C: {
      name: "Conformidade",
      description: "Perfil analítico, preciso e orientado à qualidade. Foca em precisão e seguimento de padrões.",
      strengths: ["Análise crítica", "Atenção a detalhes", "Qualidade", "Planejamento"],
      developmentAreas: ["Flexibilidade", "Rapidez nas decisões", "Relacionamentos", "Tolerância ao risco"],
      workStyle: "Trabalha melhor com informações completas, tempo para análise e padrões claros."
    }
  };

  const handleAnswer = (value: string | number) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
      const question = questions[parseInt(questionIndex)];
      if (question.type === "choice" && question.options) {
        const selectedChoice = question.options.find(opt => opt.id === selectedOption);
        if (selectedChoice) {
          Object.entries(selectedChoice.traits).forEach(([trait, score]) => {
            scores[trait as keyof typeof scores] += score;
          });
        }
      }
    });

    // Normalizar scores para percentual
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const normalizedScores = Object.fromEntries(
      Object.entries(scores).map(([trait, score]) => [trait, Math.round((score / total) * 100)])
    );

    // Determinar tipo primário
    const primaryType = Object.entries(normalizedScores)
      .sort(([,a], [,b]) => b - a)[0][0] as keyof typeof profileDescriptions;

    const result: TestResult = {
      profile: {
        dominant: `${normalizedScores.D}%`,
        influence: `${normalizedScores.I}%`,
        steadiness: `${normalizedScores.S}%`,
        conscientiousness: `${normalizedScores.C}%`
      },
      primaryType: profileDescriptions[primaryType].name,
      description: profileDescriptions[primaryType].description,
      strengths: profileDescriptions[primaryType].strengths,
      developmentAreas: profileDescriptions[primaryType].developmentAreas,
      workStyle: profileDescriptions[primaryType].workStyle
    };

    setTestResult(result);
    setShowResults(true);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-card border-0">
            <div className="bg-gradient-primary p-6 rounded-t-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Resultado do Teste Comportamental</h1>
                  <p className="opacity-90">Análise do seu perfil DISC</p>
                </div>
                <Brain className="h-12 w-12" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-success/10 to-accent/10 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    🧠 Seu perfil primário: {testResult.primaryType}
                  </h2>
                  <p className="text-muted-foreground">
                    {testResult.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Perfil DISC</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Dominância (D)</span>
                      <Badge variant="outline">{testResult.profile.dominant}</Badge>
                    </div>
                    <Progress value={parseInt(testResult.profile.dominant)} />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Influência (I)</span>
                      <Badge variant="outline">{testResult.profile.influence}</Badge>
                    </div>
                    <Progress value={parseInt(testResult.profile.influence)} />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estabilidade (S)</span>
                      <Badge variant="outline">{testResult.profile.steadiness}</Badge>
                    </div>
                    <Progress value={parseInt(testResult.profile.steadiness)} />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Conformidade (C)</span>
                      <Badge variant="outline">{testResult.profile.conscientiousness}</Badge>
                    </div>
                    <Progress value={parseInt(testResult.profile.conscientiousness)} />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estilo de Trabalho</h3>
                  <p className="text-muted-foreground">
                    {testResult.workStyle}
                  </p>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-card border-border">
                  <h3 className="text-lg font-semibold text-success mb-4">Pontos Fortes</h3>
                  <div className="space-y-2">
                    {testResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                        <span className="text-foreground">{strength}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card border-border">
                  <h3 className="text-lg font-semibold text-accent mb-4">Áreas de Desenvolvimento</h3>
                  <div className="space-y-2">
                    {testResult.developmentAreas.map((area, index) => (
                      <div key={index} className="flex items-center">
                        <Brain className="h-4 w-4 text-accent mr-2" />
                        <span className="text-foreground">{area}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <Button variant="outline" onClick={restartTest}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refazer Teste
                </Button>
                <Button onClick={() => navigate("/")} className="bg-gradient-primary">
                  Voltar ao Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-card border-0">
          <div className="bg-gradient-primary p-6 rounded-t-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Teste Comportamental</h1>
                <p className="opacity-90">Descubra seu perfil comportamental baseado no modelo DISC</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                <span>{progress.toFixed(0)}% concluído</span>
              </div>
              <Progress value={progress} className="bg-white/20" />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {questions[currentQuestion].text}
              </h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].options?.map((option) => (
                  <Card
                    key={option.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      answers[currentQuestion] === option.id
                        ? 'bg-gradient-primary text-white border-primary'
                        : 'bg-white hover:bg-gray-50 border-border'
                    }`}
                    onClick={() => handleAnswer(option.id)}
                  >
                    <p className={answers[currentQuestion] === option.id ? 'text-white' : 'text-foreground'}>
                      {option.text}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
                className="bg-gradient-primary"
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BehavioralTest;