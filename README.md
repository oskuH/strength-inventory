# Strength Inventory
**Web application for comparing gym equipment, memberships, and opening hours.**

## Status
First Alpha release planned in July 26.

## Stack
Frontend: **React** with **TanStack Router** and **TanStack Query**. **Vite** as the build tool.

Backend: **Express** with **Sequelize** for ORM.

General: Runtime validation is performed with **Zod**, and **Node v24.13.0** is currently being used as the runtime environment. The app is intended to be run with **PostgreSQL** as its database, but there is an underlying principle to keep things as plug-and-play as possible with other databases. 