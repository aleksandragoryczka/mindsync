import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QuizModel } from '../../../../../libs/shared/src/lib/models/quiz.model';
import { PaginatedResult } from 'libs/shared/src/lib/models/paginated-result.model';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';
import QuizzesDisplayNumberGetter from '../../../../../libs/shared/src/lib/utils/quizzes-display-number-getter';

@Component({
  selector: 'project-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  listOfQuizzes$: Observable<QuizModel[]>;
  slideConfig = {};

  constructor(private quizService: QuizService) {
    this.listOfQuizzes$ = this.loadQuizzes();
    this.listOfQuizzes$.subscribe(res => {
      const quizzesNumber = res.length;
      const slidesToShowTmp =
        QuizzesDisplayNumberGetter.getQuizzesNumberToDisplay(quizzesNumber);
      const slidesToShowResponsiveTmp = quizzesNumber < 3 ? slidesToShowTmp : 3;
      this.slideConfig = {
        slidesToShow: slidesToShowTmp,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        autoplaySpeed: 3400,
        variableWidth: false,
        infinite: true,
        responsive: [
          {
            breakpoint: 1550,
            settings: {
              slidesToShow: slidesToShowResponsiveTmp,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1150,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
    });
  }

  private loadQuizzes(): Observable<QuizModel[]> {
    return this.quizService.getQuizzesForUser().pipe(
      map((res: PaginatedResult<QuizModel>) => {
        return res.content;
      })
    );
  }
}
