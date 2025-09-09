import { useState } from "react";
import { MessageCircle, Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: 'ane' | 'candidate';
  content: string;
  timestamp: Date;
}

const InterviewInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ane',
      content: 'Olá! Eu sou a Ane, sua entrevistadora virtual da Animaserv. É um prazer conhecê-lo! Estamos muito animados para conversar com você sobre a vaga de Desenvolvedor Full Stack. Vamos começar nossa conversa de forma natural e descontraída. Como você está se sentindo hoje?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const candidateInfo = {
    name: "João Silva",
    position: "Desenvolvedor Full Stack",
    company: "Animaserv"
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'candidate',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simular resposta da Ane
    setTimeout(() => {
      const aneResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ane',
        content: 'Que bom saber! Agora vou fazer algumas perguntas para conhecermos melhor seu perfil profissional. Primeira pergunta: Conte-me sobre sua experiência com desenvolvimento web e quais tecnologias você mais utiliza no seu dia a dia.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aneResponse]);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-primary border-0">
          {/* Header da Entrevista */}
          <div className="bg-gradient-primary p-6 rounded-t-lg">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-2xl font-bold">Entrevista com Ane</h1>
                <p className="opacity-90">Vaga: {candidateInfo.position}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{candidateInfo.name}</p>
                <p className="opacity-90">{candidateInfo.company}</p>
              </div>
            </div>
          </div>

          {/* Area de Mensagens */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-card">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md`}>
                    {message.sender === 'ane' && (
                      <Avatar className="bg-gradient-primary">
                        <AvatarFallback className="text-white font-semibold">Ane</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
                        message.sender === 'ane'
                          ? 'bg-white border border-border'
                          : 'bg-gradient-primary text-white'
                      }`}
                    >
                      <p className={message.sender === 'ane' ? 'text-foreground' : 'text-white'}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'ane' ? 'text-muted-foreground' : 'text-white/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.sender === 'candidate' && (
                      <Avatar className="bg-success">
                        <AvatarFallback className="text-white font-semibold">
                          {candidateInfo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input de Mensagem */}
          <div className="p-6 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="transition-all duration-300"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                💪 Lembre-se: não existem respostas certas ou erradas, seja autêntico!
              </p>
            </div>
          </div>
        </Card>
        
        {/* Mensagem Motivacional */}
        <Card className="max-w-4xl mx-auto mt-6 p-4 bg-gradient-to-r from-success/10 to-accent/10 border-0">
          <div className="text-center">
            <p className="text-sm text-foreground">
              ✨ <strong>Dica da Ane:</strong> Responda com naturalidade e conte suas experiências de forma clara. 
              Estou aqui para te conhecer melhor e encontrar o melhor encaixe para você na Animaserv!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewInterface;