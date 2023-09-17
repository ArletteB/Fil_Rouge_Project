export class CreateEventDto {
  title: string;
  cover: string;
  dateEvent: Date;
  adress: string;
  description: string;
  creatorUserId: string;
  participantIds?: string[];
}
