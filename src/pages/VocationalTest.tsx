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

  // Perguntas geradas por IA otimizadas para avaliação de perfil de vaga
  const questions: Question[] = [
    {
      id: 1,
      text: "Qual área de trabalho desperta mais seu interesse e motivação profissional?",
      options: [
        { id: "a", text: "Desenvolvimento de software e inovação tecnológica", areas: ["tecnologia", "engenharia"] },
        { id: "b", text: "Estratégia empresarial e gestão de pessoas", areas: ["negocios", "gestao"] },
        { id: "c", text: "Design, criação e expressão visual", areas: ["criativas", "marketing"] },
        { id: "d", text: "Análise de dados e resolução de problemas complexos", areas: ["ciencias", "pesquisa"] },
        { id: "e", text: "Atendimento e relacionamento com pessoas", areas: ["humanas", "comunicacao"] }
      ]
    },
    {
      id: 2,
      text: "Em qual ambiente você se sente mais produtivo e engajado?",
      options: [
        { id: "a", text: "Laboratórios de pesquisa e centros de inovação", areas: ["ciencias", "tecnologia"] },
        { id: "b", text: "Escritórios corporativos e salas de reunião", areas: ["negocios", "gestao"] },
        { id: "c", text: "Estúdios criativos e espaços colaborativos", areas: ["criativas", "design"] },
        { id: "d", text: "Ambientes hospitalares e clínicas", areas: ["saude", "cuidados"] },
        { id: "e", text: "Espaços comerciais e pontos de venda", areas: ["vendas", "relacionamento"] }
      ]
    },
    {
      id: 3,
      text: "Que tipo de desafio profissional mais te motiva a buscar excelência?",
      options: [
        { id: "a", text: "Desenvolver soluções tecnológicas inovadoras", areas: ["tecnologia", "inovacao"] },
        { id: "b", text: "Liderar equipes e alcançar metas organizacionais", areas: ["lideranca", "gestao"] },
        { id: "c", text: "Criar campanhas visuais impactantes", areas: ["criativas", "marketing"] },
        { id: "d", text: "Realizar pesquisas científicas e descobertas", areas: ["pesquisa", "ciencias"] },
        { id: "e", text: "Construir relacionamentos duradouros com clientes", areas: ["relacionamento", "vendas"] }
      ]
    },
    {
      id: 4,
      text: "Qual habilidade você considera seu maior diferencial profissional?",
      options: [
        { id: "a", text: "Programação e domínio de tecnologias emergentes", areas: ["tecnologia", "programacao"] },
        { id: "b", text: "Liderança e visão estratégica de negócios", areas: ["lideranca", "estrategia"] },
        { id: "c", text: "Criatividade e senso estético apurado", areas: ["criativas", "design"] },
        { id: "d", text: "Pensamento analítico e metodologia científica", areas: ["analitica", "ciencias"] },
        { id: "e", text: "Comunicação persuasiva e empatia", areas: ["comunicacao", "persuasao"] }
      ]
    },
    {
      id: 5,
      text: "Que tipo de resultado profissional te dá maior satisfação pessoal?",
      options: [
        { id: "a", text: "Lançar produtos tecnológicos que impactem milhões de usuários", areas: ["tecnologia", "produto"] },
        { id: "b", text: "Construir empresas sustentáveis e equipes de alta performance", areas: ["empreendedorismo", "lideranca"] },
        { id: "c", text: "Criar peças visuais que inspirem e emocionem pessoas", areas: ["criativas", "inspiracao"] },
        { id: "d", text: "Publicar descobertas científicas que avancem o conhecimento", areas: ["pesquisa", "conhecimento"] },
        { id: "e", text: "Ajudar pessoas a tomarem decisões importantes em suas vidas", areas: ["consultoria", "ajuda"] }
      ]
    },
    {
      id: 6,
      text: "Em qual setor você visualiza maior potencial de crescimento para sua carreira?",
      options: [
        { id: "a", text: "Startups de tecnologia e empresas de inovação", areas: ["startup", "inovacao"] },
        { id: "b", text: "Consultorias estratégicas e grandes corporações", areas: ["consultoria", "corporativo"] },
        { id: "c", text: "Agências de publicidade e produtoras de conteúdo", areas: ["agencia", "conteudo"] },
        { id: "d", text: "Universidades e institutos de pesquisa", areas: ["academico", "pesquisa"] },
        { id: "e", text: "Empresas de relacionamento com cliente e vendas B2B", areas: ["b2b", "relacionamento"] }
      ]
    }
  ];

  const areaDescriptions = {
    tecnologia: {
      name: "Tecnologia e Desenvolvimento",
      description: "Você tem forte afinidade com desenvolvimento, programação e soluções tecnológicas inovadoras.",
      careers: ["Desenvolvedor Full Stack", "Engenheiro de Software", "Arquiteto de Sistemas", "Tech Lead", "CTO"]
    },
    ciencias: {
      name: "Ciências e Pesquisa",
      description: "Você se destaca em análise científica, pesquisa metodológica e descoberta de conhecimento.",
      careers: ["Cientista de Dados", "Pesquisador Científico", "Analista de Pesquisa", "Data Scientist", "Especialista em IA"]
    },
    negocios: {
      name: "Negócios e Estratégia", 
      description: "Você tem visão empresarial aguçada e habilidades para estratégia de negócios.",
      careers: ["Gerente de Produtos", "Consultor Estratégico", "Analista de Negócios", "Product Manager", "CEO/Executivo"]
    },
    criativas: {
      name: "Áreas Criativas e Design",
      description: "Você possui talento natural para expressão visual, criatividade e comunicação através da arte.",
      careers: ["Designer UX/UI", "Diretor de Arte", "Designer Gráfico", "Creative Director", "Motion Designer"]
    },
    lideranca: {
      name: "Liderança e Gestão",
      description: "Você tem características naturais de liderança e capacidade para gestão de pessoas e projetos.",
      careers: ["Gerente Geral", "Diretor de Operações", "Líder de Equipe", "Scrum Master", "Head de Departamento"]
    },
    relacionamento: {
      name: "Relacionamento e Vendas",
      description: "Você se destaca em construir relacionamentos e tem facilidade para comunicação e persuasão.",
      careers: ["Gerente de Vendas", "Account Manager", "Consultor Comercial", "Sales Director", "Business Development"]
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

    // Agrupar áreas relacionadas para maior assertividade
    const groupedScores: Record<string, number> = {
      tecnologia: (areaScores["tecnologia"] || 0) + (areaScores["programacao"] || 0) + (areaScores["inovacao"] || 0) + 
                  (areaScores["produto"] || 0) + (areaScores["startup"] || 0) + (areaScores["digital"] || 0) +
                  (areaScores["tecnico"] || 0) + (areaScores["hands-on"] || 0) + (areaScores["debugging"] || 0) + 
                  (areaScores["sistema"] || 0) + (areaScores["lider-tech"] || 0) + (areaScores["desenvolvimento"] || 0) + 
                  (areaScores["futuro-tech"] || 0),
                  
      ciencias: (areaScores["ciencias"] || 0) + (areaScores["pesquisa"] || 0) + (areaScores["analitica"] || 0) + 
                (areaScores["descoberta"] || 0) + (areaScores["conhecimento"] || 0) + (areaScores["academico"] || 0) +
                (areaScores["cientifico"] || 0) + (areaScores["metodico"] || 0) + (areaScores["teoria"] || 0) + 
                (areaScores["conferencias"] || 0) + (areaScores["estudo"] || 0) + (areaScores["publicacoes"] || 0) + 
                (areaScores["citacoes"] || 0) + (areaScores["investigacao"] || 0) + (areaScores["pesquisa-profunda"] || 0) + 
                (areaScores["analise"] || 0) + (areaScores["pesquisador-senior"] || 0) + (areaScores["professor"] || 0) + 
                (areaScores["academico-senior"] || 0),
                
      negocios: (areaScores["negocios"] || 0) + (areaScores["gestao"] || 0) + (areaScores["corporativo"] || 0) + 
                (areaScores["estrategico"] || 0) + (areaScores["consultoria"] || 0) + (areaScores["multinacional"] || 0) +
                (areaScores["estrategia"] || 0) + (areaScores["visao"] || 0) + (areaScores["empresa"] || 0) + 
                (areaScores["crescimento"] || 0) + (areaScores["mba"] || 0) + (areaScores["executivo"] || 0) + 
                (areaScores["formal"] || 0) + (areaScores["promocoes"] || 0) + (areaScores["responsabilidade"] || 0) +
                (areaScores["organizacional"] || 0) + (areaScores["gestao-pessoas"] || 0) + (areaScores["ceo"] || 0) + 
                (areaScores["sociedade"] || 0) + (areaScores["empreendedor"] || 0),
                
      criativas: (areaScores["criativas"] || 0) + (areaScores["design"] || 0) + (areaScores["marketing"] || 0) + 
                 (areaScores["inspiracao"] || 0) + (areaScores["agencia"] || 0) + (areaScores["conteudo"] || 0) +
                 (areaScores["colaborativo"] || 0) + (areaScores["experiencia"] || 0) + (areaScores["criatividade"] || 0) + 
                 (areaScores["estetica"] || 0) + (areaScores["arte"] || 0) + (areaScores["visual"] || 0) + 
                 (areaScores["emocao"] || 0) + (areaScores["publicidade"] || 0) + (areaScores["tendencias"] || 0) + 
                 (areaScores["workshops"] || 0) + (areaScores["exploracao"] || 0) + (areaScores["premios"] || 0) + 
                 (areaScores["artistico"] || 0) + (areaScores["criativo"] || 0) + (areaScores["briefs"] || 0) + 
                 (areaScores["conceitos"] || 0) + (areaScores["inovacao-criativa"] || 0) + (areaScores["agencia-propria"] || 0) + 
                 (areaScores["freelancer"] || 0) + (areaScores["criativo-independente"] || 0),
                 
      lideranca: (areaScores["lideranca"] || 0) + (areaScores["gestao"] || 0) + (areaScores["resultados"] || 0) + 
                 (areaScores["performance"] || 0) + (areaScores["sustentabilidade"] || 0) + (areaScores["conflitos"] || 0),
                 
      relacionamento: (areaScores["relacionamento"] || 0) + (areaScores["comunicacao"] || 0) + (areaScores["vendas"] || 0) + 
                      (areaScores["comercial"] || 0) + (areaScores["b2b"] || 0) + (areaScores["cliente"] || 0) +
                      (areaScores["confianca"] || 0) + (areaScores["networking"] || 0) + (areaScores["emocional"] || 0) + 
                      (areaScores["persuasao"] || 0) + (areaScores["ajuda"] || 0) + (areaScores["transformacao"] || 0) + 
                      (areaScores["decisoes"] || 0) + (areaScores["mentoria"] || 0) + (areaScores["feedback"] || 0) + 
                      (areaScores["impacto-pessoas"] || 0) + (areaScores["satisfacao"] || 0) + (areaScores["necessidades-cliente"] || 0) + 
                      (areaScores["personalizacao"] || 0) + (areaScores["atendimento"] || 0) + (areaScores["consultoria-propria"] || 0) + 
                      (areaScores["especialista-b2b"] || 0) + (areaScores["relacionamento-senior"] || 0)
    };

    const sortedAreas = Object.entries(groupedScores)
      .map(([area, score]) => ({
        name: areaDescriptions[area as keyof typeof areaDescriptions]?.name || area,
        score: Math.max(15, (score / (questions.length * 0.3)) * 100), // Ajuste para 10 perguntas
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