"use client";

import { ProjectStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectProps {
  value: ProjectStatus;
  onValueChange: (value: ProjectStatus) => void;
  className?: string;
}

export function StatusSelect({ value, onValueChange, className }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <SelectItem key={status} value={status}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
              {config.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

