# Notification System API Design

## Stage 1

### Overview

This document defines the REST API specification for a campus notification system. The platform allows students to receive important announcements related to placements, academic results, campus events, and other institutional updates.

The API follows RESTful principles, exchanges data in JSON format, and utilizes standard HTTP methods and status codes. Real-time notification delivery is supported through Socket.IO using WebSocket connections.

---

# Notification Resource Structure

```json
{
  "id": "uuid",
  "type": "Placement",
  "title": "Placement Drive",
  "message": "TCS Corporation is hiring.",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:18Z"
}
```

---

# Standard HTTP Headers

### Request Headers

```
Content-Type: application/json
Accept: application/json
```

### Response Headers

```
Content-Type: application/json
```

---

# 1. Retrieve Notifications

### Endpoint

```
GET /api/notifications
```

### Description

Returns the list of notifications associated with the authenticated student.

### Query Parameters

| Parameter | Type    | Required | Description                                                           |
| --------- | ------- | -------- | --------------------------------------------------------------------- |
| page      | Integer | No       | Specifies the page number for pagination                              |
| limit     | Integer | No       | Determines the number of records per page                             |
| type      | String  | No       | Filters notifications by category such as Placement, Event, or Result |

### Example Request

```
GET /api/notifications?page=1&limit=10&type=Placement
```

### Success Response (200 OK)

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 250,
  "notifications": [
    {
      "id": "1",
      "type": "Placement",
      "title": "Placement Drive",
      "message": "Amazon hiring",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:18Z"
    }
  ]
}
```

---

# 2. Retrieve a Single Notification

### Endpoint

```
GET /api/notifications/{id}
```

### Example Request

```
GET /api/notifications/123
```

### Success Response

```json
{
  "success": true,
  "notification": {
    "id": "123",
    "type": "Result",
    "title": "Semester Result",
    "message": "Results published",
    "isRead": false,
    "createdAt": "2026-04-22T17:51:18Z"
  }
}
```

---

# 3. Create a Notification

### Endpoint

```
POST /api/notifications
```

### Request Body

```json
{
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Microsoft is hiring."
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Notification created successfully.",
  "notificationId": "12345"
}
```

---

# 4. Mark a Notification as Read

### Endpoint

```
PATCH /api/notifications/{id}/read
```

### Description

Updates the read status of a specific notification.

### Success Response

```json
{
  "success": true,
  "message": "Notification status updated successfully."
}
```

---

# 5. Mark All Notifications as Read

### Endpoint

```
PATCH /api/notifications/read-all
```

### Success Response

```json
{
  "success": true,
  "message": "All notifications have been marked as read."
}
```

---

# 6. Delete a Notification

### Endpoint

```
DELETE /api/notifications/{id}
```

### Success Response

```json
{
  "success": true,
  "message": "Notification removed successfully."
}
```

---

# HTTP Status Codes

| Status Code | Description                        |
| ----------- | ---------------------------------- |
| 200         | Request completed successfully     |
| 201         | Resource created successfully      |
| 400         | Invalid request data or parameters |
| 404         | Notification resource not found    |
| 500         | Internal server error              |

---

# Error Response Format

```json
{
  "success": false,
  "message": "Notification not found."
}
```

---

# Real-Time Notification Delivery

### Communication Protocol

* Socket.IO (WebSocket)

### Notification Workflow

1. The student authenticates into the application.
2. A WebSocket connection is established between the client and the server.
3. The server maintains an active socket session for the student.
4. An administrator creates a new notification.
5. The notification is stored in the database.
6. The server instantly broadcasts the notification to the intended recipients.
7. Connected students receive the notification in real time without refreshing the application.

### Event Name

```
new-notification
```

### Event Payload

```json
{
  "id": "123",
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Amazon hiring",
  "createdAt": "2026-04-22T17:51:18Z"
}
```

---

# API Summary

| HTTP Method | Endpoint                     | Description                      |
| ----------- | ---------------------------- | -------------------------------- |
| GET         | /api/notifications           | Retrieve all notifications       |
| GET         | /api/notifications/{id}      | Retrieve a specific notification |
| POST        | /api/notifications           | Create a new notification        |
| PATCH       | /api/notifications/{id}/read | Mark a notification as read      |
| PATCH       | /api/notifications/read-all  | Mark all notifications as read   |
| DELETE      | /api/notifications/{id}      | Delete a notification            |

---

# Design Principles

* Resource URIs use plural nouns to maintain consistency.
* HTTP methods follow RESTful design conventions.
* All request and response bodies use JSON format.
* Each notification is uniquely identified using a UUID.
* Date and time values follow the ISO 8601 standard.
* Response structures remain consistent to simplify client integration and error handling.
* Real-time updates are delivered through Socket.IO for improved user experience.


# Stage 2

# Database Design and Storage Strategy

## Database Selection

For the notification management system, **MongoDB** is selected as the primary database for storing and managing notification records.

### Reasons for Choosing MongoDB

MongoDB is particularly suitable for notification-based applications because it provides:

* A document-oriented data model using BSON (Binary JSON) documents.
* High write performance, which is essential for applications generating notifications frequently.
* Horizontal scalability through sharding, enabling the system to support increasing data volumes.
* Schema flexibility, allowing new attributes to be introduced without restructuring existing documents.
* Easy integration with Node.js applications using the Mongoose Object Data Modeling (ODM) library.

---

# Database Collections

## students Collection

```json
{
  "_id": ObjectId,
  "name": "PEDADA SAI KRISHNA",
  "email": "23pa1a4287@vishnu.edu.in",
  "createdAt": ISODate("2026-04-22T17:51:18Z")
}
```

---

## notifications Collection

```json
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "type": "Placement",
  "title": "Placement Drive",
  "message": "Microsoft is hiring",
  "isRead": false,
  "createdAt": ISODate("2026-04-22T17:51:18Z")
}
```

---

# Relationship Between Collections

A single student may receive multiple notifications during their academic lifecycle.

```
Student
   │
   ├── Notification
   ├── Notification
   └── Notification
