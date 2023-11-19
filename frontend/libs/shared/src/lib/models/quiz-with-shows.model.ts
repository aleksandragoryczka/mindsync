import { PaginatedResult } from './paginated-result.model';
import { ShowModel } from './show.model';

export interface QuizWithShows {
  id: string;
  title: string;
  shows: PaginatedResult<ShowModel>;
}
