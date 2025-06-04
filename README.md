# Maintenance Management System

## Overview

This Maintenance Management System (MMS) is a comprehensive web application designed to streamline and optimize maintenance operations for industrial environments. It provides tools for managing inventory, procurement, assets, work orders, and preventive maintenance schedules, helping to reduce downtime and improve overall efficiency.

## Key Features

### 1. Warehouse & Inventory Management
*   **Detailed Item Tracking:**
    *   **Location:** Manage multiple warehouse locations.
    *   **Shelf System:** Define shelves, shelf rows, and individual shelf boxes for precise item placement.
*   **Item Categorization:**
    *   **Category:** Differentiate items as "Tools" or "Spare Parts".
    *   **Type:** Further classify items as "Electrical" or "Mechanical".
*   **Stock Control:**
    *   **Minimum Stock Levels:** Set thresholds to trigger reordering.
    *   **Unit of Measures (UoM):** Define units for items (e.g., pcs, kg, m).
*   **Inventory Transfers:**
    *   Seamlessly transfer items between different warehouse locations, ensuring accurate inventory records.

### 2. Supplier Management
*   **Contacts List:** Maintain a centralized database of suppliers.
*   **Item-Supplier Linking:** Associate specific items with their respective suppliers for easy procurement.

### 3. Purchase Management
*   **Purchase Requisition:** Users can request the purchase of items.
*   **Purchase Receiving:** Track the receipt of ordered items into the warehouse.
*   **Purchase Scheduling:** Plan and schedule purchases to optimize inventory levels and budget.

### 4. Asset Management
*   **Asset Hierarchy:**
    *   **Plants:** Manage assets across multiple manufacturing plants (if applicable).
    *   **Areas:** Assign assets (machines) to specific areas within a plant.
*   **Machine & Equipment Tracking:** Register and manage details of factory machines and their internal equipment/components.

### 5. Work Order Management
*   **Activity Checklists:** Create work orders with a list of activities or tasks for engineers to complete.
*   **Assignment & Submission:** Assign work orders to engineers and track their submission upon completion.

### 6. Breakdown Management
*   **Breakdown Recording:** Log machine breakdowns with relevant details (e.g., machine, time, description of issue).
*   **Work Order Creation from Breakdown:** Directly generate a work order from a recorded breakdown to address the issue.

### 7. Schedule & Preventive Maintenance
*   **Schedule Templates:** Create reusable work order templates for routine maintenance tasks.
*   **Schedule Types:** Define schedule frequencies (e.g., Daily, Weekly, Monthly, Annually).
*   **Work Order Generation from Schedules:** Automatically or manually create work orders based on predefined schedules and assign them to engineers.

## Technologies Used

*   **Backend:**
    *   Python
    *   Django
    *   Django REST Framework
*   **Frontend:**
    *   React
    *   TypeScript
*   **UI Libraries:**
    *   Material UI
    *   Tailwind CSS
*   **Database:**
    *   PostgreSQL