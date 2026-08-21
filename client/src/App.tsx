import AppRouter from "@/app/router/AppRouter";
import { ThemeProvider } from "@/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}