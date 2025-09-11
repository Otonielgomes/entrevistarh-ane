import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2, Mail, MessageCircle, Copy, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewLinkSenderProps {
  jobId: string;
  jobTitle: string;
  companyName?: string;
}

export const InterviewLinkSender = ({ 
  jobId, 
  jobTitle, 
  companyName = "Animaserv" 
}: InterviewLinkSenderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [whatsappData, setWhatsappData] = useState({
    phone: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const { toast } = useToast();

  const interviewLink = `${window.location.origin}/interview?job=${jobId}&token=candidate-${Date.now()}`;

  const defaultEmailSubject = `Convite para Entrevista - ${jobTitle} | ${companyName}`;
  const defaultEmailMessage = `Olá!

Esperamos que você esteja bem.

Temos o prazer de convidá-lo(a) para participar da nossa entrevista online para a vaga de ${jobTitle}.

Para acessar sua entrevista, clique no link abaixo:
${interviewLink}

Detalhes da entrevista:
• Posição: ${jobTitle}
• Empresa: ${companyName}
• Formato: Entrevista online interativa
• Duração: Aproximadamente 30-45 minutos

Orientações:
- Certifique-se de ter uma conexão estável com a internet
- Use um ambiente tranquilo e bem iluminado
- Tenha seu currículo em mãos para consulta
- Responda de forma clara e objetiva às perguntas

Este link é pessoal e intransferível. Caso tenha qualquer dúvida ou precise reagendar, entre em contato conosco.

Aguardamos sua participação!

Atenciosamente,
Equipe de Recrutamento
${companyName}`;

  const defaultWhatsAppMessage = `🎯 *Convite para Entrevista - ${jobTitle}*

Olá! Temos o prazer de convidá-lo(a) para nossa entrevista online.

📋 *Vaga:* ${jobTitle}
🏢 *Empresa:* ${companyName}
⏱️ *Duração:* 30-45 min

🔗 *Link da entrevista:*
${interviewLink}

💡 *Dicas importantes:*
• Use ambiente tranquilo
• Conexão de internet estável
• Tenha seu currículo em mãos

Este é um link personalizado para você. Em caso de dúvidas, responda esta mensagem.

Boa sorte! 🍀`;

  useState(() => {
    setEmailData({
      to: '',
      subject: defaultEmailSubject,
      message: defaultEmailMessage
    });
    setWhatsappData({
      phone: '',
      message: defaultWhatsAppMessage
    });
  });

  const copyLink = () => {
    navigator.clipboard.writeText(interviewLink);
    toast({
      title: "Link copiado! 📋",
      description: "Link da entrevista copiado para a área de transferência."
    });
  };

  const sendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do email.",
        variant: "destructive"
      });
      return;
    }

    setSendingEmail(true);
    
    try {
      // Simular envio de email (aqui você integraria com um serviço de email)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email enviado! 📧",
        description: `Convite enviado para ${emailData.to}`
      });
      
      setEmailData({ ...emailData, to: '' });
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const sendWhatsApp = () => {
    if (!whatsappData.phone || !whatsappData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o número e a mensagem.",
        variant: "destructive"
      });
      return;
    }

    setSendingWhatsApp(true);
    
    // Limpar o número de telefone (remover espaços, parênteses, traços)
    const cleanPhone = whatsappData.phone.replace(/\D/g, '');
    
    // Adicionar código do país se não houver
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    // Encodar a mensagem para URL
    const encodedMessage = encodeURIComponent(whatsappData.message);
    
    // Abrir WhatsApp Web
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto! 💬",
      description: "A conversa foi aberta no WhatsApp Web."
    });
    
    setTimeout(() => setSendingWhatsApp(false), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:shadow-hover">
          <Share2 className="h-4 w-4 mr-2" />
          Enviar Convite
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Link da Entrevista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Preview */}
          <Card className="p-4 bg-gradient-card shadow-card border-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Link da Entrevista</h4>
                  <p className="text-sm text-muted-foreground">
                    Vaga: {jobTitle} | {companyName}
                  </p>
                </div>
                <Badge className="bg-success/10 text-success">
                  Ativo
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs text-foreground flex-1 break-all">
                  {interviewLink}
                </code>
                <Button size="sm" variant="outline" onClick={copyLink}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-to">Email do candidato *</Label>
                  <Input
                    id="email-to"
                    type="email"
                    placeholder="candidato@email.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Assunto *</Label>
                  <Input
                    id="email-subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-message">Mensagem *</Label>
                  <Textarea
                    id="email-message"
                    className="min-h-48"
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={sendEmail} 
                  disabled={sendingEmail}
                  className="w-full bg-gradient-primary hover:shadow-hover"
                >
                  {sendingEmail ? (
                    <>
                      <Mail className="h-4 w-4 mr-2 animate-pulse" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-phone">Número do WhatsApp *</Label>
                  <Input
                    id="whatsapp-phone"
                    placeholder="(11) 99999-9999"
                    value={whatsappData.phone}
                    onChange={(e) => setWhatsappData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formato: (DD) 9XXXX-XXXX ou apenas números
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-message">Mensagem *</Label>
                  <Textarea
                    id="whatsapp-message"
                    className="min-h-48"
                    value={whatsappData.message}
                    onChange={(e) => setWhatsappData(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={sendWhatsApp} 
                  disabled={sendingWhatsApp}
                  className="w-full bg-gradient-primary hover:shadow-hover"
                >
                  {sendingWhatsApp ? (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2 animate-pulse" />
                      Abrindo WhatsApp...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar via WhatsApp
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Isso abrirá o WhatsApp Web com a mensagem pré-preenchida
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};