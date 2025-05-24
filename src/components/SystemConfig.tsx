
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Shield, Brain } from 'lucide-react';
import GeneralSettings from '@/components/config/GeneralSettings';
import EmailSettings from '@/components/config/EmailSettings';
import SecuritySettings from '@/components/config/SecuritySettings';
import LLMSettings from '@/components/config/LLMSettings';
import { 
  GeneralSettings as GeneralSettingsType,
  EmailSettings as EmailSettingsType,
  SecuritySettings as SecuritySettingsType,
  LLMSettings as LLMSettingsType
} from '@/types/config';

const SystemConfig = () => {
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsType>({
    siteName: 'Admin Dashboard',
    siteDescription: 'Comprehensive admin management system',
    contactEmail: 'admin@example.com',
    timezone: 'UTC',
    language: 'en',
    maintenanceMode: false,
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState<EmailSettingsType>({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: '',
    fromName: '',
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsType>({
    sessionTimeout: '24',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireSpecialChars: true,
    requireNumbers: true,
    enableTwoFactor: false,
    ipWhitelist: '',
  });

  // LLM Settings State
  const [llmSettings, setLlmSettings] = useState<LLMSettingsType>({
    temperature: '0.7',
    maxTokens: '2048',
    model: 'gpt-4o-mini',
    systemPrompt: '',
    botInstructions: '',
    enableStreaming: true,
    topP: '0.9',
    frequencyPenalty: '0',
    presencePenalty: '0',
    enableChatLimits: false,
    dailyMessageLimit: '100',
    hourlyMessageLimit: '20',
    limitResetTime: '00:00',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">System Configuration</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="llm" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>LLM</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            settings={generalSettings}
            onSettingsChange={setGeneralSettings}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings
            settings={emailSettings}
            onSettingsChange={setEmailSettings}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings
            settings={securitySettings}
            onSettingsChange={setSecuritySettings}
          />
        </TabsContent>

        <TabsContent value="llm">
          <LLMSettings
            settings={llmSettings}
            onSettingsChange={setLlmSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfig;
