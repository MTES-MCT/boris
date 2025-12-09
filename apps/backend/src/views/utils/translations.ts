import { Column } from 'src/views/factories/table.factories';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { RegionView } from 'src/application/region/views/region.view';
import { DepartementView } from 'src/application/departement/views/departement.view';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';

type EntityPage<T> = {
  title: string;
  action?: {
    label: string;
  };
  columns?: Column<T>[];
};

type AlertType = {
  label: string;
  defaultLabel: string;
  defaultContent: string;
};

type translations = {
  error: AlertType & {
    login: {
      invalidCredentials: string;
    };
  };
  success: AlertType;
  actions: {
    [key: string]: string;
  };
  fields: {
    [key: string]: string;
  };
  contents: {
    home: {
      title: string;
    };
    ofs: EntityPage<OfsView>;
    distributors: EntityPage<DistributorView>;
    regions: EntityPage<RegionView>;
    departements: EntityPage<DepartementView>;
    brsDiffusionWebsites: EntityPage<BrsDiffusionWebsiteView>;
  };
};

const translations: translations = {
  error: {
    label: 'Erreur',
    defaultLabel: 'Erreur',
    defaultContent: 'Une erreur est survenue.',
    login: {
      invalidCredentials: 'Identifiant ou mot de passe incorrect',
    },
  },
  success: {
    label: 'Succès',
    defaultLabel: 'Succès',
    defaultContent: `L'opération a été effectuée avec succès.`,
  },
  actions: {
    delete: 'Supprimer',
    closeModal: 'Fermer la modal',
    update: 'Modifier',
    view: 'Voir',
  },
  fields: {
    name: 'Nom',
    phone: 'Téléphone',
    websiteUrl: 'Site web',
    websiteUrlInputHint:
      'Veuillez entrer une URL valide commençant par http:// ou https://',
    email: 'Adresse email',
    distributors: 'Commercialisateur(s)',
    departements: 'Département(s)',
    regions: 'Région(s)',
    source: 'Source',
    distributorName: 'Nom du commercialisateur',
    ofsName: "Nom de l'OFS",
    city: 'Ville',
    zipcode: 'Code postal',
    inseeCode: 'Code INSEE',
    address: 'Adresse',
    latitude: 'Latitude',
    longitude: 'Longitude',
    producesBrs: 'Produit du BRS',
    isPartner: 'Est partenaire',
  },
  contents: {
    home: {
      title: 'Boris dashboard',
    },
    distributors: {
      title: 'Commercialisateurs',
      action: {
        label: 'Créer un commercialisateur',
      },
      columns: [
        { key: 'name', label: 'Nom', type: 'string' },
        { key: 'websiteUrl', label: 'Site web', type: 'link' },
        { key: 'id', label: 'Actions', type: 'actions' },
      ],
    },
    ofs: {
      title: 'Organismes de foncier solidaire',
      action: {
        label: 'Créer un OFS',
      },
      columns: [
        { key: 'name', label: 'Nom', type: 'string' },
        {
          key: 'regions',
          label: 'Région(s)',
          type: 'array',
          arrayKey: 'name',
          color: 'blue',
        },
        {
          key: 'departements',
          label: 'Départements(s)',
          type: 'array',
          arrayKey: 'name',
          color: 'green',
        },
        {
          key: 'distributors',
          label: 'Commercialisateur(s)',
          type: 'array',
          arrayKey: 'name',
          color: 'purple',
        },
        {
          key: 'id',
          label: 'Actions',
          type: 'actions',
        },
        {
          key: 'id',
          label: 'entity',
          type: 'entity',
        },
      ],
    },
    regions: {
      title: 'Régions',
    },
    departements: {
      title: 'Départements',
    },
    brsDiffusionWebsites: {
      title: 'Sites de diffusion BRS',
      action: {
        label: 'Créer un site de diffusion BRS',
      },
      columns: [
        { key: 'source', label: 'Source', type: 'link' },
        { key: 'distributorName', label: 'Commercialisateur', type: 'string' },
        { key: 'ofsName', label: 'OFS', type: 'string' },
        { key: 'city', label: 'Ville', type: 'string' },
        { key: 'zipcode', label: 'Code postal', type: 'string' },
        {
          key: 'region',
          label: 'Région',
          type: 'relationnal',
          arrayKey: 'name',
        },
        {
          key: 'departement',
          label: 'Département',
          type: 'relationnal',
          arrayKey: 'name',
        },
        { key: 'id', label: 'Actions', type: 'actions' },
      ],
    },
  },
};

export default translations;
