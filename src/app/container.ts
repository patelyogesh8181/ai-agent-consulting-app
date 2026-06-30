import { ChatApiClient } from "../infrastructure/api/ChatApiClient";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { SendMessageUseCase } from "../useCases/SendMessageUseCase";

// Infrastructure
const chatApiClient = new ChatApiClient();
const chatRepository = new ChatRepository(chatApiClient);

// Application
const sendMessageUseCase = new SendMessageUseCase(chatRepository);

// Dependency Injection Container
export const container = {
  sendMessageUseCase,
};
