import Header from "@/components/Header";
import DeckDetailPage from "@/pages/DeckDetail";
import DecksPage from "@/pages/Decks";
import HomePage from "@/pages/index";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-dvh">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
