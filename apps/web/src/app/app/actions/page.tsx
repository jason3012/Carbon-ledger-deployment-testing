'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { formatCO2 } from '@/lib/utils';
import { Target, Check, Sparkles } from 'lucide-react';

export default function ActionsPage() {
  const [generating, setGenerating] = useState(false);

  const { data: recommendations, refetch } = trpc.recommendations.list.useQuery({});
  const generateMutation = trpc.recommendations.generate.useMutation();
  const generateAIMutation = trpc.recommendations.generateAIActionPlan.useMutation();
  const acceptMutation = trpc.recommendations.accept.useMutation();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Try AI-powered generation first, fall back to standard if it fails
      try {
        await generateAIMutation.mutateAsync({});
      } catch (error) {
        console.log('AI generation failed, using standard recommendations');
        await generateMutation.mutateAsync({});
      }
      await refetch();
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async (id: string) => {
    await acceptMutation.mutateAsync({ recommendationId: id });
    refetch();
  };

  const acceptedRecs = recommendations?.filter((r) => r.accepted) || [];
  const pendingRecs = recommendations?.filter((r) => !r.accepted) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Action Plan</h1>
          <p className="text-muted-foreground">
            Personalized recommendations to reduce your carbon footprint
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={generating}>
          <Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} />
          Generate Recommendations
        </Button>
      </div>

      {/* Pending Recommendations */}
      {pendingRecs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Suggested Actions</h2>
          {pendingRecs.map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span>{rec.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">{rec.description}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-primary">
                      {formatCO2(rec.estReductionKg)}
                    </p>
                    <p className="text-sm text-muted-foreground">potential reduction</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleAccept(rec.id)} size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Add to Action Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Accepted Actions */}
      {acceptedRecs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Action Plan</h2>
          <Card>
            <CardHeader>
              <CardTitle>Active Commitments</CardTitle>
              <CardDescription>
                Total potential reduction:{' '}
                <span className="font-bold text-primary">
                  {formatCO2(acceptedRecs.reduce((sum, r) => sum + r.estReductionKg, 0))}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {acceptedRecs.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted">
                    <div className="rounded-full bg-primary p-1 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCO2(rec.estReductionKg)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {(!recommendations || recommendations.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No recommendations yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Generate personalized recommendations based on your spending patterns
            </p>
            <Button onClick={handleGenerate} disabled={generating}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

