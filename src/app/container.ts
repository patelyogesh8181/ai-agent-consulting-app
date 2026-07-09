import { ChatApiClient } from "../infrastructure/api/ChatApiClient";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { ChatStorage } from "../infrastructure/storage/ChatStorage";
import { ChatHistoryUseCase } from "../useCases/ChatHistoryUseCase";
import { SendMessageUseCase } from "../useCases/SendMessageUseCase";

// Infrastructure
const chatApiClient = new ChatApiClient();
const chatRepository = new ChatRepository(chatApiClient);
const chatStorage = new ChatStorage();

// Dependency Injection Container
export const container = {
  sendMessageUseCase: new SendMessageUseCase(chatRepository),
  chatHistoryUseCase: new ChatHistoryUseCase(chatStorage),
};
