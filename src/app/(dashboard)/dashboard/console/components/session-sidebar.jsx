// src/app/(dashboard)/dashboard/console/components/session-sidebar.jsx
'use client';

import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import SettingsPanel from "./settings-panel";
import { cn } from "@/lib/utils";

export default function SessionSidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  settings,
  setSettings,
  isLoading
}) {
  return (
    <div className="flex flex-col h-full p-4 border-l bg-background w-80">
      <Button onClick={onNewSession} disabled={isLoading}>
        <Plus className="mr-2 h-4 w-4" />
        新对话
      </Button>

      <div className="flex-1 mt-4 overflow-y-auto">
        <p className="text-sm font-semibold text-muted-foreground mb-2">历史会话</p>
        <div className="space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => onSwitchSession(session.id)}
              className={cn(
                "group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted",
                activeSessionId === session.id && "bg-muted"
              )}
            >
              <div className="flex items-center truncate">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">
                  {session.messages[0]?.content || "新对话"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发切换会话事件
                  onDeleteSession(session.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <SettingsPanel settings={settings} setSettings={setSettings} isLoading={isLoading} />
      </div>
    </div>
  );
}