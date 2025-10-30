# 🚀 Frovo Admin UI

A modern, scalable admin dashboard built with **Next.js 14**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. Features a well-organized architecture with authentication, state management, and reusable components.

## ✨ Features

- 🔐 **Complete Authentication System** (Login/Register/Logout)
- 🛡️ **Route Protection** with AuthGuard and GuestGuard
- 📦 **Redux Toolkit** for state management
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design**
- 🔧 **TypeScript** for type safety
- 🧩 **Modular Component Architecture**
- 🚦 **Form Validation** with Yup
- 🌐 **Axios** for API calls with interceptors
- 🎯 **Custom Hooks** for reusable logic
- 📁 **Organized Project Structure**

## 🏗️ Project Structure

```
src/
├── types/               # TypeScript interfaces & types
│   ├── auth.types.ts
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
├── config/             # Configuration files
│   ├── environment.ts   # Environment-specific configs
│   ├── api.config.ts   # API endpoints & settings
│   ├── app.config.ts   # App constants & features
│   └── index.ts
├── utils/              # Utility functions
│   ├── storage.utils.ts    # localStorage helpers
│   ├── validation.utils.ts # Form validation helpers
│   ├── auth.utils.ts      # JWT token utilities
│   ├── constants.ts       # App constants
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.ts         # Authentication logic
│   ├── useLocalStorage.ts # Storage management
│   ├── useForm.ts         # Form state management
│   ├── useApi.ts          # API call helpers
│   └── index.ts
├── store/              # Redux state management
│   ├── middleware/
│   │   ├── authMiddleware.ts  # Auth token persistence
│   │   ├── apiMiddleware.ts   # API error handling
│   │   └── index.ts
│   ├── slices/
│   │   └── authSlice.ts       # Authentication state
│   ├── hooks.ts               # Typed Redux hooks
│   └── index.ts
├── validation/         # Form validation schemas
│   ├── authSchemas.ts     # Login/Register validation
│   ├── errorMessages.ts   # Centralized error messages
│   └── index.ts
├── components/         # React components
│   ├── common/            # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── LoadingSpinner/
│   │   └── index.ts
│   ├── layout/            # Layout components
│   │   ├── Header/
│   │   └── index.ts
│   ├── forms/             # Form components
│   │   ├── AuthForm/
│   │   └── index.ts
│   ├── guards/            # Route protection
│   │   ├── AuthGuard.tsx
│   │   ├── GuestGuard.tsx
│   │   └── index.ts
│   └── index.ts
├── services/           # API services
│   ├── api.ts             # Axios configuration
│   └── authAPI.ts         # Authentication API calls
├── providers/          # React context providers
│   └── StoreProvider.tsx  # Redux store provider
└── app/               # Next.js app router pages
    ├── login/
    ├── register/
    ├── dashboard/
    └── page.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frovo_admin_ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your API configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔄 Complete API Flow

### 📤 POST Request Flow (Login Example)

```typescript
// 1. 🎯 User Action - Form Submission
// src/app/login/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await login({ email, password }); // Call useAuth hook
};

// 2. 🎣 Custom Hook - Business Logic
// src/hooks/useAuth.ts
const login = async (credentials: LoginCredentials) => {
  try {
    const result = await dispatch(loginUser(credentials)); // Dispatch Redux action
    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard'); // Navigate on success
    }
  } catch {
    // Handle errors
  }
};

// 3. 🏪 Redux Async Thunk - State Management
// src/store/slices/authSlice.ts
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials); // Call API service
      return response.data; // Return success data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
        : 'Login failed';
      return rejectWithValue(errorMessage); // Return error
    }
  }
);

// 4. 🌐 API Service Layer - HTTP Calls
// src/services/authAPI.ts
export const authAPI = {
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>(apiConfig.endpoints.auth.login, credentials);
    // Uses configured Axios instance
  }
};

// 5. ⚙️ Axios Instance - HTTP Configuration
// src/services/api.ts
export const api = axios.create({
  baseURL: apiConfig.baseURL,     // http://localhost:3001/api
  timeout: apiConfig.timeout,     // 10000ms
  headers: apiConfig.headers,     // Content-Type: application/json
});

// 6. 🔒 Request Interceptor - Auto Token Attachment
api.interceptors.request.use((config) => {
  const token = storageUtils.getToken(); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add to headers
  }
  return config;
});

