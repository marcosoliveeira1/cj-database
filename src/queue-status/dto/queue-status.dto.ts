export class QueueCountsDto {
  active: number;
  completed: number;
  delayed: number;
  failed: number;
  paused: number;
  prioritized: number;
  waiting: number;
  waitingChildren: number;
}

export class QueueStatusResponseDto {
  name: string;
  counts: QueueCountsDto;
}