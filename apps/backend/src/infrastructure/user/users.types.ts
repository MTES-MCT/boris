import { UsersSort } from 'src/domain/user/user.repository.interface';

export type UsersFiltersView = {
  page: number;
  pageSize: number;
  role?: string;
  isActive?: boolean;
  ofsId?: string;
  search: string;
  sort?: UsersSort;
};
