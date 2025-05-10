# URL Shortener API

**Version: 1.0.0**

This API provides a simple service to create, manage, and use shortened URLs. It is built using FastAPI, SQLAlchemy, and SQLite.

## Table of Contents

1.  [Features](#features)
2.  [Technologies Used](#technologies-used)
3.  [Setup and Running](#setup-and-running)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running the API](#running-the-api)
4.  [API Endpoints](#api-endpoints)
    *   [POST /urls/](#post-urls)
    *   [GET /urls/](#get-urls)
    *   [DELETE /urls/delete](#delete-urlsdelete)
    *   [GET /{short_code}](#get-short_code)
5.  [CORS Configuration](#cors-configuration)
6.  [Database](#database)
7.  [Short Code Generation](#short-code-generation)

## Features

*   Shorten long URLs into unique, random short codes.
*   Redirect users from short codes to their original long URLs.
*   List all existing shortened URLs (with pagination).
*   Delete specific shortened URLs by their ID.
*   Prevents creation of duplicate entries for the same original URL.

## Technologies Used

*   **FastAPI**: For building the API.
*   **SQLAlchemy**: For ORM and database interaction.
*   **SQLite**: As the relational database (a `urls.db` file will be created).
*   **Pydantic**: For data validation and serialization (used internally by FastAPI).
*   **Uvicorn**: As the ASGI server to run the application.

## Setup and Running

### Prerequisites

*   Python 3.12+
*   uv (Python package manager)

### Installation

1.  **Clone the repository (if applicable) or save the code:**
    ```bash
    git clone git@github.com:Arjunsharmahehe/urlShortener.git
    ```

2.  **Install dependencies:**
    We are using `uv`, so we don't need to add the dependencies. It will automatically do everything using the `pyproject.toml` file.     
    To run the project just navigate to `/backend` and run
    ```bash
    uv run main.py
    ```

### Running the API

1.  Navigate to the directory where you saved `main.py`.
2.  Run the application using uv:
    ```bash
    uv run main.py
    ```
    (Assuming your file is named `main.py`)

The API will be available at `http://127.0.0.1:8000`.
You can access the interactive API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.

## API Endpoints

The following are the available API endpoints.

---

### `POST /urls/`

*   **Description**: Creates a new shortened URL entry. If the original URL already exists, it returns the existing short URL.
*   **Request Body**: `application/json`
    *   `original_url` (string, required): The long URL to be shortened.
    ```json
    {
      "original_url": "https://www.example.com/a/very/long/path/that/needs/to/be/shortened"
    }
    ```
*   **Success Response**:
    *   **Status Code**: `201 CREATED`
    *   **Body**: `application/json`
        *   `id` (integer): The unique identifier of the URL entry.
        *   `original_url` (string): The original URL provided.
        *   `short_url` (string): The generated unique short code.
    ```json
    {
      "original_url": "https://www.example.com/a/very/long/path/that/needs/to/be/shortened",
      "short_url": "aB3xYz",
      "id": 1
    }
    ```
*   **Error Responses**:
    *   `400 BAD_REQUEST`: If `original_url` is empty or invalid.
        ```json
        { "detail": "Original URL cannot be empty" }
        ```
    *   `422 UNPROCESSABLE ENTITY`: If `original_url` is not a valid URL format (handled by Pydantic's `HttpUrl`).
    *   `500 INTERNAL_SERVER_ERROR`:
        *   If a unique short code cannot be generated after multiple retries.
            ```json
            { "detail": "Could not generate a unique short code after multiple retries. Try increasing length or check DB." }
            ```
        *   If there's an issue committing to the database.
            ```json
            { "detail": "Could not create URL entry" }
            ```

---

### `GET /urls/`

*   **Description**: Retrieves a list of all shortened URL entries. Supports pagination.
*   **Query Parameters**:
    *   `skip` (integer, optional, default: `0`): Number of records to skip for pagination.
    *   `limit` (integer, optional, default: `100`): Maximum number of records to return.
*   **Success Response**:
    *   **Status Code**: `200 OK`
    *   **Body**: `application/json` (List of URL objects)
    ```json
    [
      {
        "original_url": "https://www.example.com/another/link",
        "id": 1,
        "short_url": "aB3xYz"
      },
      {
        "original_url": "https://www.google.com",
        "id": 2,
        "short_url": "cDe4Fg"
      }
    ]
    ```
*   **Error Responses**:
    *   Generally, this endpoint should not produce client-side errors if parameters are valid. Server-side database issues could result in a `500`.

---

### `DELETE /urls/delete`

*   **Description**: Deletes a specific shortened URL entry by its ID.
*   **Request Body**: `application/json`
    *   `id` (integer, required): The ID of the URL entry to delete.
    ```json
    {
      "id": 1
    }
    ```
*   **Success Response**:
    *   **Status Code**: `200 OK`
    *   **Body**: `application/json`
    ```json
    {
      "message": "Item with id 1 deleted successfully"
    }
    ```
*   **Error Responses**:
    *   `404 NOT_FOUND`: If no URL entry with the given ID exists.
        ```json
        { "detail": "Item with id 1 not found" }
        ```
    *   `500 INTERNAL_SERVER_ERROR`: If there's an issue committing the deletion to the database.
        ```json
        { "detail": "Could not delete URL entry" }
        ```

---

### `GET /{short_code}`

*   **Description**: Redirects to the original URL associated with the given `short_code`.
    *   *Note: This endpoint is configured with `include_in_schema=False`, so it will not appear in the auto-generated OpenAPI (Swagger/ReDoc) documentation unless explicitly configured otherwise.*
*   **Path Parameters**:
    *   `short_code` (string, required): The short code part of the shortened URL.
*   **Success Response**:
    *   **Status Code**: `307 TEMPORARY REDIRECT`
    *   **Headers**: `Location: <original_url>`
    *   **Body**: None (the browser handles the redirect).
*   **Error Responses**:
    *   `404 NOT_FOUND`: If the `short_code` does not exist in the database.
        ```json
        { "detail": "URL not found" }
        ```

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is enabled to allow requests from specific origins.
*   **Allowed Origins**:
    *   `http://127.0.0.1:5173`
    *   `http://localhost:5173`
    *   `http://localhost:8000`
    *   `http://localhost:3000`
*   **Allow Credentials**: `True` (cookies can be included in requests)
*   **Allowed Methods**: `POST`, `GET`, `DELETE`
*   **Allowed Headers**: `*` (all headers)

## Database

*   The API uses SQLite as its database. A file named `urls.db` will be automatically created in the same directory as `main.py` when the application starts.
*   The database schema is defined in `models.py` using SQLAlchemy ORM.
*   The table `urls` stores the mappings with columns: `id` (PK), `original_url` (indexed, unique), `short_url` (indexed, unique).

## Short Code Generation

*   A unique short code is generated for each new URL.
*   **Default Length**: `6` characters.
*   **Characters Used**: Alphanumeric (lowercase letters, uppercase letters, digits).
*   **Uniqueness**: The system checks the database to ensure the generated code is unique.
*   **Retries**: It will attempt to generate a unique code up to `10` times. If it fails after these retries (highly unlikely with a reasonable length and character set), a `500 INTERNAL_SERVER_ERROR` is raised.