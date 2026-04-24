declare global {
  namespace App {
    interface Error {
      message: string;
      backHref?: string;
    }

    interface Locals {}
    interface PageData {
      flash?: {
        type: "success" | "error";
        message: string;
      };
      user?: {
        id: string;
        email: string;
        roles: string[];
        canAccessAllOfss: boolean;
        ofss: { id: string; name: string }[];
      } | null;
      selectableOfss?: {
        id: string;
        name: string;
        email?: string | null;
        regions?: string[];
        departements?: string[];
      }[];
      currentOfs?: { id: string; name: string } | null;
      isAuthenticatedApp?: boolean;
    }
  }
}

export {};
