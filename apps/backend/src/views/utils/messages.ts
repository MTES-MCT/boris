import { Column } from 'src/views/factories/table.factories';

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
  actions: {
    delete: 'Supprimer',
    closeModal: 'Fermer la modal',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer',
  },
  fields: {
    name: 'Nom',
    phone: 'Téléphone',
    websiteUrl: 'Site web',
    email: 'Adresse email',
    distributors: 'Commercialisateur(s)',
    departements: 'Département(s)',
    regions: 'Région(s)',
  },
  contents: {
    home: {
      title: 'Boris dashboard',
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

export default messages;