```

The relationship between the `students` and `notifications` collections is established using the `studentId` field present in each notification document.

This represents a **one-to-many relationship**, where one student can own multiple notifications.

---

# Indexing Strategy

To improve query efficiency and reduce response times, the following indexes should be created.

```javascript
db.notifications.createIndex({ studentId: 1 })

db.notifications.createIndex({ studentId: 1, isRead: 1 })

db.notifications.createIndex({ type: 1 })

db.notifications.createIndex({ createdAt: -1 })
```

These indexes enable MongoDB to quickly locate relevant documents without performing full collection scans, thereby improving application performance.

---

# Challenges in Large-Scale Data Environments

As the number of notification records increases, several performance challenges may arise:

* Query execution time may increase if indexes are not properly maintained.
* Loading large datasets can lead to higher memory consumption.
* Sorting notifications by creation date requires additional processing overhead.
* Increased collection size may result in higher query latency.

---

# Performance Optimization Techniques

The following strategies help maintain efficient system performance as the application grows:

* Create indexes on frequently queried fields.
* Implement pagination using `skip()` and `limit()` to minimize data retrieval.
* Use field projections to return only necessary attributes.
* Move older notifications into archive collections.
* Apply sharding when notification volume becomes significantly large.
* Utilize Redis caching for frequently accessed notifications to reduce database load.

---

# MongoDB Operations

## Retrieve Notifications

```javascript
db.notifications
.find({ studentId: ObjectId(studentId) })
.sort({ createdAt: -1 })
.skip(0)
.limit(10)
```

This query retrieves a paginated list of notifications for a particular student, ordered from the most recent to the oldest.

---

## Retrieve a Single Notification

```javascript
db.notifications.findOne({
    _id: ObjectId(notificationId)
})
```

This operation fetches a notification document using its unique identifier.

---

## Insert a New Notification

```javascript
db.notifications.insertOne({
    studentId: ObjectId(studentId),
    type: "Placement",
    title: "Placement Drive",
    message: "Microsoft is hiring",
    isRead: false,
    createdAt: new Date()
})
```

This operation creates and stores a new notification document in the database.

---

## Mark a Notification as Read

```javascript
db.notifications.updateOne(
    {
        _id: ObjectId(notificationId)
    },
    {
        $set: {
            isRead: true
        }
    }
)
```

This operation updates the read status of an individual notification.

---

## Mark All Notifications as Read

```javascript
db.notifications.updateMany(
    {
        studentId: ObjectId(studentId)
    },
    {
        $set: {
            isRead: true
        }
    }
)
```

This operation updates all notifications belonging to a particular student and marks them as read.

---

## Delete a Notification

```javascript
db.notifications.deleteOne({
    _id: ObjectId(notificationId)
})
```

This operation removes a notification document from the collection using its unique identifier.

---

# Database Design Principles

* MongoDB collections are designed to support high-volume notification workloads.
* Relationships are maintained using document references.
* Indexes are applied to optimize frequently executed queries.
* Pagination techniques prevent excessive memory usage.
* The schema remains flexible to accommodate future requirements.
* Performance optimization techniques ensure scalability as data volume increases.
* Caching and sharding strategies support long-term system growth.


# Stage 3

# Query Analysis and Performance Evaluation

## Existing Query

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

## Query Evaluation

From a functional standpoint, the query is correct. It retrieves all unread notifications belonging to the student with the ID **1042** and displays them in ascending order based on their creation time.

Although the query produces the expected results, its performance may degrade significantly as the size of the notification table increases.

---

# Performance Considerations

## 1. Retrieving Unnecessary Columns

The use of `SELECT *` instructs the database to fetch every column from the matching records.

In most notification systems, the application only requires a limited number of fields such as the title, message, category, and timestamp. Retrieving unnecessary columns increases:

* Disk I/O operations
* Memory usage
* Network bandwidth consumption
* Query execution time

---

## 2. Missing Indexes

If the filtering columns are not indexed, the database engine must examine every row in the table to identify matching records.

As the number of notifications grows, this full table scan becomes increasingly expensive and results in longer response times.

---

## 3. Sorting Overhead

The query sorts the result set using the `created_at` column.

When the sorting column is not included in an appropriate index, the database must perform an additional sorting operation after filtering the records. This extra processing can negatively affect performance, particularly for large datasets.

---

# Optimized Query

Rather than retrieving every column, it is more efficient to select only the attributes required by the application.

```sql
SELECT
    id,
    title,
    message,
    type,
    created_at
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

