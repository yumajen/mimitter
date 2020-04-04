import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import { HttpClientModule } from '@angular/common/http';

describe('PostService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ],
    providers: [
      HttpClientModule,
    ],
  }));

  it('should be created', () => {
    const service: PostService = TestBed.inject(PostService);
    expect(service).toBeTruthy();
  });
});
