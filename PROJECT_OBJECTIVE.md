# Project Objective

This project, "CJ Database," serves as a robust and scalable data synchronization service for Pipedrive CRM. Its primary objective is to create and maintain a persistent, real-time replica of Pipedrive data (such as Deals, Persons, Organizations, etc.) in a local MySQL database.

## Key Goals

1.  **Data Persistence:** To provide a reliable and independent data store that mirrors key entities from Pipedrive.
2.  **Real-time Synchronization:** To listen to Pipedrive webhook events and update the local database in near real-time, ensuring data consistency.
3.  **Scalability & Resilience:** To handle high volumes of webhook events gracefully by using a message queue (BullMQ), preventing data loss and ensuring the system remains responsive.
4.  **Decoupling & Integration:** To enable other internal applications and services to query and integrate with Pipedrive data through a standardized local database, without needing to directly access the Pipedrive API. This reduces dependency on the Pipedrive API, avoids rate limiting, and simplifies data access for other services.
5.  **Data Extensibility:** To provide a foundation where the replicated data can be enriched, transformed, or used for custom analytics and reporting that are not possible within Pipedrive itself.
