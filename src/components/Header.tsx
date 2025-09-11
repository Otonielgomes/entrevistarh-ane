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
                src="/lovable-uploads/2367ed51-06ad-4225-a9af-d83de6fd294e.png" 
                alt="AnimaServ Recursos Humanos" 
                className="h-14 w-auto max-w-[200px] object-contain"
              />
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