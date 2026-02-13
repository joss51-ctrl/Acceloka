CREATE DATABASE Acceloka_Exam1
GO

USE Acceloka_Exam1

CREATE TABLE Tickets (
    TicketId INT NOT NULL
        CONSTRAINT PK_Tickets PRIMARY KEY IDENTITY,
    TicketCode NVARCHAR(50) NOT NULL
        CONSTRAINT UQ_TicketCode UNIQUE,
    TicketName NVARCHAR(200) NOT NULL,
    CategoryName NVARCHAR(100) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    Quota INT NOT NULL,
    EventDate DATETIME NOT NULL,
);

CREATE TABLE BookedTickets (
    Id INT NOT NULL
        CONSTRAINT PK_BookedTickets PRIMARY KEY IDENTITY,
    BookedTicketId UNIQUEIDENTIFIER NOT NULL, 
    TicketCode NVARCHAR(50) NOT NULL
        CONSTRAINT FK_BookedTickets_Tickets FOREIGN KEY (TicketCode) 
        REFERENCES Tickets(TicketCode),
    Quantity INT NOT NULL,
    BookingDate DATETIME NOT NULL CONSTRAINT DF_BookingDate DEFAULT GETDATE(),
);
