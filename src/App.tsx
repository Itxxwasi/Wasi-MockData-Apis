/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Database,
  Server,
  Code,
  Layers,
  ChevronRight,
  Play,
  Copy,
  Check,
  Search,
  Key,
  Shield,
  Activity,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  ExternalLink,
  Github,
  Sun,
  Moon,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS } from './endpoints';
import { EndpointInfo } from './types';

export default function App() {
  // Theme Toggle State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Active Category Sidebar State
  const [activeCategory, setActiveCategory] = useState<string>('Users');

  // Search filter for endpoints
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected active endpoint for Playground & documentation
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo>(
    API_ENDPOINTS.find((e) => e.category === 'Users') || API_ENDPOINTS[0]
  );

  // Playground Inputs state
  // key: "endpointId_paramName"
  const [playgroundInputs, setPlaygroundInputs] = useState<Record<string, string>>({});
  const [delaySlider, setDelaySlider] = useState<number>(0);
  
  // Real-time API testing response state
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [copiedEndpoints, setCopiedEndpoints] = useState<Record<string, boolean>>({});

  // Code generation Language Tabs: 'js' | 'node' | 'ts' | 'python'
  const [codeLang, setCodeLang] = useState<'js' | 'node' | 'ts' | 'python'>('js');

  // Custom Schema Builder Workspace fields
  const [schemaFields, setSchemaFields] = useState<Array<{ name: string; type: string }>>([
    { name: 'id', type: 'id' },
    { name: 'name', type: 'fullName' },
    { name: 'email', type: 'email' },
    { name: 'amountSpent', type: 'amount' },
    { name: 'joinedAt', type: 'date' }
  ]);
  const [schemaRecordCount, setSchemaRecordCount] = useState<number>(10);
  const [schemaResult, setSchemaResult] = useState<any>(null);
  const [schemaLoading, setSchemaLoading] = useState<boolean>(false);
  const [customSchemaCopied, setCustomSchemaCopied] = useState<boolean>(false);

  // GraphQL Interactive States
  const [graphqlQuery, setGraphqlQuery] = useState<string>(`query GetUsersWithSessions {
  users(limit: 5, status: "active") {
    data {
      id
      username
      firstName
      lastName
      email
      sessions {
        sessionId
        ip
        isActive
      }
    }
    pagination {
      totalItems
      page
    }
  }
}`);
  const [graphqlResponse, setGraphqlResponse] = useState<any>(null);
  const [graphqlLoading, setGraphqlLoading] = useState<boolean>(false);
  const [graphqlCopied, setGraphqlCopied] = useState<boolean>(false);
  const [graphqlQueryCopied, setGraphqlQueryCopied] = useState<boolean>(false);

  // Simulated API Keys authentication state
  const [apiCredentials, setApiCredentials] = useState<{ key: string; limit: number; remaining: number } | null>(null);
  const [rateLimitTotal, setRateLimitTotal] = useState<number>(80);
  const [rateLimitLeft, setRateLimitLeft] = useState<number>(80);

  // Pre-configured options for custom schema fields types
  const schemaFieldOptions = [
    { value: 'id', label: 'Sequential ID' },
    { value: 'uuid', label: 'UUID v4' },
    { value: 'username', label: 'Username' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'fullName', label: 'Full Name' },
    { value: 'email', label: 'Email Address' },
    { value: 'avatar', label: 'Avatar Icon URL' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'website', label: 'Website URL' },
    { value: 'company', label: 'Company Name' },
    { value: 'jobTitle', label: 'Job Title' },
    { value: 'address', label: 'Street Address (Full)' },
    { value: 'city', label: 'City' },
    { value: 'country', label: 'Country' },
    { value: 'amount', label: 'Finance Amount ($)' },
    { value: 'currency', label: 'Currency ISO Code' },
    { value: 'creditCard', label: 'Credit Card Number' },
    { value: 'iban', label: 'IBAN Code' },
    { value: 'merchant', label: 'Merchant Brand' },
    { value: 'price', label: 'Product Price Decimal' },
    { value: 'discount', label: 'Discount Percentage (%)' },
    { value: 'rating', label: 'Reviews Rating (1.0 - 5.0)' },
    { value: 'stock', label: 'Inventory Stock Count' },
    { value: 'brand', label: 'E-commerce Brand Name' },
    { value: 'category', label: 'E-commerce Category' },
    { value: 'title', label: 'Article / Post Title' },
    { value: 'content', label: 'Article Full Body Text' },
    { value: 'likes', label: 'Engagement Likes Count' },
    { value: 'ip', label: 'IPv4 Address' },
    { value: 'userAgent', label: 'Client User Agent' },
    { value: 'userRole', label: 'System Access Role (admin/user)' },
    { value: 'userStatus', label: 'User State (active/pending)' },
    { value: 'boolean', label: 'Boolean Flag (true/false)' },
    { value: 'date', label: 'Recent Calendar ISO Date' },
    { value: 'color', label: 'Color Hex Code' }
  ];

  // Load API Key configuration if exists in LocalStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('MOCK_DEV_API_KEY');
    if (savedKey) {
      setApiCredentials({
        key: savedKey,
        limit: 1000,
        remaining: 1000
      });
      setRateLimitTotal(1000);
      setRateLimitLeft(1000);
    }
  }, []);

  // Update selected endpoint if category selection changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category !== 'Schema-Builder' && category !== 'GraphQL') {
      const match = API_ENDPOINTS.find((e) => e.category === category);
      if (match) {
        setSelectedEndpoint(match);
        // Clear previous state
        setResponseData(null);
        setResponseStatus(null);
        setResponseLatency(null);
      }
    }
  };

  // Perform a live fetch request against our unified GraphQL endpoint
  const fireGraphqlQuery = async (queryToRun?: string) => {
    setGraphqlLoading(true);
    setGraphqlResponse(null);
    const finalQuery = queryToRun || graphqlQuery;

    try {
      const startTime = performance.now();
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiCredentials?.key ? { 'x-api-key': apiCredentials.key } : {})
        },
        body: JSON.stringify({ query: finalQuery })
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const body = await response.json();
      setGraphqlResponse(body);

      // Update rate limit quotas synchronously from headers
      const xRemaining = response.headers.get('x-ratelimit-remaining');
      const xLimit = response.headers.get('x-ratelimit-limit');
      if (xRemaining) setRateLimitLeft(parseInt(xRemaining, 10));
      if (xLimit) setRateLimitTotal(parseInt(xLimit, 10));
    } catch (err: any) {
      console.error(err);
      setGraphqlResponse({
        errors: [{ message: 'GraphQL connection failed. ' + err.message }]
      });
    } finally {
      setGraphqlLoading(false);
    }
  };

  // Generate Simulated API key for higher rate limits
  const generateApiKey = () => {
    const randomKey = `md_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
    localStorage.setItem('MOCK_DEV_API_KEY', randomKey);
    setApiCredentials({
      key: randomKey,
      limit: 1000,
      remaining: 1000
    });
    setRateLimitTotal(1000);
    setRateLimitLeft(1000);
  };

  const removeApiKey = () => {
    localStorage.removeItem('MOCK_DEV_API_KEY');
    setApiCredentials(null);
    setRateLimitTotal(80);
    setRateLimitLeft(80);
  };

  // Compile full playground request URL based on active variables
  const getPlaygroundRequestUrl = (endpoint: EndpointInfo, absolute = false) => {
    const baseUrl = absolute ? window.location.origin : '';
    // replace route parameters, e.g. :id
    let parsedPath = endpoint.path;
    
    // Check if path has route parameters
    if (parsedPath.includes('/:id')) {
      const customId = playgroundInputs[`${endpoint.id}_path_id`] || '12';
      parsedPath = parsedPath.replace('/:id', `/${customId}`);
    }

    const queryParts: string[] = [];
    
    // Add custom delay if configured by the slider back-end feature
    if (delaySlider > 0) {
      queryParts.push(`delay=${delaySlider}`);
    }

    // Add API key if exists
    if (apiCredentials?.key) {
      queryParts.push(`apikey=${apiCredentials.key}`);
    }

    // Map each specified query parameter input value
    endpoint.queryParams?.forEach((param) => {
      const inputVal = playgroundInputs[`${endpoint.id}_q_${param.name}`];
      if (inputVal !== undefined && inputVal.trim() !== '') {
        queryParts.push(`${param.name}=${encodeURIComponent(inputVal)}`);
      }
    });

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `${baseUrl}${parsedPath}${queryString}`;
  };

  // Execute sandbox fetch logic
  const firePlaygroundTest = async () => {
    setPlaygroundLoading(true);
    setResponseData(null);
    setResponseStatus(null);
    setResponseLatency(null);

    const startTime = performance.now();
    const url = getPlaygroundRequestUrl(selectedEndpoint, false);

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (apiCredentials?.key) {
        options.headers = {
          ...options.headers,
          'x-api-key': apiCredentials.key
        };
      }

      const response = await fetch(url, options);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const headersObj: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersObj[key] = val;
      });

      // Update rate limits stats dynamically from genuine response headers
      const xRemaining = response.headers.get('x-ratelimit-remaining');
      const xLimit = response.headers.get('x-ratelimit-limit');
      if (xRemaining) setRateLimitLeft(parseInt(xRemaining, 10));
      if (xLimit) setRateLimitTotal(parseInt(xLimit, 10));

      let bodyData;
      const textVal = await response.text();
      try {
        bodyData = JSON.parse(textVal);
      } catch {
        bodyData = textVal;
      }

      setResponseStatus(response.status);
      setResponseHeaders(headersObj);
      setResponseData(bodyData);
      setResponseLatency(latency);
    } catch (err: any) {
      console.error(err);
      setResponseStatus(500);
      setResponseData({ error: 'Sandbox Connection Error', message: err.message });
    } finally {
      setPlaygroundLoading(false);
    }
  };

  // Compile schema builders via POST /api/v1/schema endpoint
  const fireBuildCustomSchema = async () => {
    setSchemaLoading(true);
    setSchemaResult(null);

    try {
      // Validate schema format
      const refinedFields = schemaFields.filter((f) => f.name.trim() !== '');
      if (refinedFields.length === 0) {
        alert('Please define at least one schema field parameter.');
        setSchemaLoading(false);
        return;
      }

      const response = await fetch('/api/v1/schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiCredentials?.key ? { 'x-api-key': apiCredentials.key } : {})
        },
        body: JSON.stringify({
          fields: refinedFields,
          count: schemaRecordCount
        })
      });

      const body = await response.json();
      if (response.headers.get('x-ratelimit-remaining')) {
        setRateLimitLeft(parseInt(response.headers.get('x-ratelimit-remaining') || '80', 10));
      }

      setSchemaResult(body);
    } catch (err: any) {
      console.error(err);
      setSchemaResult({ error: 'Schema compiler failed', message: err.message });
    } finally {
      setSchemaLoading(false);
    }
  };

  // CSV Generator downloader method
  const downloadSchemaAsCSV = () => {
    if (!schemaResult || !schemaResult.data || !Array.isArray(schemaResult.data)) return;
    const records = schemaResult.data;
    if (records.length === 0) return;

    // extract standard headers
    const headers = Object.keys(records[0]);
    const csvRows = [];
    
    // append header row
    csvRows.push(headers.join(','));

    // append each record
    for (const row of records) {
      const values = headers.map((header) => {
        const val = row[header];
        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        // escape double quotes
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mock_dev_custom_schema_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON downloader method
  const downloadSchemaAsJSON = () => {
    if (!schemaResult) return;
    const blob = new Blob([JSON.stringify(schemaResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mock_dev_schema_${Math.floor(Date.now()/1000)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper copy to clipboard
  const copyToClipboard = (text: string, id: string, customStateToggler?: (b: boolean) => void) => {
    navigator.clipboard.writeText(text);
    if (customStateToggler) {
      customStateToggler(true);
      setTimeout(() => customStateToggler(false), 2000);
    } else {
      setCopiedEndpoints((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedEndpoints((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  // Retrieve code recipes based on user inputs in active tab
  const getCodeRecipe = () => {
    const targetUrl = getPlaygroundRequestUrl(selectedEndpoint, true);
    const method = selectedEndpoint.method;

    if (codeLang === 'js') {
      return `// 🌐 JavaScript Axios Client Example
const axios = require('axios');

const getMockData = async () => {
  try {
    const config = {
      method: '${method.toLowerCase()}',
      url: '${targetUrl}',
      headers: {
        'Accept': 'application/json',${apiCredentials?.key ? `\n        'X-API-Key': '${apiCredentials.key}'` : ''}
      }
    };
    
    console.log('Sending request to MockDev API Hub...');
    const response = await axios(config);
    console.log('HTTP Status:', response.status);
    console.log('Payload Data:', response.data);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

getMockData();`;
    }

    if (codeLang === 'node') {
      return `// 🚀 Node.js Standard Fetch Example
const fetchMockAPI = async () => {
  try {
    const response = await fetch('${targetUrl}', {
      method: '${method}',
      headers: {
        'Accept': 'application/json',${apiCredentials?.key ? `\n        'x-api-key': '${apiCredentials.key}'` : ''}
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const json = await response.json();
    console.log('Received deterministic mock payload:', json);
  } catch (err) {
    console.error('Failed fetching data:', err);
  }
};

fetchMockAPI();`;
    }

    if (codeLang === 'ts') {
      return `// ⚡ Strongly Typed TypeScript Module
import axios from 'axios';

export interface APIEnvelope<T> {
  data: T[];
  pagination: {
    totalItems: number;
    pagedCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export async function fetchSeededCollections<T>(customLimit = 10): Promise<APIEnvelope<T>> {
  const requestUrl = \`${targetUrl.split('?')[0]}?limit=\${customLimit}${apiCredentials?.key ? `&apikey=${apiCredentials.key}` : ''}\`;
  
  const response = await axios.get<APIEnvelope<T>>(requestUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  return response.data;
}`;
    }

    if (codeLang === 'python') {
      return `# 🐍 Python requests script
import requests
import json

endpoint_url = "${targetUrl}"
custom_headers = {
    "Accept": "application/json"${apiCredentials?.key ? `,\n    "x-api-key": "${apiCredentials.key}"` : ''}
}

try:
    print("Executing request to MockDev API Gateway...")
    response = requests.get(endpoint_url, headers=custom_headers)
    
    print(f"Response Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
    else:
        print(response.text)
except Exception as e:
    print(f"Request exception triggered: {e}")`;
    }

    return '';
  };

  // Filter endpoints matching user search queries
  const filteredEndpoints = API_ENDPOINTS.filter((endpoint) => {
    const baseQuery = searchQuery.toLowerCase();
    return (
      endpoint.path.toLowerCase().includes(baseQuery) ||
      endpoint.category.toLowerCase().includes(baseQuery) ||
      endpoint.description.toLowerCase().includes(baseQuery)
    );
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0A0B] text-[#E4E4E7]' : 'bg-[#FAF9F6] text-[#18181B]'
    }`}>
      
      {/* 🚀 MAIN PORTAL HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b flex items-center justify-between px-8 py-4 ${
        theme === 'dark' ? 'bg-[#0A0A0B]/80 border-[#1F1F22]' : 'bg-white/80 border-[#E4E4E7]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-display font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                MockDev Hub
              </span>
              <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md font-bold ${
                theme === 'dark' ? 'bg-[#1F1F22] text-blue-400 border border-[#262629]' : 'bg-[#F4F4F5] text-blue-600 border border-[#E4E4E7]'
              }`}>
                v1.0 Seeded
              </span>
            </div>
            <p className={`text-[10px] hidden sm:block ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>100+ High-Fidelity Deterministic Mock APIs</p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center space-x-3">
          {/* Rate Limit Indicators */}
          <div className={`hidden md:flex items-center space-x-3 px-3 py-1 rounded-md border font-mono text-[10px] ${
            theme === 'dark' ? 'bg-[#1F1F22] border-[#262629] text-blue-400' : 'bg-[#F4F4F5] border-[#E4E4E7] text-blue-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Quota:</span>
            <span className="font-bold">
              {rateLimitLeft}
            </span>
            <span className="opacity-50">/</span>
            <span>{rateLimitTotal}</span>
          </div>

          {/* Simulated Credentials */}
          <div className="relative group">
            {apiCredentials ? (
              <div className="flex items-center space-x-1.5 animate-fade-in">
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[10px] font-mono ${
                  theme === 'dark' ? 'bg-[#1F1F22] text-[#A1A1AA] border border-[#262629]' : 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]'
                }`}>
                  <span className="text-blue-400 font-bold">KEY:</span>
                  <span className="max-w-[124px] truncate">{apiCredentials.key}</span>
                  <button onClick={removeApiKey} className="text-rose-400 hover:text-rose-300 font-bold ml-1.5 transition-colors" title="Remove Api Key">×</button>
                </div>
              </div>
            ) : (
              <button
                onClick={generateApiKey}
                className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
                id="header-auth-generator-button"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Get API Key</span>
              </button>
            )}
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded-md border transition-all ${
              theme === 'dark' ? 'hover:bg-[#1F1F22] border-[#262629] text-gray-300' : 'hover:bg-[#F4F4F5] border-[#E4E4E7] text-gray-700'
            }`}
            id="theme-toggler"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* Hero Intro Banner Section */}
      <section className={`px-8 py-6 border-b text-center sm:text-left ${
        theme === 'dark' ? 'bg-[#0A0A0B] border-[#1F1F22]' : 'bg-zinc-50 border-[#E4E4E7]'
      }`}>
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
              theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border border-blue-900/30' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              Seeded Deterministic Platform
            </span>
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
              Comprehensive sandbox of <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">high-fidelity mock APIs</span>
            </h1>
            <p className={`text-xs leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-[#A1A1AA]' : 'text-slate-600'}`}>
              Accelerate web prototyping securely. Simulate complex multi-user queries without backend databases, API rate limitations, or security key exposures. Use parameters fuzzing, network delay control, and a full custom schema workshop engine.
            </p>
          </div>

          <div className={`p-4 rounded-xl border min-w-[280px] space-y-3 ${
            theme === 'dark' ? 'bg-[#151518] border-[#262629]' : 'bg-white border-[#E4E4E7]'
          }`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>GATEWAY STATUS</span>
              <span className="text-green-500 font-mono flex items-center space-x-1.5 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>ONLINE</span>
              </span>
            </div>
            <div className={`h-px ${theme === 'dark' ? 'bg-[#262629]' : 'bg-[#E4E4E7]'}`}></div>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
              <div>
                <span className={`block uppercase mb-0.5 ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>Global Latency</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-[#E4E4E7]' : 'text-slate-800'}`}>14ms (stable)</span>
              </div>
              <div>
                <span className={`block uppercase mb-0.5 ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>Storage</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-[#E4E4E7]' : 'text-slate-800'}`}>1.5k Seeded DB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ CORE WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1700px] w-full mx-auto" id="bento-workspace-frame">
        
        {/* SIDEBAR NAVIGATION ZONE */}
        <aside className={`lg:w-60 w-full p-6 shrink-0 flex flex-col space-y-5 border-r ${
          theme === 'dark' ? 'bg-[#0C0C0E] border-[#1F1F22]' : 'bg-zinc-50 border-[#E4E4E7]'
        }`}>
          {/* Fuzz search for matching endpoints */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs italic pointer-events-none ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>/</span>
            <input
              type="text"
              placeholder="/api/v1/search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border rounded-full py-1.5 pl-8 pr-10 text-xs focus:outline-none focus:ring-1 ${
                theme === 'dark' 
                  ? 'bg-[#151518] border-[#262629] text-[#E4E4E7] focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-white border-[#E4E4E7] text-slate-800 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-200"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-[#52525B] font-bold px-2 mb-3">Core Collections</div>
            <div className="space-y-1">
              
              {/* Category Options */}
              {['Users', 'Finance', 'E-commerce', 'Social', 'Analytics', 'Utilities', 'System'].map((cat) => {
                const isActive = activeCategory === cat;
                const iconMap: Record<string, string> = {
                  'Users': '👤',
                  'Finance': '💳',
                  'E-commerce': '🛒',
                  'Social': '🌐',
                  'Analytics': '📊',
                  'Utilities': '⚙️',
                  'System': '💻'
                };
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-md transition-all font-medium ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-[#1F1F22] text-white'
                          : 'bg-zinc-200 text-zinc-900'
                        : theme === 'dark'
                          ? 'text-[#A1A1AA] hover:text-white hover:bg-[#151518]/50'
                          : 'text-zinc-650 hover:text-[#18181B] hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm opacity-80">{iconMap[cat] || '📁'}</span>
                      <span>{cat}</span>
                    </div>
                    <span className="text-[9px] font-mono opacity-60">
                      {API_ENDPOINTS.filter((e) => e.category === cat).length}
                    </span>
                  </button>
                );
              })}

              <div className={`pt-4 ${theme === 'dark' ? 'border-t border-[#1F1F22]' : 'border-t border-[#E4E4E7]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[#52525B] font-bold px-2 mb-2">Build Workshop</div>
                
                {/* ADVANCED CUSTOM SCHEMA COMPILER TAB */}
                <button
                  onClick={() => handleCategoryChange('Schema-Builder')}
                  className={`w-full flex items-center space-x-2.5 text-xs px-3 py-2 rounded-md transition-all font-medium ${
                    activeCategory === 'Schema-Builder'
                      ? theme === 'dark'
                        ? 'bg-[#1F1F22] text-white border border-[#262629]'
                        : 'bg-[#FAF9F6] text-zinc-900 border border-[#E4E4E7]'
                      : theme === 'dark'
                        ? 'text-[#A1A1AA] hover:text-white hover:bg-[#151518]/50'
                        : 'text-[#18181B] hover:text-[#18181B] hover:bg-zinc-100'
                  }`}
                  id="sidebar-custom-schema-builder-tab"
                >
                  <span className="text-sm opacity-80">🛠️</span>
                  <div className="flex-1 text-left min-w-0">
                    <span className="block truncate">Schema Builder</span>
                  </div>
                </button>

                {/* GRAPHQL SANDBOX PLAY AREA TAB */}
                <button
                  onClick={() => handleCategoryChange('GraphQL')}
                  className={`w-full flex items-center space-x-2.5 text-xs px-3 py-2 rounded-md transition-all font-medium mt-1.5 ${
                    activeCategory === 'GraphQL'
                      ? theme === 'dark'
                        ? 'bg-[#1F1F22] text-white border border-[#262629]'
                        : 'bg-[#FAF9F6] text-zinc-900 border border-[#E4E4E7]'
                      : theme === 'dark'
                        ? 'text-[#A1A1AA] hover:text-white hover:bg-[#151518]/50'
                        : 'text-[#18181B] hover:text-[#18181B] hover:bg-zinc-100'
                  }`}
                  id="sidebar-graphql-console-tab"
                >
                  <span className="text-sm opacity-80">⚛️</span>
                  <div className="flex-1 text-left min-w-0">
                    <span className="block truncate">GraphQL Console</span>
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* DOCUMENTATION / DEVELOPER DETAILS BOTTOM PROFILE */}
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-[#1F1F22]' : 'border-[#E4E4E7]'}`}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                DA
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>dev_architect</p>
                <p className="text-[10px] text-[#52525B] truncate font-semibold">Pro Plan (Seeded)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* 📚 MAIN INTERACTIVE WORKSPACE (CONTENT ROW) */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {activeCategory === 'GraphQL' ? (
              /* ==========================================================
                 GRAPHQL INTERACTIVE PLAYGROUND WORKSPACE 
                 ========================================================== */
              <motion.div
                key="graphql-workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                
                {/* Visual Header / Explainer card */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">⚛️</span>
                        <h2 className={`text-xs font-display font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Unified GraphQL Playground Console</h2>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/50">
                          /api/graphql
                        </span>
                      </div>
                      <p className={`text-xs mt-1 max-w-3xl ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-650'}`}>
                        Query all 100+ mock database models with total control over output properties. Resolve nested user profiles, transaction chains, e-commerce reviews, and complex data relationships with standard GraphQL query structures.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(window.location.origin + '/api/graphql', 'graphql-endpoint')}
                        className={`px-3 py-1.5 rounded-md border text-[11px] font-mono transition-all flex items-center space-x-1.5 ${
                          theme === 'dark' ? 'bg-[#151518] border-[#262629] text-[#A1A1AA] hover:text-white' : 'bg-zinc-100 border-[#E4E4E7] text-slate-650 hover:text-[#18181B]'
                        }`}
                      >
                        {copiedEndpoints['graphql-endpoint'] ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>Copy Endpoint URL</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content split view */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  
                  {/* LEFT PANE: Editor and Presets (Grid 7 cols) */}
                  <div className="xl:col-span-7 flex flex-col space-y-4">
                    
                    {/* Examples Presets Picker */}
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono block mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                        Quick-Load Query Templates
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          {
                            title: '👥 Users & Core Sessions',
                            desc: 'Seeded users, nested token states, and simulated IP logs.',
                            query: `query GetUsersWithSessions {
  users(limit: 5, status: "active") {
    data {
      id
      username
      firstName
      lastName
      email
      sessions {
        sessionId
        ip
        isActive
      }
    }
    pagination {
      totalItems
      page
    }
  }
}`
                          },
                          {
                            title: '🛒 Products Catalog',
                            desc: 'Electronics filter with specific brand matching.',
                            query: `query FilterElectronics {
  products(limit: 5, category: "Electronics", sortBy: "price", sortOrder: "desc") {
    data {
      id
      title
      price
      discountedPrice
      rating
      brand
      dimensions {
        width
        height
      }
    }
  }
}`
                          },
                          {
                            title: '💳 Orders & Shipments',
                            desc: 'Customer demographics, shipping address models, and nested cart totals.',
                            query: `query GetOrdersAndCustomers {
  orders(limit: 3, status: "delivered") {
    data {
      id
      orderNumber
      customerName
      totalPrice
      items {
        title
        price
        quantity
        total
      }
      shippingAddress {
        street
        city
        country
      }
    }
  }
}`
                          },
                          {
                            title: '💬 Social Posts & Comments',
                            desc: 'Seeded journal threads, reaction states, and multi-user replies.',
                            query: `query FetchBlogsWithComments {
  posts(limit: 3) {
    data {
      id
      title
      authorName
      likes
      comments {
        id
        authorName
        body
      }
    }
  }
}`
                          }
                        ].map((preset, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setGraphqlQuery(preset.query);
                              fireGraphqlQuery(preset.query);
                            }}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.005] ${
                              theme === 'dark' 
                                ? 'bg-[#151518]/60 border-[#262629] hover:border-blue-500/40 hover:bg-[#151518]' 
                                : 'bg-zinc-50 border-[#E4E4E7] hover:border-blue-500 hover:bg-zinc-100'
                            }`}
                          >
                            <div className="font-semibold text-xs text-blue-400 mb-0.5">{preset.title}</div>
                            <div className={`text-[10px] leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                              {preset.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Editor Frame */}
                    <div className={`p-4 rounded-xl border flex-1 flex flex-col space-y-3 ${
                      theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                          GraphQL Query Editor
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(graphqlQuery, 'graphql-query', setGraphqlQueryCopied)}
                          className={`text-xs transition-colors flex items-center space-x-1 font-semibold ${
                            theme === 'dark' ? 'text-[#A1A1AA] hover:text-white' : 'text-slate-650'
                          }`}
                        >
                          {graphqlQueryCopied ? (
                            <>
                              <Check className="h-3 text-green-400" />
                              <span className="text-[10px] text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="text-[10px]">Copy Query</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 relative min-h-[350px]">
                        <textarea
                          value={graphqlQuery}
                          onChange={(e) => setGraphqlQuery(e.target.value)}
                          className={`w-full h-full font-mono text-[11px] leading-relaxed p-4 rounded-lg border resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            theme === 'dark' ? 'bg-[#050506] border-[#262629] text-blue-300' : 'bg-[#FAF9F6] border-[#E4E4E7] text-indigo-900'
                          }`}
                          spellCheck={false}
                          placeholder={`query MyQuery { ... }`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fireGraphqlQuery()}
                          disabled={graphqlLoading}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 ${
                            graphqlLoading
                              ? 'bg-[#1F1F22] text-[#A1A1AA] border border-[#262629] cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-[0.995]'
                          }`}
                        >
                          {graphqlLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Executing Query...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>Execute GraphQL Request</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* RIGHT PANE: Response pane & schema docs helper (Grid 5 cols) */}
                  <div className="xl:col-span-5 flex flex-col space-y-4">
                    
                    {/* Visual API Schema Specs Documentation */}
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono block mb-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        📚 GraphQL Schema Reference Manual
                      </span>
                      <div className="space-y-2 text-[11px] leading-relaxed max-h-[170px] overflow-y-auto pr-1">
                        <div>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Queries available:</span>
                          <p className={`text-[10px] leading-normal ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                            • <code className="text-blue-400 font-bold">users(limit, page, role, status, search, sortBy, sortOrder)</code><br />
                            • <code className="text-blue-400 font-bold">products(limit, page, category, sortBy, sortOrder)</code><br />
                            • <code className="text-blue-400 font-bold">orders(limit, page, status)</code><br />
                            • <code className="text-blue-400 font-bold">posts(limit, page)</code>
                          </p>
                        </div>
                        <div className={`h-px ${theme === 'dark' ? 'bg-[#1F1F22]' : 'bg-zinc-100'} my-1`}></div>
                        <div>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Nested Relationships:</span>
                          <p className={`text-[10px] leading-normal ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                            • <code className="text-emerald-400 font-bold">User</code> resolves nested <code className="text-purple-400">sessions</code>, <code className="text-purple-400">posts</code>, and <code className="text-purple-400">orders</code><br />
                            • <code className="text-emerald-400 font-bold">Order</code> resolves nested <code className="text-purple-400">customer</code> and Cartesian <code className="text-purple-400">items</code><br />
                            • <code className="text-emerald-400 font-bold">Post</code> resolves nested author <code className="text-purple-400">user</code> details and user <code className="text-purple-400">comments</code>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Live Query Results */}
                    <div className={`p-4 rounded-xl border flex-1 flex flex-col space-y-3 ${
                      theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                          Console Output Stream
                        </span>

                        {graphqlResponse && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(graphqlResponse, null, 2), 'graphql-copied', setGraphqlCopied)}
                              className={`text-xs flex items-center space-x-1 font-semibold ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-650'}`}
                            >
                              {graphqlCopied ? <Check className="h-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                              <span className="text-[10px]">Copy JSON</span>
                            </button>
                            <button
                              onClick={() => {
                                const blob = new Blob([JSON.stringify(graphqlResponse, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `graphql_response_${Date.now()}.json`;
                                link.click();
                              }}
                              className={`text-xs flex items-center space-x-1 font-semibold ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-650'}`}
                            >
                              <Download className="h-3 w-3" />
                              <span className="text-[10px]">Export</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={`relative flex-1 rounded-md border font-mono text-[11px] p-4 min-h-[300px] overflow-auto flex flex-col ${
                        theme === 'dark' ? 'bg-[#151518]/20 border-[#262629]' : 'bg-[#FAF9F6] border-[#E4E4E7]'
                      }`}>
                        {graphqlLoading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0A0A0B]/80 backdrop-blur-xs rounded-lg z-10">
                            <div className="h-5 w-5 rounded-full border border-indigo-400 border-t-transparent animate-spin"></div>
                            <span className="text-slate-400 text-xs font-sans">Resolving Graph Queries...</span>
                          </div>
                        )}

                        {graphqlResponse === null ? (
                          <div className="space-y-4 my-auto py-12 text-center max-w-sm mx-auto font-sans">
                            <div className="mx-auto w-8 h-8 rounded-full bg-transparent flex items-center justify-center border border-zinc-700/30 text-indigo-400 animate-pulse">
                              <Terminal className="h-4 w-4" />
                            </div>
                            <div className="space-y-1.5">
                              <h5 className={`font-bold text-xs ${theme === 'dark' ? 'text-[#E4E4E7]' : 'text-slate-850'}`}>Live Output Awaiting Dispatch</h5>
                              <p className="text-[11px] text-zinc-550 leading-relaxed">
                                Pick a Template query above or write custom GraphQL schemas in the editor, then run to stream verified deterministic mock outputs.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <pre className="text-emerald-400 whitespace-pre leading-relaxed overflow-x-auto pt-2 flex-1">
                            {JSON.stringify(graphqlResponse, null, 2)}
                          </pre>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </motion.div>
            ) : activeCategory !== 'Schema-Builder' ? (
              
              /* ==========================================================
                 API DOCS & PLAYGROUND HUB WORKSPACE 
                 ========================================================== */
              <motion.div
                key="api-docs-workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                
                {/* MATCHED ENDPOINTS GRID / LIST SELECTOR */}
                <div>
                  <h2 className={`text-[10px] uppercase tracking-wider font-bold mb-3 ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>
                    Available {activeCategory} Endpoints ({filteredEndpoints.filter((e) => e.category === activeCategory).length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredEndpoints.filter((e) => e.category === activeCategory).map((endpoint) => {
                      const isSelected = selectedEndpoint.id === endpoint.id;
                      const hasPost = endpoint.method === 'POST';
                      return (
                        <div
                          key={endpoint.id}
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setResponseData(null);
                            setResponseStatus(null);
                            setResponseLatency(null);
                          }}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? theme === 'dark'
                                ? 'bg-[#151518] border-blue-500/50 shadow-sm'
                                : 'bg-white border-blue-600 shadow-sm'
                              : theme === 'dark'
                                ? 'bg-[#0E0E10] border-[#1F1F22] hover:border-[#262629]'
                                : 'bg-white border-[#E4E4E7] hover:border-zinc-305'
                          }`}
                          id={`endpoint-card-${endpoint.id}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                                hasPost
                                  ? theme === 'dark' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : theme === 'dark' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {endpoint.method}
                              </span>
                              <span className={`font-mono text-xs font-semibold truncate max-w-[200px] md:max-w-[150px] lg:max-w-[240px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {endpoint.path}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-550 font-mono">
                              {endpoint.rateLimit.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed">
                            {endpoint.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE DOCUMENTATION DETAIL & SANDBOX TRIGGER PANEL */}
                <div className={`rounded-xl border ${
                  theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7] shadow-sm'
                }`}>
                  
                  {/* Endpoint Header metadata */}
                  <div className={`p-5 md:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${theme === 'dark' ? 'border-[#1F1F22]' : 'border-[#E4E4E7]'}`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2.5">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold font-mono border ${
                          selectedEndpoint.method === 'POST'
                            ? theme === 'dark' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : theme === 'dark' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {selectedEndpoint.method}
                        </span>
                        <h3 className={`font-mono text-xs md:text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                          {selectedEndpoint.path}
                        </h3>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-[#88888F]' : 'text-slate-650'}`}>
                        {selectedEndpoint.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(getPlaygroundRequestUrl(selectedEndpoint, true), 'path')}
                        className={`px-3 py-1.5 rounded-md border text-[11px] font-mono transition-all flex items-center space-x-1.5 ${
                          theme === 'dark' ? 'bg-[#151518] border-[#262629] text-[#A1A1AA] hover:text-white' : 'bg-zinc-100 border-[#E4E4E7] text-slate-650 hover:text-[#18181B]'
                        }`}
                      >
                        {copiedEndpoints['path'] ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>Copy URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Playground Sandbox Section */}
                  <div className="p-5 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
                    
                    {/* LEFT PANEL: PARAMS BUILDER (Grid span 5) */}
                    <div className="xl:col-span-5 space-y-5">
                      
                      {/* Section Title */}
                      <div className="flex items-center space-x-2 font-display">
                        <Sliders className="h-3.5 w-3.5 text-blue-450" />
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA]">Sandbox Variables</h4>
                      </div>

                      {/* Route Path Parameter (if :id exists) */}
                      {selectedEndpoint.path.includes('/:id') && (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-[#A1A1AA] flex items-center justify-between">
                            <span>Path Parameter :id (e.g. User or Object ID)</span>
                            <span className="text-rose-450 text-[9px] font-bold uppercase">required</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 12"
                            value={playgroundInputs[`${selectedEndpoint.id}_path_id`] || '12'}
                            onChange={(e) => {
                              setPlaygroundInputs({
                                ...playgroundInputs,
                                [`${selectedEndpoint.id}_path_id`]: e.target.value
                              });
                            }}
                            className={`w-full px-3 py-2 text-xs rounded-md border font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              theme === 'dark' ? 'bg-[#151518] border-[#262629] text-white' : 'bg-zinc-50 border-[#E4E4E7] text-slate-950'
                            }`}
                          />
                        </div>
                      )}

                      {/* Dynamic list of query parameters */}
                      {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 ? (
                        <div className="space-y-4">
                          {selectedEndpoint.queryParams.map((param) => {
                            const uniqueInputId = `${selectedEndpoint.id}_q_${param.name}`;
                            const value = playgroundInputs[uniqueInputId] || '';
                            return (
                              <div key={param.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{param.name}</span>
                                    <span className="text-slate-500 font-normal">({param.type})</span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    {param.defaultValue && (
                                      <span className="text-slate-500 font-normal">default: {param.defaultValue}</span>
                                    )}
                                    <span className={param.required ? 'text-rose-455 font-bold uppercase text-[9px]' : 'text-slate-500 font-normal'}>
                                      {param.required ? 'required' : 'optional'}
                                    </span>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  placeholder={param.description}
                                  value={value}
                                  onChange={(e) => {
                                    setPlaygroundInputs({
                                      ...playgroundInputs,
                                      [uniqueInputId]: e.target.value
                                    });
                                  }}
                                  className={`w-full px-3 py-2 text-xs rounded-md border font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    theme === 'dark' ? 'bg-[#151518] border-[#262629] text-white' : 'bg-zinc-50 border-[#E4E4E7] text-slate-950'
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`p-4 rounded-md border text-xs text-center ${
                          theme === 'dark' ? 'bg-[#151518]/30 border-[#262629] text-[#52525B]' : 'bg-zinc-50 border-[#E4E4E7] text-slate-500'
                        }`}>
                          This API endpoint does not accept custom query modifiers.
                        </div>
                      )}

                      {/* Simulated delay controls slider */}
                      <div className={`space-y-2 border-t pt-4 ${theme === 'dark' ? 'border-[#1F1F22]' : 'border-[#E4E4E7]'}`}>
                        <label className="text-[11px] font-mono text-[#A1A1AA] flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-400" />
                            <span>Artificial Network Latency</span>
                          </span>
                          <span className="font-bold font-mono text-blue-400">{delaySlider} ms</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="3000"
                          step="100"
                          value={delaySlider}
                          onChange={(e) => setDelaySlider(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="block text-[10px] text-zinc-500 leading-normal">
                          Configures artificial response delay on Express server. Key for validating animated loaders or skeleton fallbacks.
                        </span>
                      </div>

                      {/* Fire Sandbox Request Button */}
                      <button
                        onClick={firePlaygroundTest}
                        disabled={playgroundLoading}
                        className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-md text-xs font-bold transition-all shadow-sm ${
                          playgroundLoading
                            ? 'bg-[#1F1F22] text-[#A1A1AA] border border-[#262629] cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01]'
                        }`}
                        id="test-endpoint-button"
                      >
                        {playgroundLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Routing Query...</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 fill-white text-white" />
                            <span>Send Sandbox Request</span>
                          </>
                        )}
                      </button>

                    </div>


                    {/* RIGHT PANEL: DYNAMIC INTERACTIVE OUTPUT PLAYGROUND (Grid span 7) */}
                    <div className="xl:col-span-7 flex flex-col space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-display ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>
                          Live HTTP Console Output
                        </span>
                        
                        {/* Live performance and Status Badges */}
                        {responseStatus !== null && (
                          <div className="flex items-center space-x-2.5 font-mono text-[10px]">
                            <span className="text-[#52525B]">Status:</span>
                            <span className={`font-bold px-1.5 py-0.5 rounded ${
                              responseStatus === 200 || responseStatus === 201 
                                ? 'bg-green-950/40 text-green-400 border border-green-900/50' 
                                : 'bg-rose-950/40 text-rose-450 border border-rose-900/50'
                            }`}>
                              {responseStatus}
                            </span>
                            {responseLatency !== null && (
                              <>
                                <span className="opacity-10">|</span>
                                <span className="text-[#52525B]">Latency:</span>
                                <span className="font-bold text-blue-400">{responseLatency}ms</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Display response payload block */}
                      <div className={`relative flex-1 rounded-md border font-mono text-[11px] p-4 min-h-[360px] max-h-[500px] overflow-auto flex flex-col justify-between ${
                        theme === 'dark' ? 'bg-[#151518]/20 border-[#262629]' : 'bg-[#FAF9F6] border-[#E4E4E7] text-slate-800'
                      }`}>
                        
                        {playgroundLoading ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0A0A0B]/80 backdrop-blur-xs rounded-md">
                            <div className="h-5 w-5 rounded-full border border-blue-400 border-t-transparent animate-spin"></div>
                            <span className="text-[#88888F] text-[10px] font-sans">Simulating connection stream...</span>
                          </div>
                        ) : null}

                        {/* If request has not been sent, display placeholder API specifications */}
                        {responseData === null ? (
                          <div className="space-y-4 my-auto py-8 text-center max-w-sm mx-auto font-sans">
                            <div className="mx-auto w-8 h-8 rounded-full bg-transparent flex items-center justify-center border border-zinc-700/30 text-blue-400">
                              <Terminal className="h-4 w-4" />
                            </div>
                            <div className="space-y-1.5">
                              <h5 className={`font-bold text-xs ${theme === 'dark' ? 'text-[#E4E4E7]' : 'text-slate-800'}`}>Execute Endpoint</h5>
                              <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-500'}`}>
                                Review parameters on the left and trigger a mock request to see details.
                              </p>
                            </div>
                          </div>
                        ) : (
                          // Formatted JSON Output
                          <div className="flex-1 select-text">
                            <div className={`flex justify-between items-center mb-2 pb-2 border-b ${theme === 'dark' ? 'border-[#262629]' : 'border-[#E4E4E7]'}`}>
                              <span className="text-[9px] text-[#52525B] uppercase tracking-wider font-bold">RESPONSE_BODY_JSON</span>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(responseData, null, 2), 'response-body')}
                                className="text-blue-500 hover:text-blue-400 flex items-center space-x-1"
                              >
                                {copiedEndpoints['response-body'] ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-400" />
                                    <span className="text-[10px] text-green-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span className="text-[10px]">Copy JSON</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-blue-400 leading-relaxed overflow-x-auto">
                              {JSON.stringify(responseData, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>

                {/* 📝 RECIPE INTEGRATOR: CODE EXAMPLES PANEL */}
                <div className={`rounded-xl border p-5 md:p-6 ${
                  theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7]'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-400" />
                      <h4 className={`text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-[#52525B]' : 'text-zinc-550'}`}>Integration Snippet</h4>
                    </div>

                    {/* Language Toggles */}
                    <div className={`flex items-center space-x-1 p-1 rounded-md border font-mono text-[10px] ${
                      theme === 'dark' ? 'bg-[#151518] border-[#262629]' : 'bg-zinc-50 border-[#E4E4E7]'
                    }`}>
                      {[
                        { id: 'js', label: 'JavaScript' },
                        { id: 'node', label: 'Node fetch' },
                        { id: 'ts', label: 'TypeScript' },
                        { id: 'python', label: 'Python' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setCodeLang(lang.id as any)}
                          className={`px-2.5 py-1 rounded transition-all font-medium ${
                            codeLang === lang.id
                              ? theme === 'dark' ? 'bg-[#262629] text-white border border-[#3E3E42]' : 'bg-zinc-200 text-zinc-950 border border-zinc-300'
                              : theme === 'dark' ? 'text-[#88888F] hover:text-white' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Snippet Display Box */}
                  <div className={`relative rounded-md p-4 border ${theme === 'dark' ? 'bg-[#050506] border-[#1F1F22]' : 'bg-zinc-50 border-[#E4E4E7]'}`}>
                    <button
                      onClick={() => copyToClipboard(getCodeRecipe(), 'recipe')}
                      className="absolute right-4 top-4 text-blue-500 hover:text-blue-400 flex items-center space-x-1 text-xs"
                    >
                      {copiedEndpoints['recipe'] ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-400" />
                          <span className="text-[10px] text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="text-[10px]">Copy code</span>
                        </>
                      )}
                    </button>
                    
                    <pre className="text-xs text-blue-400 font-mono leading-relaxed overflow-x-auto pt-4 whitespace-pre">
                      {getCodeRecipe()}
                    </pre>
                  </div>
                </div>

              </motion.div>
            ) : (


              /* ==========================================================
                 CUSTOM SCHEMA COMPILER STUDY (DYNAMIC GENERATOR WORKSPACE) 
                 ========================================================== */
              <motion.div
                key="schema-builder-workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                
                {/* Section Title */}
                <div>
                  <h1 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                    <span>Dynamic Custom Schema Workshop</span>
                  </h1>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>
                    Build custom data schemas by stacking variables, define targeted generation row thresholds, and output JSON / CSV mock templates.
                  </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                  
                  {/* SCHEMA CONTROLS CANVAS */}
                  <div className={`xl:w-[480px] p-5 rounded-xl border flex flex-col justify-between shrink-0 space-y-6 ${
                    theme === 'dark' ? 'bg-[#0E0E10] border-[#1F1F22]' : 'bg-white border-[#E4E4E7] shadow-sm'
                  }`}>
                    
                    <div className="space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-display ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>Schema Attributes</span>
                        <span className="text-[10px] text-zinc-505 font-mono">Max 15 variables</span>
                      </div>

                      {/* Fields Map Builder array */}
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {schemaFields.map((field, idx) => (
                          <div key={idx} className={`flex items-center space-x-2 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-[#151518]/60 border-[#262629]' : 'bg-zinc-50 border-[#E4E4E7]'}`}>
                            
                            {/* Key Name Input */}
                            <input
                              type="text"
                              placeholder="key_name"
                              value={field.name}
                              onChange={(e) => {
                                const duplicate = [...schemaFields];
                                duplicate[idx].name = e.target.value.replace(/[^a-zA-Z0-9_]/g, ''); // keep alphanumeric or underscores safely
                                setSchemaFields(duplicate);
                              }}
                              className={`w-36 px-2.5 py-1.5 text-xs rounded-md border font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                theme === 'dark' ? 'bg-[#050506] border-[#262629] text-white' : 'bg-white border-[#E4E4E7] text-slate-900'
                              }`}
                            />

                            {/* Dropdown Types Selector */}
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const duplicate = [...schemaFields];
                                duplicate[idx].type = e.target.value;
                                setSchemaFields(duplicate);
                              }}
                              className={`flex-1 px-2 py-1.5 text-xs rounded-md border font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                theme === 'dark' ? 'bg-[#050506] border-[#262629] text-slate-200' : 'bg-white border-[#E4E4E7] text-slate-800'
                              }`}
                            >
                              {schemaFieldOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>

                            {/* Remove Trigger */}
                            <button
                              onClick={() => {
                                const filtered = schemaFields.filter((_, fIdx) => fIdx !== idx);
                                setSchemaFields(filtered);
                              }}
                              disabled={schemaFields.length <= 1}
                              className="text-rose-500 hover:text-rose-450 p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        ))}
                      </div>

                      {/* Add variable Button */}
                      <button
                        onClick={() => {
                          if (schemaFields.length >= 15) return;
                          setSchemaFields([...schemaFields, { name: '', type: 'fullName' }]);
                        }}
                        className={`w-full flex items-center justify-center space-x-1.5 py-2 rounded-md border border-dashed text-xs font-semibold hover:scale-[1.005] transition-all ${
                          theme === 'dark' ? 'border-[#262629] text-[#A1A1AA] hover:text-white' : 'border-[#E4E4E7] text-slate-650 hover:text-slate-905'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Field</span>
                      </button>

                      {/* Record counts modifiers */}
                      <div className={`space-y-2 border-t pt-4 ${theme === 'dark' ? 'border-[#1F1F22]' : 'border-[#E4E4E7]'}`}>
                        <label className="text-[11px] font-mono text-[#A1A1AA] flex items-center justify-between">
                          <span>Row Count Output</span>
                          <span className="font-bold text-blue-400">{schemaRecordCount} objects</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          {[5, 10, 20, 50, 100].map((ct) => (
                            <button
                              key={ct}
                              onClick={() => setSchemaRecordCount(ct)}
                              className={`flex-1 py-1.5 text-xs rounded-md border font-mono font-bold transition-all ${
                                schemaRecordCount === ct
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : theme === 'dark'
                                    ? 'bg-[#151518] border-[#262629] text-[#A1A1AA] hover:bg-[#262629]'
                                    : 'bg-zinc-50 border-[#E4E4E7] text-slate-600 hover:bg-zinc-100'
                              }`}
                            >
                              {ct}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Dispatch custom schema generator payload */}
                    <button
                      onClick={fireBuildCustomSchema}
                      disabled={schemaLoading}
                      className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-md text-xs font-bold transition-all shadow-sm ${
                        schemaLoading
                          ? 'bg-[#1F1F22] text-[#A1A1AA] border border-[#262629] cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01]'
                      }`}
                      id="generate-custom-schema-button"
                    >
                      {schemaLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Compiling JSON Schema...</span>
                        </>
                      ) : (
                        <>
                          <Sliders className="h-4 w-4" />
                          <span>Generate Seeded Schema</span>
                        </>
                      )}
                    </button>

                  </div>


                  {/* SCHEMA PREVIEW PANEL */}
                  <div className="flex-1 flex flex-col space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-display ${theme === 'dark' ? 'text-[#52525B]' : 'text-slate-400'}`}>
                        Engine Compiler Output
                      </span>

                      {/* Downloads tools */}
                      {schemaResult && schemaResult.data && (
                        <div className="flex items-center space-x-2 text-xs">
                          {/* Copy Result */}
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(schemaResult, null, 2), 'custom-schema', setCustomSchemaCopied)}
                            className={`px-3 py-1 bg-transparent border rounded-md flex items-center space-x-1.5 transition-colors text-[11px] ${
                              theme === 'dark' ? 'border-[#262629] text-[#A1A1AA] hover:text-white' : 'border-[#E4E4E7] text-slate-650 hover:text-zinc-950'
                            }`}
                          >
                            {customSchemaCopied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </button>

                          {/* JSON Download */}
                          <button
                            onClick={downloadSchemaAsJSON}
                            className={`px-3 py-1 bg-transparent border rounded-md flex items-center space-x-1.5 transition-colors text-[11px] ${
                              theme === 'dark' ? 'border-[#262629] text-[#A1A1AA] hover:text-white' : 'border-[#E4E4E7] text-slate-650 hover:text-[#18181B]'
                            }`}
                            title="Download JSON Pack"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Export JSON</span>
                          </button>

                          {/* CSV Download */}
                          <button
                            onClick={downloadSchemaAsCSV}
                            className={`px-3 py-1 bg-transparent border rounded-md flex items-center space-x-1.5 transition-colors text-[11px] ${
                              theme === 'dark' ? 'border-[#262629] text-[#A1A1AA] hover:text-white' : 'border-[#E4E4E7] text-slate-650 hover:text-[#18181B]'
                            }`}
                            title="Download CSV"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>CSV</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Console body rendering parsed output list */}
                    <div className={`relative flex-1 rounded-md border font-mono text-[11px] p-4 min-h-[460px] max-h-[620px] overflow-auto flex flex-col justify-between ${
                      theme === 'dark' ? 'bg-[#151518]/20 border-[#262629]' : 'bg-[#FAF9F6] border-[#E4E4E7] text-slate-800'
                    }`}>
                      
                      {schemaLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0A0A0B]/80 backdrop-blur-xs rounded-md">
                          <div className="h-5 w-5 rounded-full border border-blue-400 border-t-transparent animate-spin"></div>
                          <span className="text-slate-400 text-xs font-sans">Translating custom seeds schemas...</span>
                        </div>
                      ) : null}

                      {schemaResult === null ? (
                        <div className="space-y-4 my-auto py-12 text-center max-w-sm mx-auto font-sans">
                          <div className="mx-auto w-8 h-8 rounded-full bg-transparent flex items-center justify-center border border-zinc-700/30 text-blue-400 animate-pulse">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div className="space-y-1.5">
                            <h5 className={`font-bold text-xs ${theme === 'dark' ? 'text-[#E4E4E7]' : 'text-slate-850'}`}>Compile Seeded Templates</h5>
                            <p className="text-[11px] text-zinc-550 leading-relaxed">
                              Configure properties, set output rows count, and execute to generate arrays dynamically.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-x-auto whitespace-pre">
                          <pre className="text-blue-400 whitespace-pre leading-relaxed overflow-x-auto pt-2">
                            {JSON.stringify(schemaResult, null, 2)}
                          </pre>
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </main>

      </div>

      {/* FOOTER METRICS INFO */}
      <footer className={`border-t py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${
        theme === 'dark' ? 'bg-[#0A0A0B] border-[#1F1F22] text-[#52525B]' : 'bg-zinc-50 border-[#E4E4E7] text-slate-500'
      }`}>
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span>Persisted: <span className={theme === 'dark' ? 'text-[#A1A1AA]' : 'text-slate-850'}>Seeded context in-memory</span></span>
        </div>

        <div className="text-[10px] font-mono opacity-80">
          MockDev Hub — Premium Developer Sandbox
        </div>
      </footer>

    </div>
  );
}
