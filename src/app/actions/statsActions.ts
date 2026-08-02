'use server';

import { GetStatsResult } from '@/global/types';
import databaseConnect from '@/lib/database';
import PromptModel from '@/models/Prompt';
import TemplateModel from '@/models/Templates';

export async function getWorkspaceStatsAction(): Promise<GetStatsResult> {
  try {
    await databaseConnect();

    // Run parallel DB queries for optimal performance
    const [totalPrompts, totalTemplates, runsAggregation, usesAggregation, distinctProviders] =
      await Promise.all([
        PromptModel.countDocuments(),
        TemplateModel.countDocuments(),
        PromptModel.aggregate([{ $group: { _id: null, total: { $sum: '$executionCount' } } }]),
        TemplateModel.aggregate([{ $group: { _id: null, total: { $sum: '$uses' } } }]),
        PromptModel.distinct('modelConfig.provider'),
      ]);

    const totalRuns = runsAggregation[0]?.total ?? 0;
    const totalTemplateUses = usesAggregation[0]?.total ?? 0;
    const providersCount = distinctProviders.filter(Boolean).length || 2; // fallback to default if 0

    return {
      success: true,
      stats: {
        totalPrompts,
        totalTemplates,
        totalRuns,
        totalTemplateUses,
        providersCount,
        // Add default future metrics here when ready:
        // totalFavorites: 0,
        // totalUsers: 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch workspace stats:', error);
    return {
      success: false,
      error: 'Failed to load workspace statistics.',
    };
  }
}
