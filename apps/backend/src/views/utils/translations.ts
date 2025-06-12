import { Column } from 'src/views/factories/table.factories';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import { OfsView } from 'src/application/ofs/views/ofs.view';

type EntityPage<T> = {
  title: string;
  action: {
    label: string;
  };
  columns: Column<T>[];
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
      ],
    },
  },
};

export default translations;