// 7. 🛡️ Response Interceptor - Error Handling
api.interceptors.response.use(
  (response) => response, // Pass through success
  (error) => {
    if (error.response?.status === 401) {
      storageUtils.removeToken(); // Clear invalid token
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// 8. 🎛️ Redux Middleware - Side Effects
// src/store/middleware/authMiddleware.ts
authMiddleware.startListening({
  actionCreator: loginUser.fulfilled, // Listen for success
  effect: (action) => {
    const { user, token } = action.payload;
    storageUtils.setToken(token);  // Save token to localStorage
    storageUtils.setUser(user);    // Save user data
  },
});

// 9. 🔄 State Update & UI Response
// Redux updates auth state → Component re-renders → Redirect to dashboard
```

### 📥 GET Request Flow (Fetch Data Example)

```typescript
// 1. 🎯 Component Initialization
// src/app/dashboard/page.tsx
const DashboardPage = () => {
  const { data, isLoading, error, execute } = useApi<Post[]>();
  
  useEffect(() => {
    fetchPosts(); // Trigger data fetch
  }, []);

  const fetchPosts = async () => {
    await execute({
      method: 'GET',
      url: apiConfig.endpoints.posts.list
    });
  };
};

// 2. 🎣 Custom API Hook
// src/hooks/useApi.ts
export const useApi = <T = unknown>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = async (config: RequestConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.request(config); // Make HTTP request
      const data = response.data;
      setState({ data, error: null, isLoading: false });
      return { data, error: null };
    } catch (error: unknown) {
      const errorMessage = /* format error */;
      setState({ data: null, error: errorMessage, isLoading: false });
      return { data: null, error: errorMessage };
    }
  };
};

// 3. 🌐 Direct API Call (No Redux for simple GET)
// Uses same Axios instance with interceptors
// Token automatically attached by request interceptor
// Error handling by response interceptor
```

### 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] 🎯 UI Component                                           │
│      ↓ (Form Submit / useEffect)                               │
│                                                                 │
│  [2] 🎣 Custom Hook (useAuth / useApi)                         │
│      ↓ (Business Logic)                                        │
│                                                                 │
│  [3] 🏪 Redux Thunk (Optional - for state management)         │
│      ↓ (Async Action)                                          │
│                                                                 │
│  [4] 🌐 API Service (authAPI / userAPI)                       │
│      ↓ (HTTP Method Call)                                      │
│                                                                 │
│  [5] ⚙️ Axios Instance                                         │
│      ↓ (Request Interceptor → Add Token)                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        NETWORK                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [6] 🌍 HTTP REQUEST → Backend API                            │
│                                                                 │
│  [7] 🌍 HTTP RESPONSE ← Backend API                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      RESPONSE FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [8] ⚙️ Axios Response Interceptor                            │
│      ↓ (Error Handling / Success Processing)                   │
│                                                                 │
│  [9] 🎛️ Redux Middleware (If using Redux)                     │
│      ↓ (Side Effects - Save to localStorage)                   │
│                                                                 │
│  [10] 🏪 Redux State Update (If using Redux)                  │
│       ↓ (Update Global State)                                  │
│                                                                 │
│  [11] 🎣 Hook State Update                                     │
│       ↓ (Update Local State)                                   │
│                                                                 │
│  [12] 🎯 UI Re-render                                         │
│       ↓ (Show Data / Loading / Error)                          │
│                                                                 │
│  [13] 🔄 Navigation (If needed)                               │
│       (Redirect / Route Change)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 🔐 Authentication-Specific Flow

```
┌─── LOGIN REQUEST ────────────────────────────────────────────┐
│                                                              │
│  User submits credentials                                    │
│  ↓                                                           │
│  useAuth.login() → loginUser thunk → authAPI.login()       │
│  ↓                                                           │
│  Axios adds headers → POST /auth/login → Backend           │
│  ↓                                                           │
│  Success response { user, token }                           │
│  ↓                                                           │
│  Redux middleware saves token to localStorage               │
│  ↓                                                           │
│  Redux state updated with user & auth status               │
│  ↓                                                           │
│  Component re-renders → Redirect to dashboard              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─── AUTHENTICATED REQUEST ───────────────────────────────────┐
│                                                              │
│  Component needs protected data                             │
│  ↓                                                           │
│  useApi.execute() → api.get('/protected-endpoint')         │
│  ↓                                                           │
│  Request interceptor adds: Authorization: Bearer ${token}   │
│  ↓                                                           │
│  GET request to backend with token                         │
│  ↓                                                           │
│  Backend validates token → Returns data                    │
│  ↓                                                           │
│  Response interceptor processes success                     │
│  ↓                                                           │
│  Hook updates state → Component shows data                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─── TOKEN EXPIRY HANDLING ───────────────────────────────────┐
│                                                              │
│  Authenticated request made                                 │
│  ↓                                                           │
│  Backend returns 401 Unauthorized                          │
│  ↓                                                           │
│  Response interceptor catches 401                          │
│  ↓                                                           │
│  Clear token from localStorage                             │
│  ↓                                                           │
│  Redirect to login page                                    │
│  ↓                                                           │
│  User must login again                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 🛠️ Implementation Layers

| Layer | Purpose | Files | Responsibility |
|-------|---------|-------|----------------|
| **🎯 UI Layer** | User Interface | `app/*/page.tsx` | Form handling, display logic |
| **🎣 Hook Layer** | Business Logic | `hooks/use*.ts` | State management, side effects |
| **🏪 Redux Layer** | Global State | `store/slices/*.ts` | App-wide state, async actions |
| **🌐 Service Layer** | API Calls | `services/*API.ts` | HTTP method definitions |
| **⚙️ HTTP Layer** | Network | `services/api.ts` | Request/response handling |
| **🎛️ Middleware** | Side Effects | `store/middleware/*.ts` | Cross-cutting concerns |

### 🔄 Error Handling Flow

```
API Error Occurs
↓
Response Interceptor Catches Error
↓
┌─ 401 Unauthorized → Clear auth → Redirect login
├─ 403 Forbidden → Show access denied message  
├─ 404 Not Found → Show not found message
├─ 500 Server Error → Show server error message
└─ Network Error → Show connection error
↓
Error propagated to Hook/Redux
↓
Component shows error UI
```

## 🛠️ API Integration

### Adding New API Endpoints

1. **Add endpoint to config**
   ```typescript
   // src/config/api.config.ts
   endpoints: {
     posts: {
       list: '/posts',
       create: '/posts',
       update: '/posts/:id'
     }
   }
   ```

2. **Create API service**
   ```typescript
   // src/services/postAPI.ts
   export const postAPI = {
     list: () => api.get<Post[]>(apiConfig.endpoints.posts.list),
     create: (data: CreatePostData) => api.post<Post>(apiConfig.endpoints.posts.create, data)
   };
   ```

3. **Use in components**
   ```typescript
   const { data, isLoading, error, execute } = useApi<Post[]>();
   
   useEffect(() => {
     execute({
       method: 'GET',
       url: apiConfig.endpoints.posts.list
     });
   }, []);
   ```

## 🧪 Form Validation

Forms use **Yup** schemas for validation:

```typescript
// src/validation/authSchemas.ts
export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(8)
});
```

## 🎨 Component Usage

### Button Component
```typescript
import { Button } from '@/components';

<Button 
  variant="primary" 
  size="md" 
  isLoading={isSubmitting}
  onClick={handleClick}
>
  Submit
</Button>
```

### Input Component
```typescript
import { Input } from '@/components';

<Input
  label="Email"
  type="email"
  value={email}
  error={errors.email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Route Guards
```typescript
import { AuthGuard } from '@/components';

// Protect authenticated routes
<AuthGuard>
  <DashboardContent />
</AuthGuard>

// Protect guest routes
<GuestGuard>
  <LoginForm />
</GuestGuard>
```

## 🔧 Custom Hooks

### useAuth Hook
```typescript
const { 
  user, 
  isLoading, 
  error, 
  isAuthenticated, 
  login, 
  register, 
  logout 
} = useAuth();
```

### useApi Hook
```typescript
const { data, isLoading, error, execute } = useApi<ResponseType>();
```

### useForm Hook
```typescript
const { 
  formState, 
  handleSubmit, 
  getFieldProps,
  errors 
} = useForm({
  initialValues: { email: '', password: '' },
  validationRules: validationSchema,
  onSubmit: handleFormSubmit
});
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_VERSION` | App version | `1.0.0` |
| `NODE_ENV` | Environment | `development` |

## 🏛️ Architecture Principles

- **Separation of Concerns**: Clear separation between UI, business logic, and data
- **Type Safety**: Full TypeScript coverage for better developer experience
- **Reusability**: Modular components and hooks for code reuse
- **Scalability**: Organized structure that grows with your application
- **Maintainability**: Clear patterns and conventions for easy maintenance
- **Performance**: Optimized builds and lazy loading where appropriate

## 🔐 Security Features

- **JWT Token Management**: Secure token storage and automatic refresh
- **Route Protection**: Guards prevent unauthorized access
- **Input Sanitization**: XSS protection on form inputs
- **API Error Handling**: Centralized error management
- **Auto Logout**: Automatic logout on token expiration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- **ESLint**: Enforced code style and best practices
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (configure as needed)
- **Conventional Commits**: Follow conventional commit messages

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Run `npm run lint` to check for code issues
2. **API Connection**: Verify `NEXT_PUBLIC_API_URL` in environment variables
3. **Authentication Issues**: Check browser localStorage for token storage
4. **TypeScript Errors**: Run `npx tsc --noEmit` for detailed type checking

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Form Validation**: Yup
- **UI Components**: Custom component library
- **Authentication**: JWT tokens
- **Development**: ESLint, TypeScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Redux Toolkit for simplified state management
- Tailwind CSS for utility-first CSS
- All open-source contributors

---

**Built with ❤️ for modern web development**