import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../presentation/layouts/MainLayout";
import { HomePage } from "../pages/home/HomePage";
import { AboutPage } from "../pages/about/AboutPage";
import { ChatPage } from "../pages/chat/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
    ],
  },
]);
