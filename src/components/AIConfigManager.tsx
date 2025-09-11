import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, Settings, Key, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIConfigManagerProps {
  onConfigSave?: (config: AIConfig) => void;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'perplexity';
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    description: 'Modelo mais popular e versátil',
    recommended: 'gpt-4o'
  },
  anthropic: {
    name: 'Anthropic Claude',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    description: 'Excelente para análise detalhada',
    recommended: 'claude-3-5-sonnet-20241022'
  },
  google: {
    name: 'Google Gemini',
    models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro'],
    description: 'Ótimo para processamento multimodal',
    recommended: 'gemini-1.5-pro'
  },
  perplexity: {
    name: 'Perplexity',
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
    description: 'Acesso a informações atualizadas',
    recommended: 'llama-3.1-sonar-large-128k-online'
  }
};

export const AIConfigManager = ({ onConfigSave }: AIConfigManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AIConfig>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o',
    maxTokens: 2000,
    temperature: 0.3,
    systemPrompt: `Você é um especialista em recursos humanos e análise de candidatos. Sua função é:

1. Analisar respostas de candidatos em entrevistas
2. Gerar perguntas relevantes baseadas na descrição da vaga
3. Avaliar competências técnicas e comportamentais
4. Fornecer feedback construtivo e scores precisos

Mantenha sempre:
- Objetividade e imparcialidade
- Foco nas competências necessárias para a vaga
- Feedback construtivo e respeitoso
- Análise baseada em evidências das respostas

Formato de resposta sempre em português brasileiro.`
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Carregar configuração salva do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Erro ao carregar configuração de IA:', error);
      }
    }
  }, []);

  const saveConfig = () => {
    if (!config.apiKey.trim()) {
      toast({
        title: "API Key obrigatória",
        description: "Insira sua API Key para continuar.",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('aiConfig', JSON.stringify(config));
    onConfigSave?.(config);
    setIsOpen(false);
    
    toast({
      title: "Configuração salva! 🤖",
      description: `IA configurada com ${AI_PROVIDERS[config.provider].name} - ${config.model}`
    });
  };

  const testConnection = async () => {
    if (!config.apiKey.trim()) {
      toast({
        title: "API Key necessária",
        description: "Insira sua API Key para testar a conexão.",
        variant: "destructive"
      });
      return;
    }

    setTestStatus('testing');
    
    try {
      // Simular teste de conexão baseado no provider
      const testPrompt = "Responda apenas 'OK' para confirmar que a conexão está funcionando.";
      
      let testUrl = '';
      let headers = {};
      let body = {};

      switch (config.provider) {
        case 'openai':
          testUrl = 'https://api.openai.com/v1/chat/completions';
          headers = {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          };
          body = {
            model: config.model,
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          };
          break;
        case 'anthropic':
          testUrl = 'https://api.anthropic.com/v1/messages';
          headers = {
            'x-api-key': config.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          };
          body = {
            model: config.model,
            max_tokens: 50,
            messages: [{ role: 'user', content: testPrompt }]
          };
          break;
        case 'perplexity':
          testUrl = 'https://api.perplexity.ai/chat/completions';
          headers = {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          };
          body = {
            model: config.model,
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          };
          break;
      }

      const response = await fetch(testUrl, {
        method: 'POST',
        headers: headers as any,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setTestStatus('success');
        toast({
          title: "Conexão bem-sucedida! ✅",
          description: "A API está funcionando corretamente."
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setTestStatus('error');
      toast({
        title: "Erro na conexão",
        description: "Verifique sua API Key e tente novamente.",
        variant: "destructive"
      });
    }

    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const currentProvider = AI_PROVIDERS[config.provider];
  const isConfigured = !!config.apiKey && config.apiKey.length > 10;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Brain className="h-4 w-4" />
          Configurar IA
          {isConfigured && <CheckCircle className="h-3 w-3 text-success" />}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração da IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>Provedor de IA</Label>
            <Select 
              value={config.provider} 
              onValueChange={(value: any) => {
                const newProvider = AI_PROVIDERS[value as keyof typeof AI_PROVIDERS];
                setConfig(prev => ({ 
                  ...prev, 
                  provider: value,
                  model: newProvider.recommended
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {provider.name}
                      <Badge variant="secondary" className="text-xs">
                        {provider.description}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <Label>API Key do {currentProvider.name}</Label>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Sua API Key aqui..."
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                className="flex-1"
              />
              <Button 
                onClick={testConnection}
                variant="outline"
                disabled={testStatus === 'testing' || !config.apiKey}
              >
                {testStatus === 'testing' && <Zap className="h-4 w-4 mr-1 animate-pulse" />}
                {testStatus === 'success' && <CheckCircle className="h-4 w-4 mr-1 text-success" />}
                {testStatus === 'error' && <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />}
                Testar
              </Button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <Label>Modelo</Label>
            <Select 
              value={config.model} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentProvider.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    <div className="flex items-center gap-2">
                      {model}
                      {model === currentProvider.recommended && (
                        <Badge className="text-xs bg-success/10 text-success">
                          Recomendado
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tokens Máximos</Label>
              <Input
                type="number"
                min="100"
                max="8000"
                value={config.maxTokens}
                onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 2000 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Temperatura (Criatividade)</Label>
              <Input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.3 }))}
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-3">
            <Label>Prompt do Sistema (Personalização do Comportamento da IA)</Label>
            <textarea
              className="w-full min-h-32 p-3 border rounded-md bg-background text-foreground"
              value={config.systemPrompt}
              onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
              placeholder="Defina como a IA deve se comportar..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveConfig} className="bg-gradient-primary hover:shadow-hover">
              <Brain className="h-4 w-4 mr-2" />
              Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};