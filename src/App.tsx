
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Document from "./pages/Document";
import Timeline from "./pages/Timeline";
import ThenNow from "./pages/ThenNow";
import Search from "./pages/Search";
import PeopleForgot from "./pages/PeopleForgot";
import Reminder from "./pages/Reminder";
import Author from "./pages/Author";
import Contact from "./pages/Contact";
import FeedbackAdmin from "./pages/FeedbackAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/document/:id" element={<Document />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/then-now" element={<ThenNow />} />
          <Route path="/search" element={<Search />} />
          <Route path="/people-forgot" element={<PeopleForgot />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/author" element={<Author />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/feedback" element={<FeedbackAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;