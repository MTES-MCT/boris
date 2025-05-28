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
    ofs: {
      title: string;
      tableHeads: Array<{
        label: string;
      }>;
    };
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
      tableHeads: [
        { label: 'Nom' },
        { label: 'Région(s)' },
        { label: 'Départements(s)' },
        { label: 'Commercialisateur(s)' },
        { label: 'Téléphone' },
        { label: 'Site internet' },
        { label: 'Email' },
      ],
    },
  },
};

export default messages;
