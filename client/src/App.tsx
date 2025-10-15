import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import AIPlan from "@/pages/AIPlan";
import ClinicalPlan from "@/pages/ClinicalPlan";
import ConsultationBooking from "@/pages/ConsultationBooking";
import SignupCharacter from "@/pages/SignupCharacter";
import DummyPayment from "@/pages/DummyPayment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Kitchen from "@/pages/Kitchen";
import Delivery from "@/pages/Delivery";
import ConsultantPanel from "@/pages/ConsultantPanel";
import LabTechnicianPanel from "@/pages/LabTechnicianPanel";
import NutritionistPanel from "@/pages/NutritionistPanel";
import ChefPanel from "@/pages/ChefPanel";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/plans" component={Plans} />
          <Route path="/ai-plan" component={AIPlan} />
          <Route path="/clinical-plan" component={ClinicalPlan} />
          <Route path="/book-consultation" component={ConsultationBooking} />
          <Route path="/signup-character" component={SignupCharacter} />
          <Route path="/payment" component={DummyPayment} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Profile} />
          <Route path="/plans" component={Plans} />
          <Route path="/ai-plan" component={AIPlan} />
          <Route path="/clinical-plan" component={ClinicalPlan} />
          <Route path="/book-consultation" component={ConsultationBooking} />
          <Route path="/signup-character" component={SignupCharacter} />
          <Route path="/payment" component={DummyPayment} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/profile" component={Profile} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
          <Route path="/kitchen" component={Kitchen} />
          <Route path="/delivery" component={Delivery} />
          <Route path="/consultant" component={ConsultantPanel} />
          <Route path="/lab" component={LabTechnicianPanel} />
          <Route path="/nutritionist" component={NutritionistPanel} />
          <Route path="/chef" component={ChefPanel} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
