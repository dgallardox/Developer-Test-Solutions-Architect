# Developer-Test-Solutions-Architect

## Summary
A large business is transitioning from a traditional CMS on Adobe Experience Manager to Headless WordPress on WP Engine. Their priorities are seamless delivery across multiple device types, performance, security, and compliance.

## Suggestions
### performance
- Use the WPGraphQL Smart Cache plugin, GET requests, and Persisted Queries for intelligent caching.
- Use the proper start script for your application to serve the optimized files from the build step.
### security
- Do not commit env variables in code since this makes them visible in GitHub. Instead, add them securely to the User Portal in WP Engine. These can be downloaded when needed for local development.
- 

## Atlas Architecture Diagram
![Atlas_Architecture (2)](https://github.com/user-attachments/assets/edea4861-23a9-4c19-bda0-4cdcd7ea9ea1)
