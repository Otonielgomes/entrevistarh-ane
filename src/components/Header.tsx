import animaservLogo from "@/assets/animaserv-logo.png";
import { Users, BarChart3, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-primary shadow-primary border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={animaservLogo} 
                alt="Animaserv Recursos Humanos" 
                className="h-12 w-12 rounded-xl bg-white/10 p-2 shadow-lg backdrop-blur-sm"
              />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Animaserv</h1>
              <p className="text-white/90 text-sm font-medium">Recursos Humanos • Seleção Inteligente</p>
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