This optimized query reduces the amount of data transferred and minimizes resource consumption during execution.

---

# Recommended Index

A composite index that aligns with the filtering and sorting conditions of the query provides the greatest performance benefit.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at);
```

This index enables the database to:

* Locate notifications for a particular student efficiently.
* Filter unread notifications without scanning the entire table.
* Return records in chronological order directly from the index.

Consequently, both search time and sorting overhead are significantly reduced.

---

# Time Complexity Analysis

## Without an Index

When suitable indexes are absent, the database performs a sequential scan of the entire table.

* Search Operation: **O(n)**
* Sorting Operation: **O(n log n)**

As the number of records increases, query execution time grows substantially.

---

## With the Composite Index

Using the recommended composite index allows the database engine to access only the required records.

* Index Lookup: **O(log n)**
* Record Retrieval: proportional to the number of matching records

Since the index already maintains the required ordering, the database often avoids performing an additional sorting operation.

---

# Should Every Column Be Indexed?

No.

Although indexes improve query performance, creating indexes on every column is generally considered poor database design.

Excessive indexing introduces several drawbacks:

* Additional storage space is required for each index.
* INSERT, UPDATE, and DELETE operations become slower because all indexes must be maintained.
* Many indexes may remain unused by the query optimizer.
* Database maintenance, backups, and recovery operations become more expensive.

A better approach is to create indexes only on columns that are frequently used in filtering, sorting, joining, or searching operations.

---

# SQL Query Example

Retrieve the IDs of students who received **Placement** notifications during the previous seven days.

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL 7 DAY;
```

