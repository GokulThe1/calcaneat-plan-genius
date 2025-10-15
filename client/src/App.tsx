import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
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
import DeliveryPanel from "@/pages/DeliveryPanel";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  const withLayout = (Component: React.ComponentType) => () => (
    <AuthenticatedLayout>
      <Component />
    </AuthenticatedLayout>
  );

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
          <Route path="/" component={withLayout(Profile)} />
          <Route path="/plans" component={Plans} />
          <Route path="/ai-plan" component={AIPlan} />
          <Route path="/clinical-plan" component={ClinicalPlan} />
          <Route path="/book-consultation" component={ConsultationBooking} />
          <Route path="/signup-character" component={SignupCharacter} />
          <Route path="/payment" component={DummyPayment} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/profile" component={withLayout(Profile)} />
          <Route path="/dashboard" component={withLayout(Dashboard)} />
          <Route path="/admin" component={withLayout(Admin)} />
          <Route path="/kitchen" component={withLayout(Kitchen)} />
          <Route path="/delivery" component={withLayout(Delivery)} />
          <Route path="/consultant" component={withLayout(ConsultantPanel)} />
          <Route path="/lab" component={withLayout(LabTechnicianPanel)} />
          <Route path="/nutritionist" component={withLayout(NutritionistPanel)} />
          <Route path="/chef" component={withLayout(ChefPanel)} />
          <Route path="/delivery-panel" component={withLayout(DeliveryPanel)} />
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
