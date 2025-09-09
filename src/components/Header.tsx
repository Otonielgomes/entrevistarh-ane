import animaservLogo from "@/assets/animaserv-logo.png";
import { Users, BarChart3, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-primary shadow-primary border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={animaservLogo} 
              alt="Animaserv Logo" 
              className="h-10 w-10 rounded-lg bg-white/20 p-1"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Animaserv</h1>
              <p className="text-white/80 text-sm">Plataforma de Seleção Inteligente</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;