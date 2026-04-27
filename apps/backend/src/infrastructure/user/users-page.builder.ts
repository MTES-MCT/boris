import { Pagination } from 'src/application/common/pagination';
import { AdminUserListItemView } from 'src/application/user/views/admin-user-list-item.view';
import { UserRole } from 'src/domain/user/user-role.enum';
import { AdminUserDetailView } from 'src/application/user/views/admin-user-detail.view';
import { UserRole as Role } from 'src/domain/user/user-role.enum';
import { UsersFiltersView } from './users.types';

export class UsersPageBuilder {
  public static toRole(value?: string): UserRole | undefined {
    if (value === UserRole.ADMIN || value === UserRole.OFS) {
      return value;
    }

    return undefined;
  }

  public static roleLabel(role: UserRole): string {
    return role === UserRole.ADMIN ? 'Admin' : 'OFS';
  }

  public static activeLabel(isActive: boolean): string {
    return isActive ? 'Actif' : 'Inactif';
  }

  public static buildSharedFormView() {
    return {
      roles: [
        { value: Role.ADMIN, label: 'Admin' },
        { value: Role.OFS, label: 'OFS' },
      ],
      notes: {
        generatedPassword:
          'Le mot de passe initial sera généré automatiquement et affiché une seule fois après la création.',
      },
    };
  }

  public static buildListView(
    items: AdminUserListItemView[],
    pagination: Pagination<AdminUserListItemView>,
    filters: UsersFiltersView,
    selectedOfsName?: string,
  ) {
    const structuredFilterChips: { label: string; removeHref: string }[] = [];

    if (filters.role) {
      structuredFilterChips.push({
        label: this.roleLabel(filters.role as UserRole),
        removeHref: this.buildListHref(filters, { role: undefined, page: 1 }),
      });
    }

    if (typeof filters.isActive === 'boolean') {
      structuredFilterChips.push({
        label: this.activeLabel(filters.isActive),
        removeHref: this.buildListHref(filters, {
          isActive: undefined,
          page: 1,
        }),
      });
    }

    if (filters.ofsId && selectedOfsName) {
      structuredFilterChips.push({
        label: selectedOfsName,
        removeHref: this.buildListHref(filters, { ofsId: undefined, page: 1 }),
      });
    }

    return {
      items,
      pagination,
      structuredFilterChips,
      paginationLinks:
        pagination.pagesCount > 1
          ? this.buildPaginationLinks(pagination, filters)
          : [],
      lowOffset: (pagination.page - 1) * pagination.pageSize + 1,
      highOffset:
        pagination.page * pagination.pageSize > pagination.totalCount
          ? pagination.totalCount
          : pagination.page * pagination.pageSize,
    };
  }

  public static buildEditPageView(
    user: AdminUserDetailView,
    actorUserId: string,
    returnTo?: string,
  ) {
    const isSelf = actorUserId === user.id;
    const isAdmin = user.roles.includes(UserRole.ADMIN);

    return {
      ...this.buildSharedFormView(),
      isSelf,
      statusLabel: this.activeLabel(user.isActive),
      roleLabel: this.roleLabel(user.roles[0]),
      blocks: {
        emailChange: isSelf,
        adminRoleRemoval: isSelf && isAdmin,
      },
      backHref: this.resolveBackHref(returnTo),
    };
  }

  public static buildCreateErrors(error: unknown) {
    return this.buildMutationErrors(error);
  }

  public static buildUpdateErrors(error: unknown) {
    return this.buildMutationErrors(error);
  }

  public static buildMutationErrors(error: unknown) {
    const message = this.extractMessage(error);

    return {
      global: message,
      email: message,
      role: message,
      ofsIds: message,
    };
  }

  public static editPagePath(userId: string, returnTo?: string): string {
    if (returnTo && this.isSafeReturnTo(returnTo, ['/users', '/ofs/'])) {
      return `/users/${userId}/update?returnTo=${encodeURIComponent(returnTo)}`;
    }

    return `/users/${userId}/update`;
  }

  public static currentListHref(filters: UsersFiltersView): string {
    return this.buildListHref(filters, {});
  }

  public static resolveBackHref(returnTo?: string): string {
    if (returnTo && this.isSafeReturnTo(returnTo, ['/users', '/ofs/'])) {
      return returnTo;
    }

    return '/users';
  }

  public static isSafeReturnTo(
    value?: string,
    allowedPrefixes: string[] = ['/users', '/ofs/'],
  ): boolean {
    if (!value || !value.startsWith('/')) {
      return false;
    }

    return allowedPrefixes.some((prefix) => value.startsWith(prefix));
  }

  private static extractMessage(error: unknown): string {
    const message = (error as { message?: string }).message;

    if (message === 'Conflict') {
      return 'Un utilisateur avec cette adresse email existe déjà.';
    }

    if (message === 'Forbidden') {
      return "Cette action n'est pas autorisée.";
    }

    return 'Le formulaire contient des informations invalides.';
  }

  public static buildListHref(
    filters: UsersFiltersView,
    overrides: Partial<UsersFiltersView>,
  ): string {
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();

    if (next.page && next.page > 1) {
      params.set('page', `${next.page}`);
    }

    if (next.pageSize) {
      params.set('pageSize', `${next.pageSize}`);
    }

    if (next.role) {
      params.set('role', next.role);
    }

    if (typeof next.isActive === 'boolean') {
      params.set('isActive', `${next.isActive}`);
    }

    if (next.ofsId) {
      params.set('ofsId', next.ofsId);
    }

    if (next.search) {
      params.set('search', next.search);
    }

    const query = params.toString();

    return query ? `/users?${query}` : '/users';
  }

  private static buildPaginationLinks(
    pagination: Pagination<AdminUserListItemView>,
    filters: UsersFiltersView,
  ) {
    const links: Array<{
      label: string;
      href?: string;
      isCurrent?: boolean;
      isEllipsis?: boolean;
      disabled?: boolean;
    }> = [];

    links.push({
      label: 'Précédent',
      href: pagination.hasPreviousPage
        ? this.buildListHref(filters, { page: pagination.page - 1 })
        : undefined,
      disabled: !pagination.hasPreviousPage,
    });

    const totalPages = pagination.pagesCount;
    const candidates = [
      1,
      pagination.page - 1,
      pagination.page,
      pagination.page + 1,
      totalPages,
    ]
      .filter(
        (page, index, pages) =>
          page >= 1 && page <= totalPages && pages.indexOf(page) === index,
      )
      .sort((left, right) => left - right);

    let previous: number | undefined;

    for (const pageNumber of candidates) {
      if (previous && pageNumber - previous > 1) {
        links.push({ label: '...', isEllipsis: true });
      }

      links.push({
        label: `${pageNumber}`,
        href: this.buildListHref(filters, { page: pageNumber }),
        isCurrent: pageNumber === pagination.page,
      });

      previous = pageNumber;
    }

    links.push({
      label: 'Suivant',
      href: pagination.hasNextPage
        ? this.buildListHref(filters, { page: pagination.page + 1 })
        : undefined,
      disabled: !pagination.hasNextPage,
    });

    return links;
  }
}
