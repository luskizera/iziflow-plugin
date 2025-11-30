# Contributing to IziFlow

First off, thank you for considering contributing to IziFlow! We welcome any help, from reporting a bug to implementing a new feature.

This document provides a guide for making contributions to the project.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/luskizera/iziflow-plugin/issues). If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/luskizera/iziflow-plugin/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for an enhancement, please open an issue to discuss it. This allows us to coordinate efforts and ensure the proposed change aligns with the project's goals.

## Your First Code Contribution

Ready to contribute code? Here’s how to set up your environment and submit your changes.

### 1. Development Environment Setup

All the instructions for getting the project running on your local machine are in our developer guide.

**➡️ [Developer Guide: Getting Started](./docs/guides/getting-started.md)**

This guide covers prerequisites, installation, and how to run the plugin in development mode.

### 2. Contribution Workflow

We use a standard GitHub flow for contributions.

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** to your local machine.
3.  **Create a feature branch** for your changes:
    ```bash
    git checkout -b your-feature-name
    ```
    Please use a descriptive branch name (e.g., `feat/add-new-node-shape` or `fix/yaml-parser-bug`).

4.  **Make your changes** and commit them with a clear commit message. We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. For example:
    -   `feat: Add support for cloud-shaped nodes`
    -   `fix: Correctly parse multi-line string inputs`
    -   `docs: Update contribution guidelines`

5.  **Push your branch** to your fork on GitHub:
    ```bash
    git push origin your-feature-name
    ```
6.  **Open a Pull Request** from your feature branch to the `main` branch of the original IziFlow repository.
7.  Provide a clear description of the changes in your Pull Request and link any relevant issues.

### 3. Code Style

This project uses Prettier and ESLint to enforce a consistent code style. Please run the formatter before committing your changes. Most code editors can be configured to do this automatically on save.

Thank you again for your contribution!
