import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Measurement from "@/pages/measurement";
import StyleQuiz from "@/pages/style-quiz";
import Marketplace from "@/pages/marketplace";
import DesignDetails from "@/pages/design-details";
import Order from "@/pages/order";
import Profile from "@/pages/profile";
import TailorDashboard from "@/pages/tailor-dashboard";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/measurement" component={Measurement} />
          <Route path="/style-quiz" component={StyleQuiz} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/design/:id" component={DesignDetails} />
          <Route path="/order/:id" component={Order} />
          <Route path="/profile" component={Profile} />
          <Route path="/tailor-dashboard" component={TailorDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
