export interface Person {
  firstname: string;
  lastname: string;
  jobtitle: string;
  group_id?: number;
}

export interface DbPersonRespons extends Person {
  person_id: number;
  dateCreated: Date;
  dateUpdated: Date;
}

export type UpdatePersonRequest = Partial<Person>;
