import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QuizModel } from '../../../../../libs/shared/src/lib/models/quiz.model';
import { PaginatedResult } from 'libs/shared/src/lib/models/paginated-result.model';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';

@Component({
  selector: 'project-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  listOfQuizzes$: Observable<QuizModel[]> = this.loadQuizzes();

  constructor(private quizService: QuizService) {}

  private loadQuizzes(): Observable<QuizModel[]> {
    return this.quizService
      .getQuizzesForUser()
      .pipe(map((res: PaginatedResult<QuizModel>) => res.content));
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    //autoplay: true,
    arrows: true,
    autoplaySpeed: 3400,
    infinite: true,
    responsive: [
      {
        breakpoint: 1550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
}
