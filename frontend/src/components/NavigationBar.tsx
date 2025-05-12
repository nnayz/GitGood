import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const NavigationBar: React.FC = () => {
    return (
        <header className="w-full border-b border-border">
        <NavigationMenu className="flex justify-center items-center p-2 bg-background">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                Getting Started
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-background border-border">
                <NavigationMenuLink asChild className="text-foreground hover:text-accent-foreground hover:bg-accent">
                  <Link to="/getting-started">Getting Started</Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    )
}

export default NavigationBar;
