# Changelog

All notable changes to this project will be documented in this file.

The project follows Semantic Versioning.

## [1.0.1](https://github.com/patelyogesh8181/ai-agent-consulting-app/compare/v1.0.0...v1.0.1) (2026-10-05)


### Bug Fixes

* filter out null messages and ensure valid message roles in chat display ([192a803](https://github.com/patelyogesh8181/ai-agent-consulting-app/commit/192a80344bd95c00c2c54cc4699d78e7a15ba602))
* update user label from "User" to "You" in chat message display ([8ec4e79](https://github.com/patelyogesh8181/ai-agent-consulting-app/commit/8ec4e79d855fb1c89b36298f927595ccb026f4c2))
* update user label in chat message display ([9d76b61](https://github.com/patelyogesh8181/ai-agent-consulting-app/commit/9d76b6134d957280760d1acc8d6207d956fa2ffc))

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
