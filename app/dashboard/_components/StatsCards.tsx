"use client";

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/routes';
import { DateToUTCDate } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

interface Props{
    from: Date;
    to: Date;
    userSettings: UserSettings;
}

function StatsCards({from , to, userSettings }: Props) {
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => {
            fetch(`/api/stats/balance?from${DateToUTCDate(from)} &
            to${DateToUTCDate(to)}`
        ).then((res) => res.json())
        }
    })
  return (
    <div>StatsCards</div>
  )
}

export default StatsCards