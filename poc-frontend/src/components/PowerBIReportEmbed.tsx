'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PowerBIEmbedProps {
  reportId?: string;
  embedUrl?: string;
}

export default function PowerBIReportEmbed({ reportId, embedUrl }: PowerBIEmbedProps) {
  const { getAccessToken } = useAuth();
  const reportRef = useRef<any>(null);
  const [PowerBIEmbed, setPowerBIEmbed] = useState<any>(null);
  const [models, setModels] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Only load Power BI modules on client side
  useEffect(() => {
    setIsClient(true);

    const loadPowerBIModules = async () => {
      try {
        const [powerBIReact, powerBIClient] = await Promise.all([
          import('powerbi-client-react'),
          import('powerbi-client')
        ]);

        setPowerBIEmbed(() => powerBIReact.PowerBIEmbed);
        setModels(powerBIClient.models);
      } catch (error) {
        console.warn('Power BI modules not available, using POC mode');
      }
    };

    loadPowerBIModules();
  }, []);

  useEffect(() => {
    if (!models || !isClient) return;

    const loadReport = async () => {
      const token = await getAccessToken();
      if (token && reportRef.current) {
        // In a real implementation, we would load the report here
        // For POC, we'll show a placeholder
      }
    };

    loadReport();
  }, [models, isClient]);

  // For POC demonstration, show a placeholder instead of actual Power BI embedding
  // This allows us to test the UI without needing actual Power BI credentials
  // Always show placeholder in POC mode OR when no Power BI config is provided
  const isPocMode = process.env.NEXT_PUBLIC_POC_MODE === 'true';
  if (isPocMode || !process.env.NEXT_PUBLIC_POWERBI_REPORT_ID || !PowerBIEmbed || !models) {
    return (
      <div className="w-full h-full bg-white border flex flex-col">
        <div className="bg-gray-800 text-white p-2 text-sm">
          HR Compliance Dashboard - POC Mode
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Workforce Compliance Overview</h2>

          {/* Mock chart area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Overall Compliance Rate</h3>
              <div className="text-3xl font-bold text-blue-600">73.2%</div>
              <div className="text-sm text-gray-600">↑ 2.1% from last month</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-2">Regions Below Target</h3>
              <div className="text-3xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">EMEA, APAC</div>
            </div>
          </div>

          {/* Mock table */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Regional Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span>North America</span>
                <span className="text-green-600 font-medium">75.8%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>EMEA</span>
                <span className="text-red-600 font-medium">68.4%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>APAC</span>
                <span className="text-yellow-600 font-medium">71.9%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 p-2 border-t">
          POC Mode: Configure NEXT_PUBLIC_POWERBI_REPORT_ID to connect real Power BI report
        </div>
      </div>
    );
  }

  // Create config only when models is available
  const config = {
    type: 'report' as const,
    id: reportId || process.env.NEXT_PUBLIC_POWERBI_REPORT_ID || 'placeholder-report-id',
    embedUrl: embedUrl || process.env.NEXT_PUBLIC_POWERBI_EMBED_URL || 'https://app.powerbi.com/reportEmbed',
    accessToken: '', // Will be set dynamically
    tokenType: models.TokenType.Aad,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false,
        },
        pageNavigation: {
          visible: false,
        },
      },
      bars: {
        statusBar: {
          visible: false,
        },
      },
    },
    filters: [], // Will add hierarchical filters here
  };

  return (
    <div className="w-full h-full">
      <PowerBIEmbed
        embedConfig={config}
        eventHandlers={new Map([
          ['loaded', function () {
            console.log('Report loaded');
          }],
          ['rendered', function () {
            console.log('Report rendered');
          }],
          ['error', function (event: any) {
            console.error('Report error:', event);
          }],
        ])}
        cssClassName="w-full h-full"
        getEmbeddedComponent={(embeddedReport: any) => {
          reportRef.current = embeddedReport;
        }}
      />
    </div>
  );
}