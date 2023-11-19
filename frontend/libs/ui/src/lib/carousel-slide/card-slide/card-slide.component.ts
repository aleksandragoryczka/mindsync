import { Component, ElementRef, Renderer2 } from '@angular/core';
import StringFormatter from '../../../../../shared/src/lib/utils/string-formatter';
import { Router } from '@angular/router';
import { CarouselSlideComponent } from '../carousel-slide.component';
import { ToastrService } from 'ngx-toastr';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';

@Component({
  selector: 'project-card-slide',
  templateUrl: './card-slide.component.html',
  styleUrls: ['./card-slide.component.scss'],
})
export class CardSlideComponent extends CarouselSlideComponent {
  StringFormatter = StringFormatter;

  constructor(
    private router: Router,
    private ngEl: ElementRef,
    private renderer: Renderer2,
    private toastrService: ToastrService,
    private quizService: QuizService
  ) {
    super(ngEl, renderer);
  }

  async getDetailsButton(): Promise<void> {
    await this.router.navigate([`/quiz/${this.data.id}`]);
  }

  async getShowsButton() {
    this.quizService.getQuizWithShows(this.data.id).subscribe(async res => {
      if (res.shows.totalElements > 0) {
        await this.router.navigate([`/${this.data.id}/shows`], {
          queryParams: { title: this.data.title },
        });
      } else {
        this.toastrService.warning(
          'There is no Shows connected with that Quiz'
        );
      }
    });
  }

  async startShow() {
    if (this.data.slides.length > 0) {
      await this.router.navigate([`/${this.data.id}/start-show`], {
        queryParams: { code: this.data.code },
      });
    } else {
      this.toastrService.warning(
        'You have to add at least one Slide to start a show.'
      );
    }
  }
}
