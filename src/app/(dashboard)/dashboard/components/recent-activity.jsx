// src/app/(dashboard)/dashboard/components/recent-activity.jsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function RecentActivity({ activities }) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          近期活动
        </CardTitle>
        <CardDescription>最近在您的平台上的活动日志。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* 可根据用户ID生成不同头像 */}
              <AvatarImage src={`https://avatar.vercel.sh/${activity.user}.png`} alt="Avatar" />
              <AvatarFallback>{activity.user.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.user}</p>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
            </div>
            <div className="ml-auto font-medium text-sm text-muted-foreground">
              {activity.time}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}