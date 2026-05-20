export type PlannerView = 'list' | 'editor';

export type TravelRecord = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  summary: string;
  companions: string[];
  shareCode: string;
};

export type TravelField = {
  label: string;
  placeholder: string;
  type?: 'text' | 'date' | 'number' | 'textarea' | 'time' | 'select' | 'checkbox';
  datalistId?: string;
  disabledWhen?: {
    label: string;
    value: string;
  };
  isCost?: boolean;
};

export type TravelModule = {
  id: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
  label: string;
  icon: 'flight' | 'car' | 'hotel' | 'restaurant' | 'activity';
  fields: TravelField[];
};

export type JellyCard = {
  id: string;
  moduleId: TravelModule['id'];
};

export type TravelFormValues = Record<string, Record<string, Record<string, string>>>;

export type PlannerPayload = {
  travels: TravelRecord[];
  timelineCards: Record<string, JellyCard[]>;
  formValues: TravelFormValues;
  knownCompanions: string[];
};
