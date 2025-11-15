import "./global.css";

import { Toaster } from "@/components/ui/toaster";
// createRoot/mounting handled by `client/main.tsx`
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Placeholder from "./pages/Placeholder";
import Servicios from "./pages/Servicios";
import Experiencia from "./pages/Experiencia";
import Acerca from "./pages/Acerca";
import Agenda from "./pages/Agenda";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Banner: show warning when VITE_GOOGLE_CLIENT_ID is missing */}
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? null : (
        <div className="fixed left-4 top-4 z-50 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 shadow">
          <strong>Warning:</strong> VITE_GOOGLE_CLIENT_ID no está definido. Google OAuth puede fallar.
        </div>
      )}
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/experiencia" element={<Experiencia />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/contacto" element={<Placeholder title="Contacto" description="Déjanos tu mensaje y nos pondremos en contacto." />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Placeholder title="Panel Administrativo" description="Gestiona contenidos, usuarios, citas y mensajes." />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
