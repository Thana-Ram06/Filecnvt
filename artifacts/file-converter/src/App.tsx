import { Switch, Route, Router as WouterRouter } from "wouter";
import { HomePage } from "@/pages/HomePage";
import { ToolPage } from "@/pages/ToolPage";
import { useEffect } from "react";

function ThemeInit() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fc-theme");
      if (stored === "light") document.documentElement.classList.add("light");
    } catch {}
  }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tools/:tool" component={ToolPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="font-serif text-3xl text-foreground">404</p>
            <p className="text-muted-foreground text-sm">Page not found.</p>
            <a href="/" className="text-primary text-sm hover:underline">Go home</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <>
      <ThemeInit />
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </>
  );
}

export default App;
