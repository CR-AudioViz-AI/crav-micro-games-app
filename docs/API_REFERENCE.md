# CRAudioVizAI Games Pack - API Reference

This document provides comprehensive information about the API endpoints available in the CRAudioVizAI Games Pack.

## 🔗 Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## 🔐 Authentication

Most endpoints are public, but some require user identification for personalized features.

### Headers
```http
Content-Type: application/json
Authorization: Bearer <token> (when required)
```

## 🎮 Games API

### Get Games List

Retrieve all available games with their metadata and access levels.

```http
GET /api/games/list?userId={userId}
```

**Parameters:**
- `userId` (optional): User ID for personalized access levels

**Response:**
```json
{
  "success": true,
  "games": [
    {
      "id": "1",
      "slug": "emoji-charades",
      "name": "Emoji Charades",
      "flag": "EMOJI_CHARADES",
      "status": "active",
      "category": "puzzle",
      "difficulty": "easy",
      "description": "Guess the phrase from emoji clues!",
      "isPremium": false,
      "isEnabled": true,
      "accessLevel": "free"
    }
  ],
  "correlationId": "corr_123456789"
}
```

### Get Game of the Month

Retrieve the current Game of the Month configuration.

```http
GET /api/games/motm
```

**Response:**
```json
{
  "success": true,
  "motm": {
    "gameSlug": "emoji-charades",
    "title": "Game of the Month: Emoji Charades",
    "description": "Test your emoji interpretation skills!",
    "imageUrl": "https://example.com/image.jpg",
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "isActive": true,
    "daysRemaining": 15
  },
  "correlationId": "corr_123456789"
}
```

### Submit Score

Save a player's score for a specific game.

```http
POST /api/games/score
```

**Request Body:**
```json
{
  "gameId": "emoji-charades",
  "score": 1250,
  "userId": "user123",
  "name": "Player Name"
}
```

**Response:**
```json
{
  "success": true,
  "score": {
    "id": "score_123456789",
    "gameId": "emoji-charades",
    "score": 1250,
    "userId": "user123",
    "name": "Player Name",
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "correlationId": "corr_123456789"
}
```

### Get Leaderboard

Retrieve leaderboard data for a specific game.

```http
GET /api/games/leaderboard?gameId={gameId}&scope={scope}&limit={limit}
```

**Parameters:**
- `gameId` (required): Game identifier
- `scope` (optional): "local" or "global" (default: "local")
- `limit` (optional): Number of results (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "scores": [
    {
      "id": "1",
      "gameId": "emoji-charades",
      "userId": "user1",
      "name": "Alex",
      "score": 1250,
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "scope": "local",
  "correlationId": "corr_123456789"
}
```

## 💰 Payments API

### Create Checkout Session

Initialize a payment checkout session.

```http
POST /api/payments/checkout
```

**Request Body:**
```json
{
  "productId": "pro_upgrade",
  "plan": "PRO",
  "provider": "stripe",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/pay/...",
  "product": {
    "id": "pro_upgrade",
    "name": "Pro Upgrade",
    "price": 9.99,
    "currency": "USD"
  },
  "provider": "stripe",
  "correlationId": "corr_123456789"
}
```

### Stripe Webhook

Handle Stripe payment webhooks (internal use).

```http
POST /api/webhooks/stripe
```

**Request Body:** Stripe webhook payload

**Response:**
```json
{
  "success": true,
  "received": true,
  "correlationId": "corr_123456789"
}
```

### PayPal Webhook

Handle PayPal payment webhooks (internal use).

```http
POST /api/webhooks/paypal
```

**Request Body:** PayPal webhook payload

**Response:**
```json
{
  "success": true,
  "received": true,
  "correlationId": "corr_123456789"
}
```

## 🎫 Entitlements API

### Get User Entitlements

Retrieve a user's current entitlements and plan.

```http
GET /api/entitlements?userId={userId}
```

**Parameters:**
- `userId` (required): User identifier

**Response:**
```json
{
  "success": true,
  "userId": "user123",
  "plan": "PRO",
  "entitlements": [
    "PRO",
    "GLOBAL_LEADERBOARDS",
    "PREMIUM_MODES"
  ],
  "correlationId": "corr_123456789"
}
```

## 🏥 Health Check

### System Health

Check if the API is operational.

```http
GET /api/healthz
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 📊 Error Handling

All API endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": "Error message description",
  "correlationId": "corr_123456789"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Common Error Messages

- `"Missing required field: gameId"` - Required parameter not provided
- `"Product not found"` - Invalid product ID in checkout request
- `"Game not found"` - Invalid game ID in score submission
- `"Insufficient permissions"` - User lacks required entitlements

## 🔄 Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Games API**: 100 requests per minute per IP
- **Payments API**: 10 requests per minute per user
- **Webhooks**: No limit (authenticated)

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

## 📝 Request/Response Examples

### Complete Game Session Flow

1. **Start Game Session:**
```bash
curl -X GET "https://api.example.com/api/games/list?userId=user123"
```

2. **Submit Score:**
```bash
curl -X POST "https://api.example.com/api/games/score" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "emoji-charades",
    "score": 1250,
    "userId": "user123",
    "name": "Player"
  }'
```

3. **Check Leaderboard:**
```bash
curl -X GET "https://api.example.com/api/games/leaderboard?gameId=emoji-charades&scope=global"
```

### Payment Flow

1. **Create Checkout:**
```bash
curl -X POST "https://api.example.com/api/payments/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "pro_upgrade",
    "plan": "PRO",
    "provider": "stripe",
    "userId": "user123"
  }'
```

2. **Check Entitlements (after payment):**
```bash
curl -X GET "https://api.example.com/api/entitlements?userId=user123"
```

## 🔧 SDK Examples

### JavaScript/TypeScript

```typescript
class GamesAPI {
  constructor(private baseUrl: string) {}

  async getGames(userId?: string) {
    const url = new URL(`${this.baseUrl}/games/list`);
    if (userId) url.searchParams.set('userId', userId);
    
    const response = await fetch(url.toString());
    return response.json();
  }

  async submitScore(gameId: string, score: number, userId?: string, name?: string) {
    const response = await fetch(`${this.baseUrl}/games/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, score, userId, name })
    });
    return response.json();
  }

  async getLeaderboard(gameId: string, scope = 'local', limit = 10) {
    const url = new URL(`${this.baseUrl}/games/leaderboard`);
    url.searchParams.set('gameId', gameId);
    url.searchParams.set('scope', scope);
    url.searchParams.set('limit', limit.toString());
    
    const response = await fetch(url.toString());
    return response.json();
  }
}

// Usage
const api = new GamesAPI('https://api.example.com/api');
const games = await api.getGames('user123');
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class GamesAPI:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def get_games(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        params = {'userId': user_id} if user_id else {}
        response = requests.get(f"{self.base_url}/games/list", params=params)
        return response.json()

    def submit_score(self, game_id: str, score: int, user_id: Optional[str] = None, name: Optional[str] = None) -> Dict[str, Any]:
        data = {
            'gameId': game_id,
            'score': score,
            'userId': user_id,
            'name': name
        }
        response = requests.post(f"{self.base_url}/games/score", json=data)
        return response.json()

# Usage
api = GamesAPI('https://api.example.com/api')
games = api.get_games('user123')
```

## 📚 Additional Resources

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI Spec**: Available at `/api/docs` (when enabled)
- **Rate Limiting**: See `/docs/RATE_LIMITS.md`
- **Webhooks Guide**: See `/docs/WEBHOOKS.md`

---

*Last updated: January 2025*
*API Version: 1.0.0*