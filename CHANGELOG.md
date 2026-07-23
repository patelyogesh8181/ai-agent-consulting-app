# Changelog

All notable changes to this project will be documented in this file.

The project follows Semantic Versioning.

## [Unreleased]

### Added

### Changed

### Fixed

## [1.0.0] - 2026-07-23

### Added

- Initial production release.
- React and TypeScript SPA built with Vite.
- ASP.NET Core Web API.
- Gemini AI integration.
- Microsoft.Extensions.AI integration.
- Enterprise prompt management using Markdown instruction files.
- Agent Decision Engine.
- Agent Context Builder.
- MCP tool service abstraction.
- SQL Server knowledge repository.
- Long-term conversation memory.
- Response caching.
- AI response formatting and validation.
- Multiple chat sessions.
- Local chat-history persistence.
- Pin and unpin chat functionality.
- Rename chat functionality.
- Delete chat functionality.
- Markdown response rendering.
- Clean Architecture project organization.

### Changed

- Separated AI orchestration into focused application services.
- Moved prompt construction out of `ConsultingAgentService`.
- Improved chat-history component structure.

### Fixed

- Gemini response formatting issues.
- Chat-session persistence issues.
- Chat-history menu rendering.
- Pinned-chat sorting.
- API CORS configuration.
- Swagger and OpenAPI configuration.
