
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EmailSettings as EmailSettingsType } from '@/types/config';

interface EmailSettingsProps {
  settings: EmailSettingsType;
  onSettingsChange: (settings: EmailSettingsType) => void;
}

const EmailSettings = ({ settings, onSettingsChange }: EmailSettingsProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Success", 
      description: "Email settings saved successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>Configure SMTP settings for email delivery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              placeholder="smtp.gmail.com"
              value={settings.smtpHost}
              onChange={(e) => onSettingsChange({...settings, smtpHost: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              value={settings.smtpPort}
              onChange={(e) => onSettingsChange({...settings, smtpPort: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input
              id="smtpUsername"
              value={settings.smtpUsername}
              onChange={(e) => onSettingsChange({...settings, smtpUsername: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => onSettingsChange({...settings, smtpPassword: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smtpEncryption">Encryption</Label>
          <Select value={settings.smtpEncryption} onValueChange={(value) => onSettingsChange({...settings, smtpEncryption: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="tls">TLS</SelectItem>
              <SelectItem value="ssl">SSL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={(e) => onSettingsChange({...settings, fromEmail: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={settings.fromName}
              onChange={(e) => onSettingsChange({...settings, fromName: e.target.value})}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Email Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