This query identifies unique students who received placement-related notifications within the last week.

---

# Recommended Index for the Above Query

The following composite index improves the execution efficiency of the query.

```sql
CREATE INDEX idx_notifications_type_created
ON notifications(type, created_at);
```

This index allows the database to:

* Quickly locate notifications belonging to the **Placement** category.
* Restrict the search to recently created records.
* Reduce the number of rows examined during execution.

---

# Summary

* The original query is functionally correct but may not scale efficiently.
* Selecting only the required columns reduces resource consumption.
* Composite indexes significantly improve filtering and sorting performance.
* Proper indexing minimizes full table scans and unnecessary sorting.
* Excessive indexing should be avoided due to its impact on storage and write operations.
* Query optimization and index design are essential for maintaining performance as the notification database grows.


# Stage 4

# Performance Optimization and Real-Time Communication

## Performance Enhancement Strategy

As the notification platform grows to support a larger user base and increasing notification traffic, relying exclusively on the database for every request may lead to increased response times and higher server load.

To improve performance and provide real-time communication capabilities, the system incorporates **Redis** as a caching layer and **Socket.IO** for instant notification delivery.

---

# Importance of Caching

Caching plays a critical role in improving application performance by storing frequently accessed data in memory.

Instead of executing identical database queries repeatedly, the application can retrieve data directly from the cache, resulting in faster response times and reduced database workload.

Redis is particularly suitable for this purpose because it is an in-memory key-value store designed for high-speed read and write operations with extremely low latency.

---

# Notification Retrieval Workflow

The notification retrieval process follows a cache-first approach.

### Process Flow

1. A user requests their notification list.
2. The application checks Redis for the requested data.
3. If the data exists in Redis (**Cache Hit**), the cached notifications are returned immediately.
4. If the data is unavailable (**Cache Miss**), the application retrieves the notifications from the MySQL database.
5. The retrieved data is stored in Redis before being returned to the client.

This approach reduces the number of database queries and significantly improves application response time.

---

# Cache Consistency Management

Maintaining consistency between the cache and the database is essential to ensure that users receive accurate information.

Whenever a notification is created, updated, marked as read, or deleted, the corresponding cache entries must be updated or invalidated.

### Cache Invalidation Strategy

1. Apply the required changes to the MySQL database.
2. Remove the affected user's cached notification data from Redis.
3. During the next request, retrieve the updated data from MySQL.
4. Store the latest data in Redis for future requests.

This strategy ensures that cached data remains synchronized with the primary database.

---

# Real-Time Notification Delivery

To provide immediate updates without requiring users to refresh the application, the system integrates **Socket.IO**, which enables bidirectional communication through WebSocket connections.

### Notification Delivery Workflow

1. The user authenticates and signs in to the application.
2. The client establishes a persistent Socket.IO connection with the server.
3. When a new notification is generated, it is first stored in MySQL.
4. Any existing Redis cache associated with the user is invalidated.
5. The server emits a `new-notification` event through Socket.IO.
6. Connected clients receive the notification instantly and update the user interface in real time.

This mechanism ensures that notifications are delivered immediately after they are generated.

---

# Roles of Redis and Socket.IO

Although Redis and Socket.IO are frequently used together, they address different aspects of the system.

### Redis

* Reduces database access by caching frequently requested data.
* Improves response times for repeated requests.
* Decreases database workload during periods of heavy traffic.

### Socket.IO

* Maintains persistent communication between the server and clients.
* Enables real-time data transmission.
* Delivers notifications instantly without requiring page refreshes.

---

# Benefits of the Combined Approach

Integrating Redis and Socket.IO provides several advantages for the notification platform:

* Reduced response latency
* Lower database workload
* Improved scalability under high traffic conditions
* Faster notification delivery
* Real-time updates without manual refresh
* Better application responsiveness
* Enhanced user experience

