# Contributing to UIVORA

Welcome, and thank you for considering contributing to UIVORA! We value your help in making this project better.

## Setting up Local Development Environment

To make frontend development smoother, you can set up your local environment to bypass the authentication flow. This allows you to work on UI elements and user experience without needing to log in or have a fully running backend authentication service.

### Skipping Authentication (for Frontend Development)

Follow these steps to skip authentication:

1.  **Create a local environment file**: If you don't already have one, create a file named `.env.local` in the root directory of the project. This file is ignored by Git, so your local settings won't be committed.

2.  **Set the development mode variable**: Add the following line to your `.env.local` file:

    ```
    NEXT_PUBLIC_DEV_MODE="skip_auth"
    ```

3.  **Restart your development server**: If your server was already running, stop it and start it again for the changes to take effect.

    ```bash
    npm run dev
    ```

With this setting, protected routes like `/dashboard` should be accessible without logging in.


## Contribution Guidelines

- **Backend Code**: When using the `skip_auth` mode for frontend development, **please avoid making direct changes to the core backend authentication logic, API endpoints, or any other backend-related files** unless it is a specifically discussed and approved part of your Pull Request. The development modes are intended to simplify frontend work, not to alter the production authentication flow.
- **Discuss first**: If you plan to make significant changes or add new features, please open an issue first to discuss your ideas.
- **Follow existing patterns**: Try to follow the coding style and patterns used in the existing codebase.

Happy contributing!
