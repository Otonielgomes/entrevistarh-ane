import { useSearchParams } from "react-router-dom";
import InterviewInterface from "@/components/InterviewInterface";

const Interview = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const candidateToken = searchParams.get('token');

  // Verificar se os parâmetros necessários estão presentes
  if (!jobId || !candidateToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-success/5">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Link Inválido</h1>
          <p className="text-muted-foreground">
            Este link de entrevista não é válido ou expirou. 
            Entre em contato com a Animaserv para receber um novo link.
          </p>
        </div>
      </div>
    );
  }

  return <InterviewInterface />;
};

export default Interview;