---

# Performance Architecture Summary

* Redis acts as an in-memory caching layer to accelerate data retrieval.
* Socket.IO enables real-time communication between the server and clients.
* Cache invalidation ensures data consistency between Redis and MySQL.
* Database load is reduced by serving frequently accessed data from memory.
* Instant notification delivery improves user engagement and system responsiveness.
* The combined architecture supports scalability as the notification platform grows.


# Stage 5

# Asynchronous Notification Processing

## Message Queue Integration

As the notification platform grows in scale and usage, directly processing notification delivery within the API layer may increase response times and reduce system reliability.

To improve scalability, fault tolerance, and overall system performance, a message broker such as **RabbitMQ** can be introduced between the Notification API and the notification delivery service.

Instead of delivering notifications immediately after an API request, the application first stores the notification in the database and then publishes a message to RabbitMQ. Background worker processes consume messages from the queue and perform notification delivery independently.

This asynchronous architecture prevents the API from waiting for the delivery process to complete.

---

# Notification Processing Workflow

The notification lifecycle consists of the following steps:

1. The notification is stored in the MySQL database.
2. A notification message is published to RabbitMQ.
3. A background worker retrieves the message from the queue.
4. The worker delivers the notification to the intended user through Socket.IO.
5. If delivery fails, the worker retries the operation according to a predefined retry policy.
6. Messages that continue to fail are transferred to a **Dead Letter Queue (DLQ)** for further analysis or manual intervention.

By separating message delivery from the API layer, client requests can be completed quickly without waiting for notification transmission.

---

# Retry and Failure Handling

Reliable message delivery is essential for notification systems.

When a delivery attempt fails because of temporary issues such as network interruptions or unavailable services, the worker retries the operation automatically.

If the message continues to fail after the configured retry attempts, it is moved to the Dead Letter Queue.

The Dead Letter Queue provides several benefits:

* Prevents failed messages from being lost.
* Isolates problematic notifications.
* Enables debugging and monitoring.
* Allows manual processing or resubmission of failed messages.

---

# Advantages of Message Queues

Introducing RabbitMQ into the architecture provides several important benefits:

* API requests complete quickly because notification delivery occurs asynchronously.
* Worker services can be scaled independently based on traffic volume.
* Retry mechanisms improve message delivery reliability.
* Failed notifications are preserved in the Dead Letter Queue.
* Traffic spikes can be absorbed by the queue without overloading the application.
* The system becomes more resilient and fault tolerant.

---

# System Architecture

```id="fhmwyb"
Client
   │
   ▼
Notification API
   │
   ▼
MySQL Database
   │
   ▼
RabbitMQ Exchange / Queue
   │
   ▼
Background Worker
   │
   ▼
Socket.IO Server
   │
   ▼
Connected Users
```

---

# Component Responsibilities

### Notification API

* Receives client requests.
* Stores notifications in the database.
* Publishes messages to RabbitMQ.

### MySQL Database

* Maintains persistent notification records.
* Acts as the primary data source.

### RabbitMQ

* Queues notification messages.
* Buffers sudden increases in traffic.
* Ensures reliable message delivery.

### Background Workers

* Consume messages from the queue.
* Process notification delivery.
* Handle retries and failure scenarios.

### Socket.IO Server

* Maintains active client connections.
* Delivers notifications in real time.

---

# Architectural Benefits

The asynchronous processing model provides several long-term advantages:

* Improved API responsiveness
* Better scalability
* Higher fault tolerance
* Reliable notification delivery
* Reduced server workload
* Efficient handling of traffic spikes
* Simplified system maintenance

---

# Architecture Summary

* RabbitMQ decouples notification delivery from the API layer.
* Background workers process messages asynchronously.
* Retry mechanisms improve delivery success rates.
* Dead Letter Queues handle failed messages safely.
* Socket.IO delivers notifications instantly to connected users.
* The architecture supports high traffic volumes and future system growth.
