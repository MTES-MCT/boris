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
        distributor?: { id: string; name: string } | null;
      } | null;
      selectableOfss?: {
        id: string;
        name: string;
        email?: string | null;
        regions?: string[];
        departements?: string[];
      }[];
      distributorSelectableOfss?: {
        id: string;
        name: string;
      }[];
      selectedDistributorOfsId?: string;
      currentOfs?: { id: string; name: string } | null;
      isAuthenticatedApp?: boolean;
    }
  }
}

export {};
