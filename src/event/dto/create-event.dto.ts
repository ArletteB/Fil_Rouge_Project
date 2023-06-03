export class CreateEventDto {
  title: string;
  cover: string;
  dateEvent: Date;
  adress: string;
  description: string;
  creatorUserId: string;
  participantIds?: string[];
}

// Pour les évenements ce sera en fonction du code postal ?
