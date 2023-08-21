import { PaginatedResult } from './paginated-result.model';
import { ShowModel } from './show.model';

export interface PresentationWithShows {
  id: string;
  title: string;
  shows: PaginatedResult<ShowModel>;
}
