
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: string;
  fromEmail: string;
  fromName: string;
}

export interface SecuritySettings {
  sessionTimeout: string;
  maxLoginAttempts: string;
  passwordMinLength: string;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  enableTwoFactor: boolean;
  ipWhitelist: string;
}

export interface LLMSettings {
  // API Configuration
  googleAIApiKey: string;
  pineconeApiKey: string;
  pineconeIndexName: string;
  
  // Model Settings
  temperature: string;
  maxTokens: string;
  model: string;
  systemPrompt: string;
  botInstructions: string;
  enableStreaming: boolean;
  topP: string;
  frequencyPenalty: string;
  presencePenalty: string;
  
  // Rate Limiting
  enableChatLimits: boolean;
  dailyMessageLimit: string;
  hourlyMessageLimit: string;
  limitResetTime: string;
}
