import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string; areas: string[] }[];
}

interface TestResult {
  areas: {
    name: string;
    score: number;
    description: string;
    careers: string[];
  }[];
  topArea: string;
}

const VocationalTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Perguntas geradas dinamicamente (simulando IA)
  const questions: Question[] = [
    {
      id: 1,
      text: "Quando você precisa resolver um problema complexo, qual abordagem prefere?",
      options: [
        { id: "a", text: "Analisar dados e criar soluções estruturadas", areas: ["tecnologia", "ciencias"] },
        { id: "b", text: "Conversar com pessoas para entender diferentes perspectivas", areas: ["humanas", "comunicacao"] },
        { id: "c", text: "Buscar soluções criativas e inovadoras", areas: ["criativas", "design"] },
        { id: "d", text: "Focar nos aspectos práticos e resultados financeiros", areas: ["negocios", "financas"] }
      ]
    },
    {
      id: 2,
      text: "Em seu tempo livre, você prefere atividades que envolvam:",
      options: [
        { id: "a", text: "Aprender novas tecnologias ou ferramentas", areas: ["tecnologia", "ciencias"] },
        { id: "b", text: "Atividades sociais e trabalho voluntário", areas: ["humanas", "saude"] },
        { id: "c", text: "Projetos artísticos ou criativos", areas: ["criativas", "design"] },
        { id: "d", text: "Planejamento financeiro ou investimentos", areas: ["negocios", "financas"] }
      ]
    },
    {
      id: 3,
      text: "Como você prefere trabalhar?",
      options: [
        { id: "a", text: "De forma independente, focado em projetos técnicos", areas: ["tecnologia", "ciencias"] },
        { id: "b", text: "Em equipe, ajudando pessoas a alcançarem seus objetivos", areas: ["humanas", "educacao"] },
        { id: "c", text: "Em ambiente criativo com liberdade de expressão", areas: ["criativas", "marketing"] },
        { id: "d", text: "Liderando equipes e tomando decisões estratégicas", areas: ["negocios", "gestao"] }
      ]
    },
    {
      id: 4,
      text: "Qual tipo de desafio mais te motiva?",
      options: [
        { id: "a", text: "Criar soluções inovadoras para problemas técnicos", areas: ["tecnologia", "engenharia"] },
        { id: "b", text: "Impactar positivamente a vida das pessoas", areas: ["saude", "educacao"] },
        { id: "c", text: "Expressar ideias através de arte ou comunicação", areas: ["criativas", "comunicacao"] },
        { id: "d", text: "Construir negócios prósperos e sustentáveis", areas: ["negocios", "empreendedorismo"] }
      ]
    },
    {
      id: 5,
      text: "Ao aprender algo novo, você prefere:",
      options: [
        { id: "a", text: "Estudar a teoria e fazer experimentos práticos", areas: ["ciencias", "pesquisa"] },
        { id: "b", text: "Aprender através de interação e casos reais", areas: ["humanas", "psicologia"] },
        { id: "c", text: "Explorar através de experimentação criativa", areas: ["criativas", "design"] },
        { id: "d", text: "Focar em aplicações práticas e retorno", areas: ["negocios", "administracao"] }
      ]
    }
  ];

  const areaDescriptions = {
    tecnologia: {
      name: "Tecnologia",
      description: "Você tem afinidade com desenvolvimento, programação e soluções tecnológicas.",
      careers: ["Desenvolvedor de Software", "Engenheiro de Dados", "Arquiteto de Sistemas", "DevOps", "Cybersecurity"]
    },
    ciencias: {
      name: "Ciências Exatas",
      description: "Você se destaca em análise lógica, matemática e pesquisa científica.",
      careers: ["Cientista de Dados", "Pesquisador", "Analista Financeiro", "Estatístico", "Matemático Aplicado"]
    },
    humanas: {
      name: "Ciências Humanas",
      description: "Você tem facilidade para lidar com pessoas e questões sociais.",
      careers: ["Psicólogo", "Assistente Social", "Recursos Humanos", "Antropólogo", "Sociólogo"]
    },
    saude: {
      name: "Saúde",
      description: "Você tem vocação para cuidar e melhorar a qualidade de vida das pessoas.",
      careers: ["Médico", "Enfermeiro", "Fisioterapeuta", "Nutricionista", "Terapeuta Ocupacional"]
    },
    criativas: {
      name: "Áreas Criativas",
      description: "Você tem talento para expressão artística e soluções criativas.",
      careers: ["Designer Gráfico", "Publicitário", "Arquiteto", "Diretor de Arte", "Escritor"]
    },
    negocios: {
      name: "Negócios",
      description: "Você tem perfil empreendedor e visão estratégica de mercado.",
      careers: ["Gerente de Produtos", "Consultor Empresarial", "Analista de Negócios", "Empreendedor", "Estrategista"]
    }
  };

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion]: optionId });
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
    const areaScores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
      const question = questions[parseInt(questionIndex)];
      const selectedChoice = question.options.find(opt => opt.id === selectedOption);
      
      if (selectedChoice) {
        selectedChoice.areas.forEach(area => {
          areaScores[area] = (areaScores[area] || 0) + 1;
        });
      }
    });

    const sortedAreas = Object.entries(areaScores)
      .map(([area, score]) => ({
        name: areaDescriptions[area as keyof typeof areaDescriptions]?.name || area,
        score: (score / questions.length) * 100,
        description: areaDescriptions[area as keyof typeof areaDescriptions]?.description || "",
        careers: areaDescriptions[area as keyof typeof areaDescriptions]?.careers || []
      }))
      .sort((a, b) => b.score - a.score);

    setTestResult({
      areas: sortedAreas,
      topArea: sortedAreas[0]?.name || ""
    });
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
                  <h1 className="text-3xl font-bold">Resultado do Teste Vocacional</h1>
                  <p className="opacity-90">Descubra suas áreas de maior afinidade</p>
                </div>
                <CheckCircle2 className="h-12 w-12" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-success/10 to-accent/10 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    🎯 Sua área de maior afinidade: {testResult.topArea}
                  </h2>
                  <p className="text-muted-foreground">
                    {testResult.areas[0]?.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                <h3 className="text-xl font-semibold">Análise Detalhada por Área:</h3>
                
                {testResult.areas.map((area, index) => (
                  <Card key={index} className="p-6 bg-gradient-card border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-foreground">{area.name}</h4>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {area.score.toFixed(0)}% de afinidade
                      </Badge>
                    </div>
                    
                    <Progress value={area.score} className="mb-4" />
                    
                    <p className="text-muted-foreground mb-4">{area.description}</p>
                    
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Carreiras recomendadas:</h5>
                      <div className="flex flex-wrap gap-2">
                        {area.careers.map((career, careerIndex) => (
                          <Badge key={careerIndex} variant="outline">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
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
                <h1 className="text-2xl font-bold">Teste Vocacional</h1>
                <p className="opacity-90">Descubra suas áreas de maior afinidade profissional</p>
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
                {questions[currentQuestion].options.map((option) => (
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

export default VocationalTest;