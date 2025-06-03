import { Column } from '../admin/factories/table.factories';

type EntityPage = {
  title: string;
  action: {
    label: string;
  };
  columns: Column[];
};

type Messages = {
  errors: {
    label: string;
    login: {
      invalidCredentials: string;
    };
  };
  contents: {
    home: {
      title: string;
    };
    ofs: EntityPage;
  };
};

const messages: Messages = {
  errors: {
    label: 'error',
    login: {
      invalidCredentials: 'Identifiant ou mot de passe incorrect',
    },
  },
  contents: {
    home: {
      title: 'Boris dashboard',
    },
    ofs: {
      title: 'Organismes de foncier solidaire',
      action: {
        label: 'Ajouter un OFS',
      },
      columns: [
        { key: 'name', label: 'Nom', type: 'string' },
        { key: 'regions', label: 'Région(s)', type: 'array', arrayKey: 'name' },
        {
          key: 'departements',
          label: 'Départements(s)',
          type: 'array',
          arrayKey: 'name',
        },
        {
          key: 'distributors',
          label: 'Commercialisateur(s)',
          type: 'array',
          arrayKey: 'name',
        },
        { key: 'phone', label: 'Téléphone', type: 'string' },
        { key: 'websiteUrl', label: 'Site internet', type: 'link' },
        { key: 'email', label: 'Email', type: 'mailto' },
      ],
    },
  },
};

export default messages;
