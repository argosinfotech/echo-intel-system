
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SecuritySettings as SecuritySettingsType } from '@/types/config';

interface SecuritySettingsProps {
  settings: SecuritySettingsType;
  onSettingsChange: (settings: SecuritySettingsType) => void;
}

const SecuritySettings = ({ settings, onSettingsChange }: SecuritySettingsProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Security settings saved successfully", 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security and authentication settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => onSettingsChange({...settings, sessionTimeout: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => onSettingsChange({...settings, maxLoginAttempts: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordMinLength">Min Password Length</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => onSettingsChange({...settings, passwordMinLength: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="requireSpecialChars"
              checked={settings.requireSpecialChars}
              onCheckedChange={(checked) => onSettingsChange({...settings, requireSpecialChars: checked})}
            />
            <Label htmlFor="requireSpecialChars">Require Special Characters in Passwords</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requireNumbers"
              checked={settings.requireNumbers}
              onCheckedChange={(checked) => onSettingsChange({...settings, requireNumbers: checked})}
            />
            <Label htmlFor="requireNumbers">Require Numbers in Passwords</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableTwoFactor"
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => onSettingsChange({...settings, enableTwoFactor: checked})}
            />
            <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipWhitelist">IP Whitelist (one per line)</Label>
          <Textarea
            id="ipWhitelist"
            placeholder="192.168.1.1&#10;10.0.0.1"
            value={settings.ipWhitelist}
            onChange={(e) => onSettingsChange({...settings, ipWhitelist: e.target.value})}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Security Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
