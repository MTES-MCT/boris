import { DepartementInterface } from 'src/domain/departement/departement.interface';

export enum LandbotEligibility {
  TOUTE_LA_FRANCE = 1,
  ZONE_TENDUE = 2,
  INELIGIBLE = 3,
  ZONE_TRES_TENDUE = 4,
}

export enum LandbotBrsKnowledge {
  OUI = 'Oui',
  NON = 'Non',
  AUTRE = 'Je ne suis pas sûr·e',
}

export enum LandbotRealEstateSituation {
  PROPRIETAIRE = "propriétaire d'un logement",
  LOCATAIRE_SOCIAL = "locataire d'un logement social",
  LOCATAIRE_PRIVE = "locataire d'un logement privé",
  HEBERGEE = 'hebergé·e',
  AUTRE = 'dans une autre situation immobilière',
}

export enum LandbotDisability {
  OUI = 'Oui',
  NON = 'Non',
}

export enum LandbotDeclarationType {
  ACHAT_SEUL_SOUHAIT_SEUL = 'Seul·e et vous souhaitez acheter seul·e',
  ACHAT_SEUL_SOUHAIT_PARTENAIRE = 'Seul·e mais vous souhaitez acheter avec un·e partenaire',
  ACHAT_COMMUN = 'En commun',
}

export enum LandbotConnectionWish {
  OUI = 'Oui',
  NON = 'Non',
}

export interface LandbotCustomerInterface {
  id: string;
  date: Date;
  desiredCity?: string;
  departement?: DepartementInterface;
  eligibility?: LandbotEligibility;
  brsKnowledge?: LandbotBrsKnowledge;
  realEstateSituation?: LandbotRealEstateSituation;
  disability?: LandbotDisability;
  declarationType?: LandbotDeclarationType;
  connectionWish?: LandbotConnectionWish;
  resources?: number;
  hasProvidedEmail?: boolean;
}
