
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface VectorStatsCardProps {
  vectorStats: {
    totalVectors: number;
    dimension: number;
    indexFullness: number;
  };
}

const VectorStatsCard = ({ vectorStats }: VectorStatsCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-800">
          <Database className="w-5 h-5 mr-2 text-purple-500" />
          Vector Database (Pinecone)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{vectorStats.totalVectors.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Embeddings</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{vectorStats.dimension}</div>
            <div className="text-sm text-slate-600">Vector Dimension</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{(vectorStats.indexFullness * 100).toFixed(1)}%</div>
            <div className="text-sm text-slate-600">Index Fullness</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorStatsCard;
