import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Database, Server, Wifi } from 'lucide-react';
import { USE_BACKEND, API_URL } from '../lib/config';

export const ConfigStatus = () => {
  const [backendEnabled, setBackendEnabled] = useState(false);
  const [backendReachable, setBackendReachable] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    setBackendEnabled(USE_BACKEND);

    if (USE_BACKEND) {
      checkBackendConnection();
    }
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/health`, { 
        method: 'GET',
        timeout: 5000 
      } as any);
      setBackendReachable(response.ok);
    } catch (error) {
      setBackendReachable(false);
    }
  };

  if (!showStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">System Status</CardTitle>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowStatus(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {/* Frontend Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <span>Frontend</span>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>

          {/* Backend Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Backend Mode</span>
            </div>
            {backendEnabled ? (
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="h-3 w-3 mr-1" />
                Mock Data
              </Badge>
            )}
          </div>

          {/* Database Status */}
          {backendEnabled && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Backend API</span>
              </div>
              {backendReachable ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          )}

          {/* Info Message */}
          <div className="pt-2 border-t text-xs text-gray-600">
            {!backendEnabled ? (
              <p>
                ℹ️ Using mock data. To enable backend, change <code className="bg-gray-100 px-1 rounded">.env</code> file.
              </p>
            ) : backendReachable ? (
              <p className="text-green-700">
                ✅ Connected to database. All data is being saved!
              </p>
            ) : (
              <p className="text-red-700">
                ⚠️ Backend enabled but not reachable. Using mock data as fallback.
              </p>
            )}
          </div>

          {/* Retry Button */}
          {backendEnabled && !backendReachable && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs"
              onClick={checkBackendConnection}
            >
              Retry Connection
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
