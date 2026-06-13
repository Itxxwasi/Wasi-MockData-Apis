# 🚀 WASI DEV MOCK API — Premium Multi-Protocol Mock Sandbox

```text
 __      __   _    ___ ___   ___  _______   __  __  ___   ___ _  _     _   ___ ___   _   _ _  _ ___  
 \ \    / /  /_\  / __|_ _| |   \| __\ \ / / |  \/  |/ _ \ / __| |/ /  /_\ | _ \_ _| /_\ | | | | _ ) 
  \ \/\/ /  / _ \ \__ \| |  | |) | _| \ V /  | |\/| | (_) | (__| ' <  / _ \|  _/| | / _ \| |_| | _ \ 
   \_/\_/  /_/ \_\|___/___| |___/|___| \_/   |_|  |_|\___/ \___|_|\_\/_/ \_\_| |___/_/ \_\\___/|___/ 
                                                                                                    
```

> **Designed and Developed by Muhammad Waseem (MR WASI / ITXXWASI / WASI DEV)**

MockDev API Hub is a lightning-fast, high-fidelity developer sandbox offering **100+ deterministic, seeded mock endpoints** over both **REST** and **interactive GraphQL**. Zero data drift, zero database overhead, and automatic metadata resolution wrapped in a clean, state-of-the-art developer dashboard.

---

## 🔍 Core SEO Search Specifications & Keywords

- **Developer Profile**: Muhammad Waseem, MR WASI, WASI DEV, ITXXWASI, WASI TECH, WASI SER
- **Focus Targets**: Free Mock APIs, E-Commerce API Sandbox, User Management Simulation, Financial Bank Transactions Engine, REST to GraphQL Bridge, Custom Schema Compiler Workshop.
- **Service Categories**: Users, Finance, E-commerce, Blogging, Web Analytics, System Utilities, Custom JSON schema builders.

---

## ✨ Features Key Overview

*   **⚡ Double Gateway Engine**: Fully supports comprehensive **REST API** routes and a unified **interactive GraphQL Endpoint** (`/api/graphql`) backed by a pre-compiled in-memory database cache to preserve absolute identifier consistency throughout queries.
*   **🛠️ Custom Schema Compiler Workshop**: Craft bespoke tables on the fly, map structural models, change payload row bounds from 5 to 100, and immediately export mock payloads as high-fidelity JSON arrays or clean tabular CSV logs.
*   **⏱️ Client Late-Binding Latency Controls**: Dynamic artificial server response delays ranging from 0ms to 4000ms. Perfect for verifying component skeleton loaders or load metrics.
*   **👤 Robust Authenticator Gateway**: Simulate restricted endpoints. Users can request standard, low-overhead public tokens or generate high-quota `x-api-key` credentials inside the console.

---

## 🛰️ API Endpoint Maps

### Unified GraphQL Core
*   **Path**: `POST /api/graphql`
*   **Resolvers**: Nested schemas matching `User` -> `sessions`/`posts`/`orders`, `Order` -> `customer`, and `Post` -> `comments`.

### Seeded REST Gateways
| Category | Method | Sample Endpoint Path | Details |
| :--- | :--- | :--- | :--- |
| **Users Collection** | `GET` | `/api/v1/users` | Supports filters on `status`, `role`, schema paging, and fuzzy matching. |
| **Finance Engine** | `GET` | `/api/v1/transactions` | Deterministic IBAN numbers, card types, and transaction ledgers. |
| **E-commerce Shelf** | `GET` | `/api/v1/products` | Simulates high-fidelity stock levels, rating metrics, dimensional attributes, and prices. |
| **E-commerce Cart** | `GET` | `/api/v1/orders` | In-depth tracker resolving tracking codes, carriers, nested purchase item lists. |
| **Blogging Feed** | `GET` | `/api/v1/posts` | Generates titles, list blocks, likes counts, tags, and active author IDs. |
| **Analytics Log** | `GET` | `/api/v1/analytics` | High-volume connection metadata tracking devices, latency scales, browsers. |

---

## 🚀 Client Integration Code Examples

### Standard JavaScript / Axios (REST Example)
```javascript
import axios from 'axios';

axios.get('https://example.com/api/v1/users', {
  params: { limit: 10, page: 1, role: 'admin' },
  headers: { 'x-api-key': 'YOUR_MOCKDEV_API_KEY' }
})
.then(response => console.log(response.data));
```

### GraphQL (Apollo Client / Fetch Example)
```javascript
fetch('https://example.com/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_MOCKDEV_API_KEY'
  },
  body: JSON.stringify({
    query: `
      query GetProducts {
        products(limit: 5, category: "Electronics") {
          data {
            id
            title
            price
            brand
          }
        }
      }
    `
  })
})
.then(res => res.json())
.then(result => console.log(result.data));
```

---

## 🏆 Project Authors & Core Teams

- **Lead Architect**: Muhammad Waseem (`ITXXWASI`)
- **Brand / Organization**: WASI DEV, WASI TECH
- **Premium Core Service**: Seeded High-Fidelity API Playground

Designed with absolute precision and elegance for modern microservices prototyping. No credit cards, no login friction, no live server outages. Just perfect mock data.
