# Supabase + Vue — How It Works

## What is Supabase?

Supabase is a backend-as-a-service platform. It gives you a hosted PostgreSQL database plus a JavaScript client library that lets your frontend talk directly to that database — no custom server required. Think of it as a database you can query straight from your Vue app.

---

## The Three-File Setup

### 1. `.env.local` — Credentials
Find these on supabase site, click connect
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

These two values identify your Supabase project and prove you're allowed to talk to it. They live in `.env.local` so they aren't hard-coded in your source files. Vite (the build tool) automatically loads any file named `.env.local` and makes its values available in your code as `import.meta.env.VARIABLE_NAME`.

The `VITE_` prefix is required — Vite only exposes environment variables that start with `VITE_` to the browser for security.

The publishable key is safe to expose in the browser. It is NOT a secret admin key — it only grants access that Supabase's Row Level Security (RLS) rules allow.

---

### 2. `src/supabase.js` — The Client

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

`createClient` connects to your Supabase project and returns a client object. You export that single `supabase` object so any Vue component can import and use it — like a shared database connection for the whole app.

---

### 3. `src/App.vue` — The Query

```js
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const transactions = ref([])
const error = ref(null)

onMounted(async () => {
  let { data: transactionData, error: err } = await supabase
    .from('transactions')
    .select('*')
  if (err) {
    error.value = err.message
  } else {
    transactions.value = transactionData
  }
})
```

**Breaking down the query line by line:**

| Code | What it does |
|---|---|
| `supabase.from('transactions')` | Targets the `transactions` table in your database |
| `.select('*')` | Selects all columns (equivalent to `SELECT * FROM transactions` in SQL) |
| `await` | Waits for the network request to complete before moving on |
| `{ data: transactionData, error: err }` | Destructures the response — Supabase always returns an object with a `data` field and an `error` field |

**Why `onMounted`?**
`onMounted` runs after the component appears on the page. This is the right place to fetch data — the component is ready to display it, and you're not blocking the initial render.

**Why `ref([])`?**
`ref` makes the variable reactive. When `transactions.value` gets updated with real data, Vue automatically re-renders the template to show it. Without `ref`, Vue wouldn't know the data changed.

---

## The Template

```html
<ul v-else>
  <li v-for="transaction in transactions" :key="transaction.id">
    ID: {{ transaction.id }} | User: {{ transaction.user_id }} | ...
  </li>
</ul>
```

`v-for` loops over the `transactions` array and creates one `<li>` per row from the database. `:key="transaction.id"` gives Vue a unique identifier for each item so it can efficiently update the list if data changes.

`v-if="error"` / `v-else` — if the query failed, show the error message; otherwise show the list.

---

## The Full Data Flow

```
.env.local
   └── credentials
          │
          ▼
    supabase.js
   createClient()
          │
          ▼
      App.vue
   onMounted → supabase.from().select()
          │
          ▼
   Supabase cloud DB
   (PostgreSQL query runs)
          │
          ▼
   data returned as JS array
          │
          ▼
   transactions.value = data
          │
          ▼
   Vue re-renders → list appears
```

---

## Key Things to Remember

- **Never use the secret service-role key** in a Vue app. Only use the publishable key. The service-role key bypasses all security rules.
- **`.env.local` is gitignored** — it won't be committed to GitHub, keeping your keys out of public repos.
- Supabase's query builder mirrors SQL: `.from()` = `FROM`, `.select()` = `SELECT`, `.eq('column', value)` = `WHERE column = value`.
- You can filter, sort, and limit results: `.select('*').eq('status', 'paid').order('created_at').limit(10)`