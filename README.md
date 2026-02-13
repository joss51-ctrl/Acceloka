# Acceloka Ticket Management System

This project is a technical assessment for the **Acceloka Exam**, focusing on a Ticket Management System built with **.NET Core 8**, **MediatR**, and **Clean Architecture** principles.

## Features
* **Get Available Tickets**: View all tickets that are still within their event date and have remaining quota.
* **Book Tickets**: Register a new booking for one or more ticket categories.
* **Get Booked Ticket Detail**: Retrieve details of a specific booking including categories and pricing.
* **Edit Booked Ticket**: Update the quantity of tickets in an existing booking.
* **Revoke Ticket**: Partially or fully cancel a booked ticket and restore the quota.

## Tech Stack
* **Framework**: .NET 10 Web API
* **Database**: SQL Server with Entity Framework Core
* **Libraries**:
    * **MediatR**: Digunakan untuk implementasi pola CQRS (Command Query Responsibility Segregation).
    * **FluentValidation**: Digunakan untuk mengelola aturan validasi input secara terpisah dan bersih.
    * **Entity Framework Core**: Sebagai ORM untuk berinteraksi dengan SQL Server.
    * **Serilog**: Digunakan untuk pencatatan log (logging) ke dalam file secara otomatis.
    * **Swagger/OpenAPI**: Digunakan sebagai antarmuka dokumentasi API untuk pengujian endpoint.

### Prerequisites
* Visual Studio 2022 or higher
* SQL Server
* .NET 8 SDK
* SQL Server Management Studio

### Installation
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/joss51-ctrl/Acceloka.git](https://github.com/joss51-ctrl/Acceloka.git)

2. **Database configuration**
   Update the ConnectionStrings in appsettings.json to point to your local SQL Server instance:
  ```
   "ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=Acceloka_Exam1;Trusted_Connection=True;TrustServerCertificate=True;"
  }
```
4. **Apply migration**
   Run the following command in the Package Manager Console to set up your database:
```
    Update-Database
```
6. **Run the Application**
   Press F5 in Visual Studio to start the API and open the Swagger UI.

Project Structure
Acceloka_Exam1: The main Web API project containing Controllers, Features (CQRS), and Business Logic.

Acceloka.entities: The Infrastructure and Domain layer containing the DBContext and Entity Models.
