import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = 'api/posts';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  createPost(param: Post): Observable<Post> {
    return this.http.post<Post>(this.url, param, this.httpOptions);
  }

  updatePost(param: Post): Observable<Post> {
    return this.http.put<Post>(this.url, param, this.httpOptions);
  }

  deletePost(id: string): Observable<Post> {
    const url = `${this.url}/${id}`;
    return this.http.delete<Post>(url, this.httpOptions);
  }

}
