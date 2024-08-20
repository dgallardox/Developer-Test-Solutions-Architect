# Developer-Test-Solutions-Architect

## Summary
A large business is transitioning from a traditional CMS on Adobe Experience Manager to Headless WordPress on WP Engine. Their priorities are seamless delivery across multiple device types, performance, security, and compliance.

## Suggestions
### performance
- Use the WPGraphQL Smart Cache plugin, GET requests, and Persisted Queries for intelligent caching.
- Use the proper start script for your application to serve the optimized files from the build step.
- Use site monitoring and lighthouse reports to ensure your website meets standards for speed and SEO. Furthermore, using a monitoring service that "pings" the site every 30 minutes will stop the site from scaling down to zero if you want to avoid that. ( Apps scale down to zero instances after an hour of zero visits ).
### security
- Do not commit env variables in code since this makes them visible in GitHub. Instead, add them securely to the User Portal in WP Engine. These can be downloaded when needed for local development.
- Use Oauth service to manage authentication to avoid dealing with sensitive data within your application.
- Use TypeScript to ensure type safety of code :)

## Atlas Architecture Diagram
![Atlas_Architecture (2)](https://github.com/user-attachments/assets/edea4861-23a9-4c19-bda0-4cdcd7ea9ea1)

---
# My implementation / King Collector
King Collector is a website built with Faust.js and WordPress CMS to showcase collectible items and informative posts. 

## Features
- Uses WPGraphQL Smart Cache, GET Requests, and Persisted Queries to handle caching.
- Implements ACF custom post types and custom field groups to create the "items" type and relevant fields.
- Uses ACF custom field groups to create a CTA on the WordPress homepage that is rendered on the front end.
- Implements the "useAuth" Faust hook for Oauth login and enables the WordPress Admin Toolbar for logged-in users.
- Tailwind CSS for inline styling
