
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LLMSettings as LLMSettingsType } from '@/types/config';
import { Key, Database } from 'lucide-react';

interface LLMSettingsProps {
  settings: LLMSettingsType;
  onSettingsChange: (settings: LLMSettingsType) => void;
}

const LLMSettings = ({ settings, onSettingsChange }: LLMSettingsProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Success",
      description: "LLM settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>Configure API keys and endpoints for AI services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAIApiKey">Google AI API Key</Label>
            <Input
              id="googleAIApiKey"
              type="password"
              placeholder="Enter your Google AI API key..."
              value={settings.googleAIApiKey}
              onChange={(e) => onSettingsChange({...settings, googleAIApiKey: e.target.value})}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pineconeApiKey">Pinecone API Key</Label>
              <Input
                id="pineconeApiKey"
                type="password"
                placeholder="Enter your Pinecone API key..."
                value={settings.pineconeApiKey}
                onChange={(e) => onSettingsChange({...settings, pineconeApiKey: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                Get your API key from <a href="https://app.pinecone.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pinecone Console</a>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pineconeIndexName">Pinecone Index Name</Label>
              <Input
                id="pineconeIndexName"
                placeholder="knowledge-base"
                value={settings.pineconeIndexName}
                onChange={(e) => onSettingsChange({...settings, pineconeIndexName: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Model Configuration</span>
          </CardTitle>
          <CardDescription>Configure AI model settings and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={settings.model} onValueChange={(value) => onSettingsChange({...settings, model: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (0.0 - 2.0)</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => onSettingsChange({...settings, temperature: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                max="4096"
                value={settings.maxTokens}
                onChange={(e) => onSettingsChange({...settings, maxTokens: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topP">Top P (0.0 - 1.0)</Label>
              <Input
                id="topP"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => onSettingsChange({...settings, topP: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequencyPenalty">Frequency Penalty (-2.0 to 2.0)</Label>
              <Input
                id="frequencyPenalty"
                type="number"
                min="-2"
                max="2"
                step="0.1"
                value={settings.frequencyPenalty}
                onChange={(e) => onSettingsChange({...settings, frequencyPenalty: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presencePenalty">Presence Penalty (-2.0 to 2.0)</Label>
              <Input
                id="presencePenalty"
                type="number"
                min="-2"
                max="2"
                step="0.1"
                value={settings.presencePenalty}
                onChange={(e) => onSettingsChange({...settings, presencePenalty: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              placeholder="Enter the system prompt that will be used for AI responses..."
              value={settings.systemPrompt}
              onChange={(e) => onSettingsChange({...settings, systemPrompt: e.target.value})}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="botInstructions">Bot Instructions</Label>
            <Textarea
              id="botInstructions"
              placeholder="Enter specific instructions for how the bot should behave and respond..."
              value={settings.botInstructions}
              onChange={(e) => onSettingsChange({...settings, botInstructions: e.target.value})}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableStreaming"
              checked={settings.enableStreaming}
              onCheckedChange={(checked) => onSettingsChange({...settings, enableStreaming: checked})}
            />
            <Label htmlFor="enableStreaming">Enable Response Streaming</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chat Limitations</CardTitle>
          <CardDescription>Set daily/hourly message limits per user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableChatLimits"
              checked={settings.enableChatLimits}
              onCheckedChange={(checked) => onSettingsChange({...settings, enableChatLimits: checked})}
            />
            <Label htmlFor="enableChatLimits">Enable Chat Limitations</Label>
          </div>

          {settings.enableChatLimits && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyMessageLimit">Daily Message Limit</Label>
                  <Input
                    id="dailyMessageLimit"
                    type="number"
                    min="1"
                    value={settings.dailyMessageLimit}
                    onChange={(e) => onSettingsChange({...settings, dailyMessageLimit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyMessageLimit">Hourly Message Limit</Label>
                  <Input
                    id="hourlyMessageLimit"
                    type="number"
                    min="1"
                    value={settings.hourlyMessageLimit}
                    onChange={(e) => onSettingsChange({...settings, hourlyMessageLimit: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limitResetTime">Daily Limit Reset Time</Label>
                <Input
                  id="limitResetTime"
                  type="time"
                  value={settings.limitResetTime}
                  onChange={(e) => onSettingsChange({...settings, limitResetTime: e.target.value})}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save LLM Settings
      </Button>
    </div>
  );
};

export default LLMSettings;
