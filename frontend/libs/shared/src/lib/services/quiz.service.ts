import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import { QuizModel } from '../models/quiz.model';
import { environment } from 'apps/mindsync/src/environments/environment.development';
import { QuizWithShows } from '../models/quiz-with-shows.model';
import { QuizWithSlides } from '../models/quiz-with-slides.model';
import { UserWithQuizzesCountModel } from '../models/user-with-quizzes-count.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) {}

  addQuiz(newQuiz: FormData): Observable<QuizModel> {
    return this.http.post<QuizModel>(`${environment.apiUrl}/quiz`, newQuiz);
  }

  getQuizzesForUser(): Observable<PaginatedResult<QuizModel>> {
    return this.http.get<PaginatedResult<QuizModel>>(
      `${environment.apiUrl}/user/quiz`
    );
  }

  getUsersWithQuizzesCount(): Observable<UserWithQuizzesCountModel[]> {
    return this.http.get<UserWithQuizzesCountModel[]>(
      `${environment.apiUrl}/user/quiz-count`
    );
  }

  joinQuizByCode(code: string): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/quiz?verificationCode=${code}`
    );
  }

  getQuizzesWithShows(
    id: string,
    page = 0,
    size = 5
  ): Observable<QuizWithShows> {
    return this.http.get<QuizWithShows>(
      `${environment.apiUrl}/quiz/${id}/shows?page=${page}&size=${size}`
    );
  }

  getQuizWithSlides(id: string): Observable<QuizWithSlides> {
    return this.http.get<QuizWithSlides>(
      `${environment.apiUrl}/quiz/${id}/slides`
    );
  }

  deleteQuiz(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/quiz/${id}`);
  }
}
