import "./App.css";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { TweetPage } from "./pages/TweetPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Footer } from "./components/Footer";
import { UserPage } from "./pages/UserPage";

function App() {
  return (
    <main className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tweet/:id" element={<TweetPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
